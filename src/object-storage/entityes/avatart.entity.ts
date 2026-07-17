import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/user.entity";

@Entity({ name: "avatars" })
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    path: string;

    @Column({ default: false })
    is_delete: boolean;

    @CreateDateColumn()
    createad_at: Date;

    @ManyToOne(() => User, (user) => user.avatars, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: User;
}
