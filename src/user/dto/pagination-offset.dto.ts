import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class FindUsersQueryDto{

    @ApiPropertyOptional({
        description: "Номер страницы"
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @ApiPropertyOptional({
        description: "Количество записей на одной странице"
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    limit: number = 10;


    @ApiPropertyOptional({
        example: 'Timurka',
        description: 'Фильтр по login. Ищет пользователей, у которых login начинается с этого значения',
    })
    @IsOptional()
    @IsString()
    login?: string;

}