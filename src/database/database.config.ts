import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getConfigDB(configService: ConfigService): TypeOrmModuleOptions {
    return {
        type: "postgres",
        host: configService.getOrThrow("POSTGRES_HOST"),
        username: configService.getOrThrow("POSTGRES_USER"),
        port: Number(configService.getOrThrow("POSTGRES_PORT")),
        database: configService.getOrThrow("POSTGRES_DATABASE"),
        password: configService.getOrThrow("POSTGRES_PASSWORD"),
        autoLoadEntities: true,
        synchronize: true,
    };
}
