import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1779146795713 implements MigrationInterface {
    name = 'Auto1779146795713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "user_id" integer, CONSTRAINT "PK_4542dd2f38a61354a040ba9fd57" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }
}
