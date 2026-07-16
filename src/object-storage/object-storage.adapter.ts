import { RemoveFileDto } from "./dto/remove.file.dto";
import { UploadFileDto } from "./dto/upload-file.dto";

export abstract class IFileService {
    abstract uploadFile(dto: UploadFileDto): Promise<RemoveFileDto>;

    abstract deleteFile(dto: RemoveFileDto): Promise<void>;
}
