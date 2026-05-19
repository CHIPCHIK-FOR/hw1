import { BadRequestException, Injectable } from "@nestjs/common";
import { RefreshToken } from "../jwt/refresh-token.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";


@Injectable()
export class RefreshTokenRepository{
    constructor(@InjectRepository(RefreshToken) private readonly jwtRepository: Repository<RefreshToken>){}


    async save(refreshToken: RefreshToken): Promise<RefreshToken> {
        return await this.jwtRepository.save(refreshToken);
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        const now = new Date();
        const refreshToken = await this.jwtRepository.findOne({
            relations:['user'],
            where: {
                token,
                expires: MoreThan(now)}
            });
        
        return refreshToken;
    }


}