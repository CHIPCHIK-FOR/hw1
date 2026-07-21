import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { SessionModule } from "./session/session.module";
import { JwtModule } from "@nestjs/jwt";
import { ObjectStorageModule } from "./object-storage/object-storage.module";
import { FileSystemModule } from "./files/files.module";
import { BalanceModule } from "./balance/balance.module";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerMiddleware } from "./Logger/Middleware";

@Module({
    imports: [
        ScheduleModule.forRoot(),
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
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*");
    }
}
