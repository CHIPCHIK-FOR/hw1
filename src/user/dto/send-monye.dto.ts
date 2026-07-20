import { IsInt, IsNumber, Min } from "class-validator";

export class SendMoneyDto {
    @IsInt()
    recipientId: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;
}
