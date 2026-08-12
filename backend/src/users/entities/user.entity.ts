import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Tag from '../../tags/entities/tag.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isLoginDisabled!: boolean;

  @Column({ type: 'boolean', default: false })
  hideFeedbacks!: boolean;

  @Column({ type: 'boolean', default: false })
  hideComments!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Tag, (tag) => tag.createdBy)
  tags!: Tag[];
}
