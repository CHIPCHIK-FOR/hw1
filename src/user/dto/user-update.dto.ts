import { Optional } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateDto{

    @ApiPropertyOptional({
            example: 'Timurka',
            description: 'Логин пользователя',
            minLength: 3
    })
    @IsOptional()
    @MinLength(3)
    @IsString()
    login?: string;
    

    @ApiPropertyOptional({
            example: 'Timurka@gmail.com',
            description: 'Email пользователя',
            minLength: 3
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода

    @ApiPropertyOptional({
        example: '111111',
        description: 'Пароль пользователя',
        minLength: 3
    })
    @MinLength(6)
    @IsOptional()
    password?: string;


    @ApiPropertyOptional({
        example: 20,
        description: 'Возраст пользователя',
        minLength: 3
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    age?: number;

    @ApiPropertyOptional({
        example: 'Инфомарция о себе',
        description: 'Описание пользователя',
        minLength: 3
    })
    @Optional()
    @MaxLength(1000)
    description?: string = "";
}