import { Injectable } from "@nestjs/common";
import { RemoveFileDto } from "../dto/remove.file.dto";
import { UploadFileDto } from "../dto/upload-file.dto";

@Injectable()
export class S3Service {
    uploadFile(dto: UploadFileDto) {
        return dto;
    }

    deleteFile(dto: RemoveFileDto) {
        return dto;
    }
}
