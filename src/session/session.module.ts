import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshSession } from "src/auth/entities/refresh-session.entity";
import { SessionService } from "./session.service";
import { SessionRepository } from "./session.repository";


@Module({
    imports:[TypeOrmModule.forFeature([RefreshSession])],
    providers: [
        SessionService,
        SessionRepository
    ],
    exports:[
        SessionRepository,
        SessionService
    ]
})
export class SessionModule{}