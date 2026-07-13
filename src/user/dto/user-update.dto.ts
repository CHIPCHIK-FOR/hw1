import { Optional } from "@nestjs/common";
import { IsEmail, IsInt, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateDto{

    @IsOptional()
    @MinLength(3)
    @IsString()
    login?: string;
    
    @IsOptional()
    @IsEmail()
    email?: string;

    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    age?: number;

    @Optional()
    @MaxLength(1000)
    description?: string = "";
}