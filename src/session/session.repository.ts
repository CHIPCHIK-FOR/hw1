import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThan, Repository } from "typeorm";
import { RefreshSession } from "../auth/entities/refresh-session.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class SessionRepository {
    constructor(
        @InjectRepository(RefreshSession)
        private readonly refreshSessionRepository: Repository<RefreshSession>,
    ) {}

    async createSession(user: User, tokenHash: string, expiresAt: Date) {
        const session = this.refreshSessionRepository.create({
            user,
            tokenHash,
            expiresAt,
            revokedAt: null,
        });

        return await this.refreshSessionRepository.save(session);
    }

    async findActiveByTokenHash(tokenHash: string) {
        const userSession = await this.refreshSessionRepository.findOne({
            where: {
                tokenHash,
                revokedAt: IsNull(),
                expiresAt: MoreThan(new Date()),
            },
            relations: {
                user: true,
            },
        });
        return userSession;
    }

    async revoke(session: RefreshSession) {
        session.revokedAt = new Date();
        await this.refreshSessionRepository.save(session);
    }

    async revokeAll(id: number) {
        const date = new Date();

        await this.refreshSessionRepository.update(
            {
                user: { id: id },
                revokedAt: IsNull(),
            },
            {
                revokedAt: date,
            },
        );
    }

    async findActiveSession(tokenHash: string) {
        const session = await this.refreshSessionRepository.findOne({
            where: {
                tokenHash,
                revokedAt: IsNull(),
                expiresAt: MoreThan(new Date()),
            },
            relations: {
                user: true,
            },
        });
        return session;
    }
}
