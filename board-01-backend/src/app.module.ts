import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './api/board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/user/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'root',
      password: 'root',
      database: 'board',
      entities: [__dirname + '/api/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    BoardModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
