import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";

@Injectable()
export class BalanceQueueService {
    constructor(@InjectQueue("balance") private readonly balanceQueue: Queue) {}

    async addJob() {
        const job = await this.balanceQueue.add("reset-balance");
        console.log(`Задача с id: ${job.id} отправилась с очередь`);
        return {
            jobId: job.id,
            message: "Задача добавлена в очередь",
        };
    }
}
