import KeyvRedis from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const host = configService.getOrThrow<string>("REDIS_HOST");
                const port = configService.getOrThrow<string>("REDIS_PORT");
                const password = configService.getOrThrow<string>("REDIS_PASSWORD");
                const redisUrl = `redis://:${password}@${host}:${port}`;
                return {
                    stores: [new KeyvRedis(redisUrl)],
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule],
})
export class RedisModule {}
