import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { VoteType } from '../enums/vote-type.enum';
import Feedback from '../../feedbacks/entities/feedback.entity';
import User from '../../users/entities/user.entity';

@Entity('votes')
@Unique(['userId', 'feedbackId'])
export default class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  feedbackId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type!: VoteType;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Feedback, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feedbackId' })
  feedback!: Feedback;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
