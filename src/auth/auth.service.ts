import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from 'src/user/dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';
import { SignInDto } from 'src/user/dto/user-signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { SessionRepository } from 'src/session/session.repository';



@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly sessionRepository: SessionRepository,
        private readonly jwtService: JwtService,
    ){}

    async signUp(dto: SignUpDto){
        const {password, ...userData} = dto;
        const userByEmail = await this.userRepository.findByEmail(userData.email);
        
        if (userByEmail){
            throw new ConflictException();
        }
        const userByLogin = await this.userRepository.findByLogin(userData.login);
        if (userByLogin){
            throw new ConflictException();
        }

        const hashPass = await bcrypt.hash(password, 10);
        const user = {
            ...userData,
            hashPassword: hashPass
        };
        const createdUser = await this.userRepository.createUser(user);
        const {hashPassword, ...newuser} = createdUser;
        return newuser;
    }

    async signIn(dto: SignInDto){
        const user = await this.userRepository.findByLogin(dto.login);
        if (!user){
            throw new UnauthorizedException()
        }

        const isMatch = await bcrypt.compare(dto.password, user.hashPassword);
        if (!isMatch){
            throw new UnauthorizedException()
        }

        const accessToken = await this.generationAccessToken(user);
        const refreshToken = this.generateRefreshToken();

        const tokenHash = this.hashRefreskToken(refreshToken)

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await this.sessionRepository.createSession(user, tokenHash, expiresAt)

        return {accessToken, refreshToken}
    }

    private generateRefreshToken(): string {
        return randomBytes(64).toString('base64url');
    }

    private hashRefreskToken(token: string){
        const tokenHash = createHmac('sha256', this.configService.getOrThrow('JWT_REFRESH_SECRET')).update(token).digest('hex');
        return tokenHash;
    }

    async refresh(refreshToken: string){
        if (!refreshToken){
            throw new UnauthorizedException()
        }
        
        const tokenHash = this.hashRefreskToken(refreshToken);
        const session = await this.sessionRepository.findActiveSession(tokenHash);
        if (!session){
            throw new UnauthorizedException();
        }
        await this.sessionRepository.revoke(session);
        const accessToken = await this.generationAccessToken(session.user);
        const newRefreshToken = this.generateRefreshToken()
        const newRefreshTokenHash = this.hashRefreskToken(newRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await this.sessionRepository.createSession(session.user,  newRefreshTokenHash, expiresAt)
        return {accessToken, newRefreshToken}
    }




    private async generationAccessToken(user: User){
        const payload = {
            sub: user.id,
            login: user.login,
            email: user.email
        }
        const accessToken = await this.jwtService.signAsync(payload);

        return accessToken;
    } 
    

    async logout(refreshToken:string) {
        if (!refreshToken){
            return;
        }
        const tokenHash = this.hashRefreskToken(refreshToken);

        const session = await this.sessionRepository.findActiveSession(tokenHash);

        if (!session){
            return;
        }
        await this.sessionRepository.revoke(session);
    }
}
