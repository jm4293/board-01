import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Request, Response } from 'express';
import { Board } from './entities/board.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

interface IResult {
  status: number;
  message: string;
}

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/user_all')
  findAll(
    @Query() query: { page: number; limit: number },
  ): Promise<{ result: Board[]; total: number }> {
    return this.boardService.findAll(query.page, query.limit);
  }

  @UseGuards(AuthGuard('access'))
  @Get('/user')
  find(@Req() request: Request): Promise<Board> {
    return this.boardService.findOne(+request.query.idx);
  }

  @Post('/register')
  create(@Body() body: CreateBoardDto): Promise<IResult> {
    return this.boardService.create(body);
  }

  @Put('/modify')
  update(@Body() body: Board) {
    return this.boardService.update(body);
  }

  @Delete('/delete')
  remove(@Req() req: Request) {
    return this.boardService.remove(+req.query.idx);
  }

  @Post('/uploads/multi')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
    ]),
  )
  uploadMultiFile(
    @UploadedFiles() files: { file1: Express.Multer.File; file2: Express.Multer.File },
  ) {
    console.log(files);
    return this.boardService.fileUpload(files.file1[0], files.file2[0]);
  }

  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', filename);

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    // 응답 헤더 설정
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    // 파일 스트림 생성 및 응답으로 보내기
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
