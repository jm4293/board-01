import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JWTRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: req => {
        const cookie = req.cookies['refreshToken'];
        return cookie;
      },
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    });
  }

  // 검증 성공시 실행, 실패하면 에러
  // Passport는 validate 성공시 리턴값을 reqquest.user에 저장함
  validate(payload) {
    console.log('payload', payload);
    return { email: payload.email };
  }
}
