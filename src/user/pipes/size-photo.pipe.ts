import { PipeTransform } from "@nestjs/common";
import { UploadTypeFile } from "../type/upload-file";

export class FileSizeValidationPipe implements PipeTransform {
    transform(value: UploadTypeFile) {
        const MAX_SIZE_PHOTO = 10 * 1024 * 1024;
        return value.size <= MAX_SIZE_PHOTO;
    }
}
