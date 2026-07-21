import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, Min } from "class-validator";

export class SendMoneyDto {
    @ApiProperty({
        description: "Id пользователя, которуму хотим отправить деньги",
        default: 2,
    })
    @IsInt()
    recipientId: number;

    @ApiProperty({
        description: "Сумма, которую мы хотим отправить",
        default: 100,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;
}
