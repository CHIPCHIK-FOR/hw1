import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class SignUpDto{

    @MinLength(3)
    @IsString()
    @ApiProperty({
        example: 'Timurka',
        description: 'Логин пользователя',
        minLength: 3
    })
    login: string;
    

    @ApiProperty({
        example: 'Timurka@gmail.com',
        description: 'Почта пользователя'
    })
    @IsEmail()
    email: string;

    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода
   
    @ApiProperty({
        example: '123456',
        description: 'Пароль пользователя. В Базе данных будет храниться в захешированном виде'
    })
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 20,
        description: 'Пароль пользователя. В Базе данных будет храниться в захешированном виде'
    })
    @IsInt()
    @IsPositive()
    age: number;

    @ApiPropertyOptional({
        example: "Описание о себе",
        description: "Информация о пользователе"
    })
    @Optional()
    @MaxLength(1000)
    description?: string = "";
}