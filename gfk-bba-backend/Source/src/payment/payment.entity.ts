import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'document_id', nullable: false })
  documentId: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type: string;

  @Column({ type: 'json', name: 'paypal_receipt', nullable: true })
  paypalReceipt: string;

  @Column({
    type: 'varchar',
    name: 'coupon_code',
    length: 255,
    nullable: true,
  })
  couponCode: string;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;
}
