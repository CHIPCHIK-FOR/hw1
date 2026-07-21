import { Process, Processor } from "@nestjs/bull";
import { BalanceService } from "./balance.service";

@Processor("balance")
export class BalanceConsumer {
    constructor(private readonly balanceService: BalanceService) {}

    @Process("reset-balance")
    async resetBalances() {
        console.log("Задача с  принята в работу");
        await this.balanceService.resetAllBalances();
        console.log("Задача выполнена");
    }
}
