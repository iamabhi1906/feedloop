import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Feedback from '../../feedbacks/entities/feedback.entity';

@Entity('tags')
export default class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'createdBy' })
  createdBy!: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  @ManyToMany(() => Feedback, (feedback) => feedback.tags)
  feedbacks!: Feedback[];
}
