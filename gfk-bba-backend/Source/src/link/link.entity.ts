import { Entity } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'source_document_id' })
  sourceDocumentId: number;

  @Column({ type: 'int', name: 'target_document_id' })
  targetDocumentId: number;

  constructor(source: number, target: number) {
    this.sourceDocumentId = source;
    this.targetDocumentId = target;
  }
}
