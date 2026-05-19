import { MinLength } from "class-validator"


export class SignUpDto {
    @MinLength(3, { message: 'Почта должна быть не менее 3 символов' })
    email!: string
    @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
    password!: string
    @MinLength(3)
    login!: string

    @MinLength(1)
    description!: string
}