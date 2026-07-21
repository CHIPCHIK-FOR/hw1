import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Avatar } from "src/object-storage/entityes/avatart.entity";
import { FileSystemRepository } from "./files.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Avatar])],
    providers: [FileSystemRepository],
    exports: [FileSystemRepository],
})
export class FileSystemModule {}
