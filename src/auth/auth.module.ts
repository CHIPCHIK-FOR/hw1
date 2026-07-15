import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { SecurityModule } from "src/security/security.module";
import { SessionModule } from "src/session/session.module";

@Module({
    imports: [SessionModule, UserModule, SecurityModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
