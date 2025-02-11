import { BaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Show extends BaseEntity {
  @Column()
  title: string;

  @Column('varchar', { array: true })
  tags: string[];
}
