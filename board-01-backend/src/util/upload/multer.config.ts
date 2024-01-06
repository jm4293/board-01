import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  dirPath: string;
  constructor() {
    this.dirPath = path.join(__dirname, '..', '..', '..', 'public', 'uploads');
    this.mkdir();
  }

  mkdir() {
    try {
      fs.readdirSync(this.dirPath);
    } catch (error) {
      fs.mkdirSync(this.dirPath);
    }
  }

  createMulterOptions() {
    const dirPath = this.dirPath;
    const options = {
      storage: multer.diskStorage({
        // 파일 저장위치 설정
        destination(req, file, done) {
          done(null, dirPath);
        },
        // 파일명 설정
        filename(req, file, done) {
          const ext = path.extname(file.originalname);
          const fileName = path.basename(file.originalname, ext) + new Date().valueOf() + ext;
          done(null, fileName);
        },
      }),
      // limit: { fileSize: 5 * 1024 * 1024 }, // 용량 제한, 5MB, bytes 단위, 기본값은 1MB, 1MB = 1024 * 1024 bytes
    };
    return options;
  }
}
