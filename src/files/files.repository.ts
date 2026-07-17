import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Avatar } from "src/object-storage/entityes/avatart.entity";
import { Repository } from "typeorm";
import { UploadPhotoData } from "./dto/upload-file.dto";

@Injectable()
export class FileSystemRepository {
    constructor(
        @InjectRepository(Avatar)
        private readonly filesRepository: Repository<Avatar>,
    ) {}

    async check(): Promise<string> {
        return await this.filesRepository.query("SELECT NOW()");
    }

    async upload(dto: UploadPhotoData) {
        const newPhoto = this.filesRepository.create({
            path: dto.path,
            user: {
                id: dto.userId,
            },
        });
        const savedPhoto = await this.filesRepository.save(newPhoto);
        return {
            id: savedPhoto.id,
            userId: savedPhoto.user.id,
            path: savedPhoto.path,
        };
    }

    async getPhotos(id: number) {
        const photos = await this.filesRepository.find({
            where: {
                user: { id: id },
                is_delete: false,
            },
        });
        return photos;
    }

    async deleteFile(id: number, path: string) {
        await this.filesRepository.update(
            {
                path: path,
                user: { id: id },
            },
            { is_delete: true },
        );
    }
}
