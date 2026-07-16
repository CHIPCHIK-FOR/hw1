import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessTokenGuard } from "src/security/guards/access-token.guard";
import type { RequestWithUser } from "./type/request-with-user";
import { SessionService } from "src/session/session.service";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Express } from "express";
import { FindUsersQueryDto } from "./dto/pagination-offset.dto";
import { UpdateDto } from "./dto/user-update.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "src/object-storage/s3/s3.service";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly S3: S3Service,
    ) {}

    @ApiOperation({
        summary: "Проверка подключения к Базе Данных",
    })
    @Get("test/DB")
    async testDB(): Promise<string> {
        return this.userService.testDB();
    }

    /*
    @Get("TestAccessToken")
    @UseGuards(AccessTokenGuard)
    async getTestToken(@Request() req){
        return req.user;
    }
    */

    @Get("me")
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @ApiOperation({
        summary: "Получение инфомарции о пользователе",
    })
    async getme(@Request() req: RequestWithUser) {
        const id = req.user.sub;
        const user = await this.userService.findById(id);
        return user;
    }

    @Get("allUsers")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Получение инфомарции о всех пользователях",
    })
    @UseGuards(AccessTokenGuard)
    async getAll(@Query() dto: FindUsersQueryDto) {
        const users = await this.userService.getAllUsers(dto.limit, dto.page, dto.login);
        return users;
    }

    @Delete()
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @ApiCookieAuth()
    @ApiOperation({
        summary: "Мягкое удаление пользователя",
    })
    async delete(@Req() req: RequestWithUser) {
        const id = req.user.sub;

        await this.userService.delete(id);
        await this.sessionService.logoutAll(id);
        return {
            message: "Пользователь удален",
        };
    }

    @Patch("me")
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Обновление данных пользователя",
    })
    async update(@Req() req: RequestWithUser, @Body() dto: UpdateDto) {
        const id = req.user.sub;
        return await this.userService.update(id, dto);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
