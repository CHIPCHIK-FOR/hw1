import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConfigDB } from "./database.config";

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: getConfigDB,
        inject: [ConfigService]
    })]
    
})
export class DatabaseModule{}