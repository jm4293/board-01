import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  PASSWORD_SALT = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(input: LoginUserDto) {
    const query = `SELECT * FROM user WHERE email = '${input.email}'`;
    const validUser = await this.userRepository.query(query);
    const validPassword = await bcrypt.compare(input.password, validUser[0].password);

    if (validUser.length === 0) {
      throw new HttpException('존재하지 않는 이메일입니다.', HttpStatus.BAD_REQUEST);
    }

    if (!validPassword) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    return {
      status: 200,
      message: '로그인이 완료되었습니다.',
      result: {
        email: validUser[0].email,
        name: validUser[0].name,
        age: validUser[0].age,
        phone: validUser[0].phone,
      },
    };
  }

  async createUser(input: CreateUserDto) {
    const email = input.email;
    const hashedPassword = await bcrypt.hash(input.password, this.PASSWORD_SALT);
    // const user = await this.userRepository.findOne({ where: { email } });

    const query = `SELECT * FROM user WHERE email = '${email}'`;
    const user = await this.userRepository.query(query);

    console.log('user', user);

    if (user.length !== 0) {
      throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.BAD_REQUEST);
    }

    // const result = await this.userRepository.save({
    //   ...input,
    //   password: hashedPassword,
    // });

    const query2 = `INSERT INTO user (email, password, name, age, phone) VALUES (?, ?, ?, ?, ?)`;
    const values = [email, hashedPassword, input.name, input.age, input.phone];
    await this.userRepository.query(query2, values);

    return {
      status: 200,
      message: '회원가입이 완료되었습니다.',
    };
  }
}
