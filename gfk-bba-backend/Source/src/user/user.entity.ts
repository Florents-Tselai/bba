import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 64, name: 'hashed_password' })
  hashedPassword: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  token: string;

  @Column({ nullable: true, name: 'last_login' })
  lastLogin: Date;
}
