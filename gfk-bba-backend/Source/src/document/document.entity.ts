import { Entity, ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  hash: string;

  @Column({ type: 'int', name: 'project_id' })
  projectId: number;

  @Column({ type: 'varchar', length: 10 })
  kind: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 42, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 10, default: 'PROGRESS' })
  state: string;

  @Column({ type: 'varchar', length: 255, name: 'state_details', default: '' })
  stateDetails: string;

  @Column({ type: 'timestamptz', name: 'created_at', nullable: true })
  createdAt: Date;
}
