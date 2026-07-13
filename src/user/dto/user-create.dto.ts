import { Optional } from "@nestjs/common";
import { IsEmail, IsInt, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class SignUpDto{

    @MinLength(3)
    @IsString()
    login: string;
    
    @IsEmail()
    email: string;

    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода
    @MinLength(6)
    password: string;

    @IsInt()
    @IsPositive()
    age: number;

    @Optional()
    @MaxLength(1000)
    description?: string = "";
}