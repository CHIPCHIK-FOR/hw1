import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class BalanceService {
    constructor(private readonly userRepository: UserRepository) {}

    async resetAllBalances() {
        await this.userRepository.resetBalance();
    }
}
