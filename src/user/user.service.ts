import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto} from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/user-signIn.dto';
import { IsFQDN } from 'class-validator';


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    async testDB(){
        return this.userRepository.testDB()
    }

    async checkUsers(){
        return this.userRepository.checkDB();
    }

    async signUp(dto: SignUpDto){
        const {password, ...UserData} = dto;
        const user = await this.userRepository.findByEmail(UserData.email);
        
        if (user){
            throw new ConflictException();
        }
        const hashPass = await bcrypt.hash(password, 10);
        const userData = {
            ...UserData,
            hashPassword: hashPass
        };
        const createdUser = await this.userRepository.createUser(userData);
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
        return {message: 'Welcome'};
    }


    async findById(id: number){
        const user = await this.userRepository.findById(id);
        return user;
    }


    async getAllUsers(limit: number, page: number, login: string ){
        const offset = (page - 1) * limit
        const {users, total} = await this.userRepository.findAll(limit, offset, login);
        
        return {
            data:
                users,
            metadata: 
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
        }
    }

    async delete(id: number){
        try{
            await this.userRepository.softDelete(id);
            return {
                message: "Пользователь удален"
            }
        }
        catch{
            throw new InternalServerErrorException()
        }
    }

}
