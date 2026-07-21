import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class BalanceService {
    constructor(private readonly userRepository: UserRepository) {}

    private readonly logger = new Logger(BalanceService.name);
    async resetAllBalances() {
        try {
            await this.userRepository.resetBalance();
            this.logger.log("Баланс сброшен до 0");
        } catch (Error) {
            this.logger.error(`Не получилось обнулить баланс. Error - ${Error}`);
        }
    }
}
