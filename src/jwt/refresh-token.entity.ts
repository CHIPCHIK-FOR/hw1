import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";


@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryColumn()
    token:string;


    @Column()
    expires: Date; 

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'user_id'})
    user_id: User;

    constructor(token: string, expires: Date, user_id: User) {
        this.token = token;
        this.expires = expires;
        this.user_id = user_id;
    }
}