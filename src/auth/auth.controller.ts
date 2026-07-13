import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/user/dto/user-create.dto';
import { SignInDto } from 'src/user/dto/user-signIn.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import type { Response, Request} from 'express';
import { refreshCookieOptions } from './constants/refresh-cookie-options';
import path from 'path';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto){
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) response: Response){

    const {accessToken, refreshToken} = await this.authService.signIn(dto);
    response.cookie('refreshToken', refreshToken, refreshCookieOptions)

    return {accessToken}
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response,) {
    const rToken = request.cookies?.refreshToken;

    const { accessToken, newRefreshToken } = await this.authService.refresh(rToken);

    response.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    return { accessToken };
  }


  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response){
    const refreshToken = request.cookies?.refreshToken;
    await this.authService.logout(refreshToken);

    response.clearCookie('refreshToken', {path: '/auth'});

    return {message: 'Logget out'}
  }
}
