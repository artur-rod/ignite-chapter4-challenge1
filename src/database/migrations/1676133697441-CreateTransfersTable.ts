import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransfersTable1676133697441 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transfers",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "sender_id",
                        type: "uuid",
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }

                ],
                foreignKeys: [
                    {
                        name: "FKSenderUserTransfer",
                        columnNames: ["sender_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"]
                    },
                    {
                        name: "FKRecipientUserTransfer",
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"]
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transfers")
    }

}
