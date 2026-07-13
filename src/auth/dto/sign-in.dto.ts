import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto{

    @ApiProperty({
        example: 'Timurka',
        description: 'Логин пользователя',
        minLength: 3
    })
    @MinLength(3)
    @IsString()
    login: string;
    
    
    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода
    @ApiProperty({
        example: '111111',
        description: 'Пароль пользователя. В Базе данных будет храниться в захешированном виде'
    })
    @MinLength(6)
    password: string;
    
}