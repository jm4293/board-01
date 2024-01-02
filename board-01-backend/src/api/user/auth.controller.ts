import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('login')
  async login(@Body() input: LoginUserDto, @Res() res: Response) {
    const { email, password } = input;

    const query = `SELECT * FROM user WHERE email = '${email}'`;
    const user = await this.userRepository.query(query);

    if (user.length === 0) {
      // return res.status(400).json({
      //   status: 400,
      //   message: '존재하지 않는 이메일입니다.',
      // });

      throw new HttpException('이메일 또는 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      // return res.status(400).json({
      //   status: 400,
      //   message: '비밀번호가 일치하지 않습니다.',
      // });

      throw new HttpException('이메일 또는 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    this.authService.setRefreshToken({ user: user[0], res });

    const jwt = this.authService.getAccessToken({ user: user[0] });

    // return res.status(200).send(jwt);

    return res.status(200).json({
      status: 200,
      message: '로그인이 완료되었습니다.',
      result: {
        email: user[0].email,
        name: user[0].name,
        age: user[0].age,
        phone: user[0].phone,
        jwt,
      },
    });
  }
}
