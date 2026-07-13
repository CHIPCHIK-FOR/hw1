import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SignUpDto} from './dto/user-create.dto';
import { SignInDto } from './dto/user-signIn.dto';
import { AccessTokenGuard } from 'src/security/guards/access-token.guard';
import { PaginationDto } from './dto/pagination-offset.dto';
import type { RequestWithUser } from './type/request-with-user';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('test/DB')
    async testDB(){
        return this.userService.testDB()
    }

    @Get('')
    async chechUsers(): Promise<User[]>{
        return this.userService.checkUsers()
    }

    @Post('Sign-up')
    async SignUp(@Body() dto: SignUpDto){
        return this.userService.signUp(dto);
    }

    @Post('Sign-in')
    async signIn(@Body() dto: SignInDto){
        return this.userService.signIn(dto);
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
        console.log(req.user);
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
    async delete(@Request() req: RequestWithUser){
        const id = req.user.sub;
        await this.userService.delete(id);
    }

}
