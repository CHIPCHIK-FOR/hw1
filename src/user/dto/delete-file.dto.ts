import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class DeleteFileDto {
    @ApiProperty({
        example: "user/avatar",
    })
    @IsString()
    @MinLength(1)
    path: string;
}
