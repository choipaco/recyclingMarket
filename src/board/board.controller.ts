import { Controller, Get, Post, Body, Patch, Param, Delete,Req,Res,UploadedFile,UseInterceptors } from '@nestjs/common';
import { BoardService } from './board.service';
import {Request,Response} from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBoardDto } from './DTO/createDTO';
@Controller('market')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    Create(@Req() req:Request,@Body() body:CreateBoardDto,@Res() res:Response, @UploadedFile() file: Express.Multer.File){
        return this.boardService.create(body,req,res,file);
    }

    @Delete('/delete')
    Delete(@Req() req:Request,@Res() res:Response){
        return this.boardService.delete(req,res);
    }

    @Get('/get/list')
    GetList(@Req() req:Request,@Res() res:Response){
        return this.boardService.getList(req,res);
    }

    @Get('/get/infor')
    Infor(@Req() req:Request,@Res() res:Response){
        return this.boardService.infor(req,res);
    }
}