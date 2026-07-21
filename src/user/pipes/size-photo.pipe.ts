import { BadRequestException, PipeTransform } from "@nestjs/common";

export class FileSizeValidation implements PipeTransform<Express.Multer.File, Express.Multer.File> {
    private readonly MaxSize = 10 * 1024 * 1024;
    transform(file: Express.Multer.File): Express.Multer.File {
        if (!file) {
            throw new BadRequestException();
        }

        if (file.size > this.MaxSize) {
            throw new BadRequestException();
        }

        return file;
    }
}
