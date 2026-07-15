import { Injectable } from "@nestjs/common";
import { SessionRepository } from "./session.repository";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";

@Injectable()
export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly configService: ConfigService,
    ) {}

    async logout(refreshToken: string) {
        if (!refreshToken) {
            return;
        }
        const tokenHash = this.hashRefreskToken(refreshToken);

        const session = await this.sessionRepository.findActiveSession(tokenHash);

        if (!session) {
            return;
        }
        await this.sessionRepository.revoke(session);
    }

    private hashRefreskToken(token: string) {
        const tokenHash = createHmac("sha256", this.configService.getOrThrow("JWT_REFRESH_SECRET"))
            .update(token)
            .digest("hex");
        return tokenHash;
    }

    async logoutAll(id: number) {
        if (!id) {
            return;
        }
        await this.sessionRepository.revokeAll(id);
    }
}
