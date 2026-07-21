import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BalanceQueueService } from "./balance.queue.service";

@Injectable()
export class BalanceScheduler {
    constructor(private readonly balanceQueueService: BalanceQueueService) {}

    @Cron("* 10 * * * *")
    async resetBalance() {
        await this.balanceQueueService.addJob();
        console.log("Задача добавлена в очередь");
    }
}
