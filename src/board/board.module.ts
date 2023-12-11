import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import BoardEntity from 'src/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import UsersEntity from 'src/entities/auth.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import getRandom from 'src/utils/getRandom';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (): MulterOptions => {
        return {
          storage: diskStorage({
            destination(req, file, done) { // 파일을 저장할 위치를 설정합니다.
              done(null, resolve(process.cwd(), 'public/marketImg'));
            },
            filename(req, file, done) { // 파일의 이름을 설정합니다.
              const fileExtName = extname(file.originalname);
              done(null, `${getRandom('all', 12)}_${Date.now()}${fileExtName}`);
            },
          }),
          limits: { fileSize: 10 * 1024 * 1024 }, // 10MB로 크기를 제한
          fileFilter: (req, file, done) => {
            const mime = ['image/png', 'image/jpeg']
            if (!mime.includes(file.mimetype))
              return done(null, false);
            return done(null, true);
          }
        };
      }
    }),
  TypeOrmModule.forFeature([BoardEntity,UsersEntity]),
  JwtModule.register({
    secret: process.env.SECRET_TOKEN,
}),],
  providers: [BoardService],
  controllers: [BoardController]
})
export class BoardModule {}
 