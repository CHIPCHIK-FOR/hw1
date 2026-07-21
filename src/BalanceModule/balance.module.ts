import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { QueueModule } from "src/Queue/queue.module";
import { BalanceConstroller } from "./balance.controller";
import { BalanceService } from "./balance.service";
import { BalanceConsumer } from "./balance.proccesor";
import { BalanceQueueService } from "./balance.queue.service";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule, QueueModule, BullModule.registerQueue({ name: "balance" })],
    controllers: [BalanceConstroller],
    providers: [BalanceService, BalanceConsumer, BalanceQueueService],
})
export class BalanceModule {}
