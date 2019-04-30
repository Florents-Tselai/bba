import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25, unique: true })
  code: string;

  @Column({ name: 'used_at', nullable: true })
  usedAt: Date;
}
