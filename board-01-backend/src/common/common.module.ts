import { Module } from '@nestjs/common';
import { JWTAccessStrategy } from './jwt-access.strategy';
import { JWTRefreshStrategy } from './jwt-refrech.strategy';

@Module({
  imports: [],
  providers: [JWTAccessStrategy, JWTRefreshStrategy],
  exports: [JWTAccessStrategy, JWTRefreshStrategy],
})
export class CommonModule {}
