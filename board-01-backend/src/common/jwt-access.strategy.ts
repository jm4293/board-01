import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JWTAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
