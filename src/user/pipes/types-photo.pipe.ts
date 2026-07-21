import { BadRequestException, PipeTransform } from "@nestjs/common";

export class FileTypeValidation implements PipeTransform<Express.Multer.File, Express.Multer.File> {
    transform(file: Express.Multer.File): Express.Multer.File {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            throw new BadRequestException();
        }

        return file;
    }
}
