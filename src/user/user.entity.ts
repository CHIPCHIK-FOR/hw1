import { Avatar } from "src/object-storage/entityes/avatart.entity";
import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
@Check(`"age" >= 0`)
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    login: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    hashPassword: string;

    @Column({ nullable: false })
    age: number;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: "numeric",
        precision: 12,
        scale: 2,
        default: "0.00",
    })
    balance: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @Column({ nullable: true, default: false })
    is_delete: boolean;

    @OneToMany(() => Avatar, (avatar) => avatar.user)
    avatars: Avatar[];
}
