import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { SecurityModule } from "src/security/security.module";
import { SessionModule } from "src/session/session.module";
import { ObjectStorageModule } from "src/object-storage/object-storage.module";
import { FileSystemModule } from "src/files/files.module";
import { RedisModule } from "src/cache/redis.module";

@Module({
    imports: [
        RedisModule,
        FileSystemModule,
        ObjectStorageModule,
        SessionModule,
        TypeOrmModule.forFeature([User]),
        SecurityModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository],
})
export class UserModule {}
