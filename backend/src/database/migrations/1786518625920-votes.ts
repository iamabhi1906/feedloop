import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { VoteType } from '../../votes/enums/vote-type.enum';

export class Votes1786518625920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'feedbackId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(VoteType),
            default: `'${VoteType.UPVOTE}'`,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('votes', [
      new TableForeignKey({
        name: 'FK_votes_feedback',
        columnNames: ['feedbackId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'feedbacks',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_votes_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndex(
      'votes',
      new TableIndex({
        name: 'IDX_UNIQUE_USER_FEEDBACK_VOTE',
        columnNames: ['userId', 'feedbackId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes');
    await queryRunner.query('DROP TYPE IF EXISTS "votes_type_enum";');
  }
}
