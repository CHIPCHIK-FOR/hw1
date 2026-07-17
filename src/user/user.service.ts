import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UpdateDto } from "./dto/user-update.dto";
import { UpdateUserData } from "./type/update-user-data";
import * as bcrypt from "bcrypt";
import { FileSystemRepository } from "src/files/files.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly fileRepository: FileSystemRepository,
    ) {}

    async testDB(): Promise<string> {
        return this.userRepository.testDB();
    }

    async findById(id: number) {
        const user = await this.userRepository.findById(id);
        return user;
    }

    async getAllUsers(limit: number, page: number, login: string | undefined) {
        const offset = (page - 1) * limit;
        const { users, total } = await this.userRepository.findAll(limit, offset, login);

        return {
            data: users,
            metadata: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    }

    async delete(id: number) {
        try {
            await this.userRepository.softDelete(id);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async update(id: number, dto: UpdateDto) {
        const user = await this.userRepository.findActiveUser(id);
        if (!user) {
            throw new NotFoundException();
        }

        await this.checkEmail(id, dto.email);

        await this.checkLogin(id, dto.login);

        const updateData = await this.buildUpdateData(dto);

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException();
        }
        await this.userRepository.updateById(id, updateData);

        const updatedUser = this.userRepository.findSafeById(id);

        return updatedUser;
    }

    async checkLogin(id: number, login: string | undefined) {
        if (!login) {
            return;
        }

        const user = await this.userRepository.findByLogin(login);
        if (user && user.id !== id) {
            throw new BadRequestException();
        }
    }

    async checkEmail(id: number, email: string | undefined) {
        if (!email) {
            return;
        }
        const user = await this.userRepository.findByEmail(email);
        if (user && user.id !== id) {
            throw new BadRequestException();
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

    async upload(userId: number, path: string) {
        return await this.fileRepository.upload({ userId, path });
    }

    async countPhotos(id: number): Promise<void> {
        const countPhotos = await this.fileRepository.getCountPhotos(id);
        if (countPhotos >= 5) {
            throw new ConflictException();
        }
    }

    async deleteFile(id: number, path: string) {
        await this.fileRepository.deleteFile(id, path);
    }
}
