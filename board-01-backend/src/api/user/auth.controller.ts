import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';

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
      throw new HttpException('이메일 또는 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      throw new HttpException('이메일 또는 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    this.authService.setRefreshToken({ user: user[0], res });

    const jwt = this.authService.getAccessToken({ user: user[0] });

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

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  // restoreAccessToken(@Req() req: Request & { user: Pick<User, 'email'> }, @Res() res: Response) {
  restoreAccessToken(@Req() req: Request & { user: Pick<User, 'email'> }, @Res() res: Response) {
    console.log('req', req);
    // console.log('res', res);
    return this.authService.getAccessToken({ user: res.locals.user });
  }
}
