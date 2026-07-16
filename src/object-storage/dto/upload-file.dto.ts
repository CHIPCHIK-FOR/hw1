import { ApiProperty } from "@nestjs/swagger";
import { IUploadFile } from "../interfaces/file-payload.interface";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadFileDto {
    @ApiProperty()
    @IsNotEmpty()
    file: IUploadFile;

    @ApiProperty({ example: "users/avatar" })
    @IsString()
    @IsNotEmpty()
    folder: string;

    @ApiProperty({ example: "mainPhoto" })
    @IsString()
    @IsNotEmpty()
    name: string;
}
