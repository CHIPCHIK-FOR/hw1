import { Module } from "@nestjs/common";

import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { SessionModule } from "./session/session.module";
import { JwtModule } from "@nestjs/jwt";
import { ObjectStorageModule } from "./object-storage/object-storage.module";
import { FileSystemModule } from "./files/files.module";
import { BalanceModule } from "./BalanceModule/balance.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        BalanceModule,
        FileSystemModule,
        DatabaseModule,
        UserModule,
        AuthModule,
        SessionModule,
        JwtModule,
        ObjectStorageModule,
    ],
})
export class AppModule {}
