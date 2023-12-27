import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

interface IResult {
  status: number;
  message: string;
}

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  findAll(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async findOne(idx: number) {
    // return this.boardRepository.findOne({ where: { idx } });

    try {
      const query = `SELECT * FROM board WHERE idx = ${idx}`;
      const result = await this.boardRepository.query(query);

      if (result) {
        return result[0];
      }
    } catch (error) {
      throw new NotFoundException(`Not found board id: ${idx}`);
    }
  }

  async create(body: CreateBoardDto): Promise<IResult> {
    try {
      await this.boardRepository.save(body);

      // console.log('body', body); // body { title: '555', content: '555' }
      // const query = `INSERT INTO board ("title", "content") VALUES (?)`;
      // const values = [body.title, body.content]; // 값 바인딩
      // const result = await this.boardRepository.query(query, values);

      return {
        status: 200,
        message: '등록되었습니다.',
      };
    } catch (error) {
      return {
        status: 400,
        message: '등록실패했습니다.',
      };
    }
  }

  async update(body: Board) {
    console.log('body', body);
    const idx = body.idx;
    const isCheck = await this.boardRepository.findOne({ where: { idx } });

    if (isCheck) {
      await this.boardRepository.update(idx, body);

      // const query = `// UPDATE board SET title=${body.title} content=${body.content} WHERE idx = ${body.idx}`;
      // await this.boardRepository.query(query);

      return {
        status: 200,
        message: '수정 되었습니다.',
      };
    } else {
      return {
        status: 400,
        message: '없는 사용자입니다.',
      };
    }
  }

  async remove(idx: number) {
    const isCheck = await this.boardRepository.findOne({ where: { idx } });

    if (isCheck) {
      // await this.boardRepository.delete(idx);

      const query = `DELETE FROM board WHERE idx = ${idx}`;
      await this.boardRepository.query(query);

      return {
        status: 200,
        message: 'success',
      };
    } else {
      return {
        status: 400,
        message: '없는 사용자입니다.',
      };
    }
  }
}
