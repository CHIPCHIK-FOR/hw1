import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
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
import { IFileService } from "src/object-storage/object-storage.adapter";
import { UploadDataDto } from "./dto/upload-data.dto";
import { FileTypeValidation } from "./pipes/types-photo.pipe";
import { DeleteFileDto } from "./dto/delete-file.dto";
import { SendMoneyDto } from "./dto/send-monye.dto";
import { FileSizeValidation } from "./pipes/size-photo.pipe";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly s3Service: IFileService,
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

    @Post("avatar")
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Загрузка фоток пользователей" })
    @UseGuards(AccessTokenGuard)
    async uploadFile(
        @UploadedFile(new FileTypeValidation(), new FileSizeValidation())
        file: Express.Multer.File,
        @Req() req: RequestWithUser,
        @Body() dto: UploadDataDto,
    ) {
        const id = req.user.sub;
        const { folder, name } = dto;
        const path = `${folder}/${name}`;
        await this.ensureUserCanUploadPhoto(id, path);

        const uploadPhoto = await this.s3Service.uploadFile({ file, folder, name });
        console.log("Фотка загружена");
        const data = await this.userService.upload(id, uploadPhoto.path);
        return data;
    }

    private async ensureUserCanUploadPhoto(id: number, path: string): Promise<void> {
        await this.userService.ensurePhotos(id, path);
    }

    @Delete("avatar")
    @ApiOperation({ summary: "Удаление фото" })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async deleteFile(@Req() req: RequestWithUser, @Body() dto: DeleteFileDto) {
        const id = req.user.sub;

        await this.userService.deleteFile(id, dto.path);

        await this.s3Service.deleteFile(dto);
    }

    @ApiOperation({
        summary: "Запрос для получения активных пользователей",
    })
    @Get("active")
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    async getActiveUsers(
        @Query("minAge", new ParseIntPipe()) minAge: number,
        @Query("maxAge", new ParseIntPipe()) maxAge: number,
    ) {
        console.log(minAge, maxAge);
        const users = await this.userService.getActiveUsers({ minAge, maxAge });
        return users;
    }

    @ApiOperation({
        summary: "Тестовая ручка",
    })
    @Get("Cache")
    async testCache() {
        return this.userService.testCache();
    }

    @ApiOperation({
        summary: "Запрос для отправки денежный средств",
    })
    @Post("sendMoney")
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    async sendMoney(@Req() req: RequestWithUser, @Body() dto: SendMoneyDto) {
        const id = req.user.sub;
        return await this.userService.sendMoney(id, dto);
    }
}
