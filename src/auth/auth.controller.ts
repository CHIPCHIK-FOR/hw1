import { Body, Controller, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { HttpCode, HttpStatus } from "@nestjs/common";
import type { Response, Request } from "express";
import { refreshCookieOptions } from "./constants/refresh-cookie-options";
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sign-up")
    @ApiBody({ type: SignUpDto })
    @ApiOperation({
        summary: "Регистрация пользователя",
    })
    async signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @Post("sign-in")
    @ApiOperation({ summary: "Вход пользователя" })
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() dto: SignInDto,
        @Res({ passthrough: true })
        response: Response,
    ) {
        const { accessToken, refreshToken } = await this.authService.signIn(dto);
        response.cookie("refreshToken", refreshToken, refreshCookieOptions);
        return { accessToken };
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiOperation({
        summary: "Обновление access Токена",
    })
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true })
        response: Response,
    ) {
        const cookie = request.cookies as Record<string, unknown>;
        const rToken = cookie.refreshToken;

        if (typeof rToken !== "string" || rToken.length === 0) {
            throw new UnauthorizedException();
        }

        const { accessToken, newRefreshToken } = await this.authService.refresh(rToken);

        response.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

        return { accessToken };
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Закончить сессию" })
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true })
        response: Response,
    ) {
        const cookie = request.cookies as Record<string, unknown>;
        const refreshToken = cookie.refreshToken;

        if (typeof refreshToken !== "string" || refreshToken.length === 0) {
            throw new UnauthorizedException();
        }

        await this.authService.logout(refreshToken);
        response.clearCookie("refreshToken", {
            path: "/auth",
        });
        return { message: "Logget out" };
    }
}
