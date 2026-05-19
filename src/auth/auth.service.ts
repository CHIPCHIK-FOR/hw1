import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { SignInDto } from './dto/sign-in.dto';
import bcrypt from 'bcrypt'
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { JwtService } from "@nestjs/jwt"
import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/user/user.entity';
import { RefreshTokenRepository } from './refresh.repository';
import { randomBytes } from 'crypto';
import { RefreshToken } from 'src/jwt/refresh-token.entity';
import { MoreThan } from 'typeorm/browser/find-options/operator/MoreThan.js';

@Injectable()
export class AuthService {


    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository){}


    /*
    Функция для входа пользователя.

    */
    async signIn(data: SignInDto){
        const user = await this.userRepository.getUserByLogin(data.login);
        if (!user){
            throw new BadRequestException('With this login, user does not exist');
        } 

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid){
            throw new UnauthorizedException('Incorrect password');
        }
        return this.getToken(user);
    }





    async signUp(data: SignUpDto){
        const CheckUser: User | null = await this.userRepository.getUserByLogin(data.login);
        if (CheckUser){
            throw new BadRequestException('User with this login already exists');
        }
        const hashPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepository.createUser(data.email, hashPassword, data.login, data.description);
        
        return this.getToken(user);
    }



    private genetateJwtToken() {
        // Генерируем 64 байта случайных данных и кодируем в hex-строку
        return randomBytes(64).toString('base64url');
        
    }
    

    async getToken(user: User): Promise<SignInResponseDto> {

        const payload = {
            id: user.id,
            email: user.email
        };

        const token = this.genetateJwtToken();
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); 
        
        const refreshToken = new RefreshToken(token, expires, user);
        refreshToken.user_id = user;
        await this.refreshTokenRepository.save(refreshToken);

        
        const accessToken = this.jwtService.sign(payload);
        return new SignInResponseDto(accessToken, refreshToken.token);
    }

    async findByToken(token: string): Promise<SignInResponseDto> {
        const refreshToken: RefreshToken | null = await this.refreshTokenRepository.findByToken(token);

        if (!refreshToken) {
            throw new BadRequestException('Invalid or expired refresh token');
        }
        return this.getToken(refreshToken.user_id);
    }
}
