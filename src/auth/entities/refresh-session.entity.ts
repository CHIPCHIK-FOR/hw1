import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('refresh_sessions')
export class RefreshSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'token_hash' })
    tokenHash: string;

    @Column({ name: 'expires_at', type: 'timestamptz' })
    expiresAt: Date;

    @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
    revokedAt: Date | null;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}