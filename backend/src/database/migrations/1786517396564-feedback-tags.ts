import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class FeedbackTags1786517396564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'feedback_tags',
        columns: [
          {
            name: 'feedbackId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'tagId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('feedback_tags', [
      new TableForeignKey({
        columnNames: ['feedbackId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'feedbacks',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feedback_tags');
  }
}
