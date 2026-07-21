import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BalanceQueueService } from "./balance.queue.service";

@Injectable()
export class BalanceScheduler {
    constructor(private readonly balanceQueueService: BalanceQueueService) {}

    private readonly logger = new Logger(BalanceScheduler.name);
    @Cron("* 10 * * * *")
    async resetBalance() {
        await this.balanceQueueService.addJob();
        this.logger.log("Cron: Задача добавлена в очередь");
    }
}
