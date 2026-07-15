import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1779135292695 implements MigrationInterface {
    name = "Auto1779135292695";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL DEFAULT true, "description" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
