import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getAccessToken({ user }): string {
    return this.jwtService.sign(
      {
        email: user.email,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '5s',
      },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '2w',
      },
    );

    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 14 * 1000, // 2주
      // secure: true, // HTTPS 사용 시 주석 해제
      // domain: 'localhost:3000', // 필요한 경우 도메인 설정
      // sameSite: 'None', // 다른 도메인 간 요청에 필요
    });
  }
}
