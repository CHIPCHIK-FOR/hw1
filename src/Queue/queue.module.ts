import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.getOrThrow("QUEUE_HOST"),
                    port: Number(configService.getOrThrow("QUEUE_PORT")),
                    password: configService.getOrThrow("QUEUE_PASSWORD"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [BullModule],
})
export class QueueModule {}
