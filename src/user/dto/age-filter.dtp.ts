import { IsInt, IsPositive } from "class-validator";

export class AgeFilterDto {
    @IsPositive()
    @IsInt()
    minAge: number;

    @IsPositive()
    @IsInt()
    maxAge: number;
}
