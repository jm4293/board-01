import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './api/board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
