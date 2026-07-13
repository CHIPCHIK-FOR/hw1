import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto{

    @MinLength(3)
    @IsString()
    login: string;
    
    //@Matches('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/') # - версия для прода
    @MinLength(6)
    password: string;
    
}