import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenGuard } from "./guards/access-token.guard";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.getOrThrow("JWT_ACCESS_SECRET"),
                signOptions: {
                    expiresIn: configService.getOrThrow("JWT_ACCESS_EXPIRES_IN"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AccessTokenGuard],
    exports: [JwtModule, AccessTokenGuard],
})
export class SecurityModule {}
