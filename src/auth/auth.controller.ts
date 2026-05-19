import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}


    @Post('sign-in')
    async signIn(@Body() data: SignInDto): Promise<SignInResponseDto>{

        return await this.authService.signIn(data);
    }

    @Post('sign-up')
    async signUp(@Body() data: SignUpDto){
        return await this.authService.signUp(data);
    }


    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: RefreshTokenDto){
        return await this.authService.findByToken(refreshToken.refreshToken);
    }

}
