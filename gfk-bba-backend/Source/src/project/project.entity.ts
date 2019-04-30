import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // Falle: userId kann nur im "" im SQL verwendet werden, daher in user_id umbenennen
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
