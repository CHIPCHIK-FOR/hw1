import { Controller, Post } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceQueueService } from "./balance.queue.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("BalanceWithBull")
@Controller("balance")
export class BalanceConstroller {
    constructor(
        private readonly balanceService: BalanceService,
        private readonly balanceQueueService: BalanceQueueService,
    ) {}

    @Post("reset-balance")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Добавить задачу в очередь для обнуления баланса у пользователей" })
    async resetBalance() {
        return await this.balanceQueueService.addJob();
    }

    @Post("test-reset-balance")
    async testResetBalance() {
        return await this.balanceService.resetAllBalances();
    }
}
