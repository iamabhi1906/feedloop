import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import FeedbackVisibility from '../enums/feedback-visibility.enum';
import User from '../../users/entities/user.entity';
import Tag from '../../tags/entities/tag.entity';
import Vote from '../../votes/entities/votes.entity';

@Entity('feedbacks')
export default class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: FeedbackVisibility,
    default: FeedbackVisibility.PUBLIC,
  })
  visibility!: FeedbackVisibility;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Vote, (vote) => vote.feedback)
  votes!: Vote[];

  @ManyToMany(() => Tag, (tag) => tag.feedbacks)
  @JoinTable({
    name: 'feedback_tags',
    joinColumn: {
      name: 'feedbackId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags!: Tag[];
}
