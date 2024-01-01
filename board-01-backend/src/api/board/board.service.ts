import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { IsNull, Not, Repository } from 'typeorm';

interface IResult {
  status: number;
  message: string;
}

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ result: Board[]; total: number }> {
    // const [result, total] = await this.boardRepository.findAndCount({
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
    // return { result: result, total: total };

    try {
      const query = `SELECT * FROM board ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;
      const result = await this.boardRepository.query(query);

      const query2 = `SELECT COUNT(*) FROM board`;
      const total = await this.boardRepository.query(query2);

      return { result: result, total: +total[0]['COUNT(*)'] };
    } catch (error) {
      throw new Error('error');
    }
  }

  async findOne(idx: number) {
    // const result = await this.boardRepository.findOne({ where: { idx } });

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
    console.log('body', body);
    try {
      // await this.boardRepository.save(body);

      const query = 'INSERT INTO board (title, content) VALUES (?, ?)';
      const values = [body.title, body.content]; // 값 바인딩
      await this.boardRepository.query(query, values);

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
    // const idx = body.idx;
    // const isCheck = await this.boardRepository.findOne({ where: { idx } });

    const query = `SELECT * FROM board WHERE idx = ${body.idx}`;
    const result = await this.boardRepository.query(query);

    if (result) {
      // await this.boardRepository.update(body.idx, body);

      const query = `UPDATE board SET title=?, content=? WHERE idx = ?`;
      const values = [body.title, body.content, body.idx];
      await this.boardRepository.query(query, values);

      return {
        status: 200,
        message: '수정 되었습니다.',
      };
    } else {
      return {
        status: 400,
        message: '수정 실패했습니다.',
      };
    }
  }

  async remove(idx: number) {
    // const isCheck = await this.boardRepository.findOne({ where: { idx } });

    const query = `SELECT * FROM board WHERE idx = ${idx}`;
    const isCheck = await this.boardRepository.query(query);

    if (isCheck) {
      // await this.boardRepository.softDelete(idx);

      const query2 = `UPDATE board SET deletedAt = NOW() WHERE idx = ${idx}`;
      await this.boardRepository.query(query2);

      return {
        status: 200,
        message: 'success',
      };
    } else {
      return {
        status: 400,
        message: '게시물을 찾을 수 없습니다.',
      };
    }

    // if (isCheck) {
    //   const query = `DELETE FROM board WHERE idx = ${idx}`;
    //   await this.boardRepository.query(query);
    //
    //   return {
    //     status: 200,
    //     message: 'success',
    //   };
    // } else {
    //   return {
    //     status: 400,
    //     message: '없는 사용자입니다.',
    //   };
    // }
  }
}
