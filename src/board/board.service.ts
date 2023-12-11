import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request,Response } from 'express';
import BoardEntity from 'src/entities/board.entity';
import AuthEntity from 'src/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import UsersEntity from 'src/entities/auth.entity';
import * as fs from 'fs';
import path, { join } from 'path';
import { CreateBoardDto } from './DTO/createDTO';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardEntity)
        private readonly boardRepository: Repository<BoardEntity>,
        @InjectRepository(UsersEntity)
        private readonly authRepository: Repository<AuthEntity>,
        private readonly jwtService: JwtService
    ){}
    async create(body: CreateBoardDto, req:Request, res: Response, file: Express.Multer.File) {
        const successLogin = req.headers.authorization;

        const {name,price,info,material} = body;
        console.log(req.body)
        const verify = this.jwtService.verify(successLogin.replace("Bearer ", ""),{secret: process.env.SECRET_TOKEN})
        const user = await this.authRepository.findOne({
            where: {
                uuid: verify.uuid
            },
        });

        try{
            if(!name){ throw {status: 400, message: '제품 이름을 입력해주세요'} };
            if(!price){ throw {status: 400, message: '제품 가격을 입력해주세요'} };
            if(!info){ throw {status: 400, message: '제품 설명을 입력해주세요'} };
            if(!material){ throw {status: 400, message: '이 물건의 주된 재료의 이름을 입력해주세요'} };
            if(!file){ throw {status: 400, message: '물건의 이미지를 넣어주세요'} };
            if(!user){ throw {status: 400 , message: "잘못된 토큰입니다"}};

        }catch(err){
            return res.status(err.status ?? 500).json({
                success: false,
                massage: err.message ?? 'Internal Error',
            });
        }
        // console.log("안녕 :" + file.path)
        await this.boardRepository.insert({
            name,
            price,
            info,
            material,
            user,
            img: file.path
        })

        return res.status(200).json({
            success: true, 
            message: '상점 물건 업로드 완료'
        })

    }

    async delete(req: Request, res: Response){
        const successLogin = req.headers.authorization;
        const {uuid} = req.body;
        const verify = this.jwtService.verify(successLogin.replace("Bearer ", ""),{secret: process.env.SECRET_TOKEN})
        const user = await this.authRepository.findOne({
            where: {
                uuid: verify.uuid
            },
        });

        try{
            if(!uuid){ throw{status: 400, message: '다시 선택해주세요'}};
            if(!user){ throw{status: 400, message: '잘못된 토큰입니다'}};
        }catch(err){
            return res.status(err.status ?? 500).json({
                success: false,
                massage: err.message ?? 'Internal Error',
            });
        }
        const imgpath = await this.boardRepository.findOne({
            where: {
                uuid
            },
        })

            await fs.promises.unlink(imgpath.img);
            await this.boardRepository.delete(uuid)

            return res.status(200).json({
                success: true,
                message: '물건 정보가 삭제 되었습니다'
            })
    }

    async getList(req: Request,res: Response) {
        const successLogin = req.headers.authorization;
        
        const {page} = req.query;
        const verify = this.jwtService.verify(successLogin.replace("Bearer ", ""),{secret: process.env.SECRET_TOKEN})
        const user = await this.authRepository.findOne({
            where: {
                uuid: verify.uuid
            },
        });

        try{
            if(!page){ throw {status: 400, message: "페이지를 넣어주세요"}};
            if(!user){ throw {status: 400 , message: "잘못된 토큰입니다"}};
        }catch(err){
            return res.status(err.status ?? 500).json({
                success: false,
                massage: err.message ?? 'Internal Error',
            });
        }
        const take = 20;
        const skip = 20 * (Number(page) - 1);
        let list = await this.boardRepository.find({
            order: {
                createdAt: "DESC"
            },
            take,
            skip
        });

        return res.status(200).json({
            success: true,
            list
        })

    }

    async infor(req: Request,res: Response) {
        const successLogin = req.headers.authorization;
        const {uuid} = req.query;
        
        const verify = this.jwtService.verify(successLogin.replace("Bearer ", ""),{secret: process.env.SECRET_TOKEN})
        const user = await this.authRepository.findOne({
            where: {
                uuid: verify.uuid
            },
        });
        const infor = await this.boardRepository.findOne({
            where: {
                uuid: String(uuid)
            }
        });
        
        try{
            if(!uuid){ throw {status: 400, message: "선택을 해주세요"}};
            if(!user){ throw {status: 400 , message: "잘못된 토큰입니다"}};
            if(!infor){ throw {status: 400 , message: "없는 정보입니다"}};
            
        }catch(err){
            return res.status(err.status ?? 500).json({
                success: false,
                massage: err.message ?? 'Internal Error',
            });
        }

        return res.status(200).json({
            success: true,
            infor
        });
    }

    async findImg(req: Request, res: Response) {
        const { uuid } = req.query;
        const uuids = uuid.toString();
        console.log(uuids)
        const user = await this.boardRepository.findOne({
          where: {
            uuid: uuids
          }
        })
    
        try {
          if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
          if (!user) throw ({ status: 400, message: '이미지를 찾을 수 없습니다.' })
        } catch (err) {
          return res
            .status(err.status ?? 500)
            .json({
              success: false,
              message: err.message ?? 'Internal Error'
            })
        }
    
        return res.sendFile(user.img);
      }
}
