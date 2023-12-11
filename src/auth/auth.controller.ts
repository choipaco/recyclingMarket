import { Controller, Get, Post, Body, Put, Param, Delete,Req,Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
//import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('/isLogin')
  async isLogin(@Req() req:Request,@Res() res:Response){
    return this.authService.isLogin(req, res);
  }

  @Post('/login')
  login(@Req() req:Request, @Res() res:Response) {
      return this.authService.login(req, res);
  }

  @Post('/register')
  register(@Req() req:Request, @Res() res:Response) {    
    return this.authService.register(req, res);
  }

}
