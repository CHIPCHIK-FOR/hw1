import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/security/guards/access-token.guard';
import { PaginationDto } from './dto/pagination-offset.dto';
import type { RequestWithUser } from './type/request-with-user';
import { SessionService } from 'src/session/session.service';
import { UpdateDto } from './dto/user-update.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService
    ) {}

    @Get('test/DB')
    async testDB(){
        return this.userService.testDB()
    }
    
    @Get("TestAccessToken")
    @UseGuards(AccessTokenGuard)
    async getTestToken(@Request() req){
        return req.user;
    }

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getme(@Request() req: RequestWithUser){
        const id = req.user.sub;
        const user = await this.userService.findById(id);
        return user;
    }


    @Get('allUsers')
    @UseGuards(AccessTokenGuard)
    async getAll(@Query() dto: PaginationDto, @Body('login') login: string){
        const users = await this.userService.getAllUsers(dto.limit, dto.page, login);
        return users;
    }


    @Delete()
    @UseGuards(AccessTokenGuard)
    async delete(@Req() req: RequestWithUser){
        const refreshToken = req.cookies?.refreshToken;
        const id = req.user.sub;

        await this.userService.delete(id);
        await this.sessionService.logoutAll(id)
        return {
            message: "Пользователь удален"
        }
    }

    @Patch('me')
    @UseGuards(AccessTokenGuard)
    async update(@Req() req: RequestWithUser, @Body() dto: UpdateDto){
        const id = req.user.sub;

        return await this.userService.update(id, dto);

    }
}
