import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateDto } from './dto/user-update.dto';
import { UpdateUserData } from './type/update-user-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ){}

    async testDB(){
        return this.userRepository.testDB()
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
        }
        catch{
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, dto: UpdateDto){

        const user = await this.userRepository.findActiveUser(id);
        if (!user){
            throw new NotFoundException()
        }

        await this.checkEmail(id, dto.email);

        await this.checkLogin(id, dto.login);

        const updateData = await this.buildUpdateData(dto);

        if (Object.keys(updateData).length === 0){
            throw new BadRequestException()
        }
        await this.userRepository.updateById(id, updateData)
        
        const updatedUser = this.userRepository.findSafeById(id);

        return updatedUser;
    }

    async checkLogin(id, login){
        if (!login){
            return;
        }

        const user = await this.userRepository.findByLogin(login);
        if (user && user.id !== id){
            throw new BadRequestException()
        }
    }

    async checkEmail(id, email){
        if (!email){
            return;
        }
        const user = await this.userRepository.findByEmail(email);
        if (user && user.id !== id){
            throw new BadRequestException()
        }
    }

    
    private async buildUpdateData(dto: UpdateDto) {
        const updateData: UpdateUserData = {};

        if (dto.login !== undefined) {
        updateData.login = dto.login;
        }

        if (dto.email !== undefined) {
        updateData.email = dto.email;
        }

        if (dto.age !== undefined) {
        updateData.age = dto.age;
        }

        if (dto.description !== undefined) {
        updateData.description = dto.description;
        }

        if (dto.password !== undefined) {
        updateData.hashPassword = await bcrypt.hash(dto.password, 10);
        }
        return updateData;
    }

}
