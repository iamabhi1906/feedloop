import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Feedback from '../../feedbacks/entities/feedback.entity';
import User from '../../users/entities/user.entity';

@Entity('comments')
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  feedbackId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'int', nullable: true })
  parentId!: string | null;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Feedback, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feedbackId' })
  feedback!: Feedback;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent!: Comment | null;
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies!: Comment[];
}
