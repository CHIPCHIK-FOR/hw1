import { RemoveFileDto } from "./dto/remove.file.dto";
import { ResultUploadFileDto } from "./dto/resulst-upload.dto";
import { UploadFileDto } from "./dto/upload-file.dto";

export abstract class IFileService {
    abstract uploadFile(dto: UploadFileDto): Promise<ResultUploadFileDto>;

    abstract deleteFile(dto: RemoveFileDto): Promise<void>;
}
