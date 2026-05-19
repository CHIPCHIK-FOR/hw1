import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from '../user/user.entity'


@Injectable()
export class UserRepository{
    
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}



    async getUserByLogin(login: string) {
        const user: User | null = await this.userRepository.findOne({where:{login}})
        return user;  
    }

    async createUser(email: string, password: string, login: string, description: string){
        const user = this.userRepository.create({
            login,
            email,
            password,
            description
        });
        await this.userRepository.save(user);
        return user;
    }


    async getUserById(id: number){
        const user: User | null = await this.userRepository.findOne({where:{id}})
        return user;
    }
}