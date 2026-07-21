import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, ILike, EntityManager } from "typeorm";
import { CreateUserData } from "./type/user-create-data";
import { UpdateUserData } from "./type/update-user-data";
import { ActiveUserRaw } from "./type/active-users";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async testDB(): Promise<string> {
        return await this.userRepository.query("SELECT NOW()");
    }

    async checkDB() {
        return this.userRepository.find({
            select: ["id", "login", "email"],
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            email,
        });
        return user;
    }
    async findByLogin(login: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({
            login,
        });
        return user;
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.userRepository.findOne({
            select: ["id", "login", "email", "description"],
            where: { id: id },
        });
        return user;
    }

    async createUser(dto: CreateUserData): Promise<User> {
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async findAll(limit: number, offset: number, login?: string) {
        const [users, total] = await this.userRepository.findAndCount({
            select: ["id", "login", "email", "age", "description"],
            where: {
                is_delete: false,
                ...(login ? ILike(`${login}%`) : {}),
            },

            take: limit,
            skip: offset,
        });
        return {
            users,
            total,
        };
    }

    async softDelete(id: number) {
        await this.userRepository.update(
            {
                id: id,
            },
            { is_delete: true },
        );
    }

    async findActiveUser(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: id,
                is_delete: false,
            },
        });
        return user;
    }

    async updateById(id: number, updateData: UpdateUserData) {
        await this.userRepository.update({ id }, updateData);
    }

    async findSafeById(id: number) {
        return await this.userRepository.findOne({
            select: {
                id: true,
                login: true,
                email: true,
                age: true,
                description: true,
            },
            where: {
                id,
            },
        });
    }

    async getActivesUsers(minAge: number, maxAge: number): Promise<ActiveUserRaw[]> {
        const users: ActiveUserRaw[] = await this.userRepository.query(
            `
            with informations_user as (
                select users.id, users.login, count(avatars.id) 
                from users
                left join avatars 
                    on users.id = avatars.user_id
                where
                    avatars.is_delete = false
                    and users.is_delete = false
                    and users.description is not null
                    and users.age between $1 and $2
                    and TRIM(users.description) <> ''
                group by
                    (users.id, users.login)
                having
                    count(avatars.id) > 2
                ),
                last_avatars as (
                    select distinct on (avatars.user_id) avatars.user_id, avatars.path, avatars.createad_at
                    from avatars
                    where
                        avatars.is_delete = false
                    order by 
                        avatars.user_id,
                        avatars.createad_at desc
                )

                select informations_user.id, informations_user.login, last_avatars.path, last_avatars.createad_at
                from informations_user
                left join last_avatars
                on informations_user.id = last_avatars.user_id
        `,
            [minAge, maxAge],
        );
        return users;
    }

    async decreaseBalance(manager: EntityManager, userId: number, amount: number) {
        return await manager
            .createQueryBuilder()
            .update(User)
            .set({ balance: () => `"balance" - :amount` })
            .where(`"id" = :userId`, { userId })
            .andWhere(`"balance" > :amount`, { amount })
            .execute();
    }

    async increaseBalance(manager: EntityManager, userId: number, amount: number) {
        return await manager
            .createQueryBuilder()
            .update(User)
            .set({ balance: () => `"balance" + :amount` })
            .where(`"id" = :userId`, { userId })
            .setParameter("amount", amount)
            .execute();
    }

    async resetBalance(): Promise<void> {
        await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({
                balance: "0",
            })
            .execute();
    }

    // Пользователи с достаточным балансом

    private async test1(minBalance: number): Promise<User[]> {
        const users: User[] = await this.userRepository
            .createQueryBuilder()
            .select(["id", "login", "balance"])
            .where({
                is_delete: false,
                balance: () => `"balance" > :minBalance`,
            })
            .orderBy("balance", "DESC")
            .setParameter("minBalance", minBalance)
            .getMany();
        return users;
    }
}
