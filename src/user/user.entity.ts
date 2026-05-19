import { RefreshToken } from 'src/jwt/refresh-token.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    login!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    description!: string

}