import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Request } from 'express';
import { Board } from './entities/board.entity';

interface IResult {
  status: number;
  message: string;
}

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/user_all')
  findAll() {
    return this.boardService.findAll();
  }

  @Get('/user')
  find(@Req() request: Request) {
    return this.boardService.findOne(+request.query.idx);
  }

  @Post('/register')
  create(@Body() body: CreateBoardDto): Promise<IResult> {
    return this.boardService.create(body);
  }

  @Post('/modify')
  update(@Body() body: Board) {
    return this.boardService.update(body);
  }

  @Post('/delete')
  remove(@Body() body: { idx: number }) {
    console.log(body);
    return this.boardService.remove(body.idx);
  }
}
