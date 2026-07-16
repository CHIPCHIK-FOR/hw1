import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { RemoveFileDto } from "../dto/remove.file.dto";
import { UploadFileDto } from "../dto/upload-file.dto";
import { IFileService } from "../object-storage.adapter";
import { ResultUploadFileDto } from "../dto/resulst-upload.dto";
import { S3Lib } from "./s3Symbols";
import * as AWS from "@aws-sdk/client-s3";

@Injectable()
export class S3Service extends IFileService {
    private backetName = "main";
    constructor(@Inject(S3Lib) private readonly S3: AWS.S3) {
        super();
    }

    async uploadFile(dto: UploadFileDto): Promise<ResultUploadFileDto> {
        const { file, folder, name } = dto;
        const path = `${folder}/${name}`;

        return new Promise((resolve, reject) => {
            this.S3.putObject(
                {
                    Bucket: this.backetName,
                    Key: path,
                    Body: file.buffer,
                    ACL: "public-read",
                    ContentType: file.mimetype,
                },
                (error) => {
                    if (!error) {
                        resolve({ path });
                    } else {
                        reject(new BadRequestException());
                    }
                },
            );
        });
    }

    async deleteFile(dto: RemoveFileDto): Promise<void> {
        const { path } = dto;
        return new Promise((resolve, reject) => {
            this.S3.deleteObject(
                {
                    Bucket: this.backetName,
                    Key: path,
                },
                (error) => {
                    if (!error) {
                        resolve();
                    } else {
                        reject(new BadRequestException());
                    }
                },
            );
        });
    }
}
