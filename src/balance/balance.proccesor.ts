import { Process, Processor } from "@nestjs/bull";
import { BalanceService } from "./balance.service";
import { Logger } from "@nestjs/common";

@Processor("balance")
export class BalanceConsumer {
    constructor(private readonly balanceService: BalanceService) {}
    private readonly logger = new Logger(BalanceConsumer.name);
    @Process("reset-balance")
    async resetBalances() {
        this.logger.log("Задача с  принята в работу");
        await this.balanceService.resetAllBalances();
        this.logger.log("Задача выполнена");
    }
}
