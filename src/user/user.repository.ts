import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, ILike } from "typeorm";
import { CreateUserData } from "./type/user-create-data";
import { UpdateUserData } from "./type/update-user-data";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async testDB(): Promise<string> {
        return await this.userRepository.query("SELECT NOW()");
    }

    async checkDB() {
        return this.userRepository.find({
            select: ["id", "login", "email"],
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            email,
        });
        return user;
    }
    async findByLogin(login: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            login,
        });
        return user;
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.userRepository.findOne({
            select: ["id", "login", "email", "description"],
            where: { id: id },
        });
        return user;
    }

    async createUser(dto: CreateUserData): Promise<User> {
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async findAll(limit: number, offset: number, login?: string) {
        const [users, total] = await this.userRepository.findAndCount({
            select: ["id", "login", "email", "age", "description"],
            where: {
                is_delete: false,
                ...(login ? ILike(`${login}%`) : {}),
            },

            take: limit,
            skip: offset,
        });
        return {
            users,
            total,
        };
    }

    async softDelete(id: number) {
        await this.userRepository.update(
            {
                id: id,
            },
            { is_delete: true },
        );
    }

    async findActiveUser(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: id,
                is_delete: false,
            },
        });
        return user;
    }

    async updateById(id: number, updateData: UpdateUserData) {
        await this.userRepository.update({ id }, updateData);
    }

    async findSafeById(id: number) {
        return await this.userRepository.findOne({
            select: {
                id: true,
                login: true,
                email: true,
                age: true,
                description: true,
            },
            where: {
                id,
            },
        });
    }
}
