import { IsInt, IsString, MinLength } from "class-validator";

export class UploadPhotoData {
    @IsInt()
    userId: number;

    @IsString()
    @MinLength(1)
    path: string;
}
