import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshSession } from "src/auth/entities/refresh-session.entity";


@Module({
    imports:[TypeOrmModule.forFeature([RefreshSession])]
})
export class SessionModule{}