import { ApiProperty } from "@nestjs/swagger";
import * as filePayloadInterface from "../interfaces/file-payload.interface";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadFileDto {
    @ApiProperty()
    @IsNotEmpty()
    file: filePayloadInterface.IUploadFile;

    @ApiProperty({ example: "users/avatar" })
    @IsString()
    @IsNotEmpty()
    folder: string;

    @ApiProperty({ example: "mainPhoto" })
    @IsString()
    @IsNotEmpty()
    name: string;
}
