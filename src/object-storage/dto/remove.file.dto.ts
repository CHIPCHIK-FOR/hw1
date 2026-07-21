import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RemoveFileDto {
    @ApiProperty({
        example: "user/avatart/mainPhoto",
    })
    @IsNotEmpty()
    @IsString()
    path: string;
}
