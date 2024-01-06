import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../util/upload/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
