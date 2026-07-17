import { BadRequestException, PipeTransform } from "@nestjs/common";
import { UploadTypeFile } from "../type/upload-file";

export class FileTypeValidation implements PipeTransform {
    transform(value: UploadTypeFile) {
        if (value.mimetype !== "image/jpeg" && value.mimetype !== "image/png") {
            throw new BadRequestException();
        }
        return true;
    }
}
