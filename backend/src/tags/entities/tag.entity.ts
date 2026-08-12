import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Feedback from '../../feedbacks/entities/feedback.entity';
import User from '../../users/entities/user.entity';

@Entity('tags')
export default class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => Feedback, (feedback) => feedback.tags)
  feedbacks!: Feedback[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User;
}
