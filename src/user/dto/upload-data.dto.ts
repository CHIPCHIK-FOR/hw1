import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadDataDto {
    @ApiProperty({ example: "users/avatar" })
    @IsString()
    @IsNotEmpty()
    folder: string;

    @ApiProperty({ example: "mainPhoto" })
    @IsString()
    @IsNotEmpty()
    name: string;
}
