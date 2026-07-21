import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import type { Queue } from "bull";

@Injectable()
export class BalanceQueueService {
    constructor(@InjectQueue("balance") private readonly balanceQueue: Queue) {}
    private readonly logger = new Logger(BalanceQueueService.name);
    async addJob() {
        const job = await this.balanceQueue.add("reset-balance");
        this.logger.log(`Задача с id: ${job.id} отправилась с очередь`);
        return {
            jobId: job.id,
            message: "Задача добавлена в очередь",
        };
    }
}
