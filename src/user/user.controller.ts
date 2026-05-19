import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @UseGuards(AuthGuard)    
    @Get()
    async GetMe(@Request() req ){
        const user = await this.userService.getUserById(req.user.id);
        return user;
    }
    
}
