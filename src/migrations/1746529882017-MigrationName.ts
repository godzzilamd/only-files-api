import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1746529882017 implements MigrationInterface {
    name = 'MigrationName1746529882017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_status_enum" AS ENUM('uploading', 'uploaded', 'error')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying(100) NOT NULL, "size" character varying(100) NOT NULL DEFAULT '0', "status" "public"."files_status_enum" NOT NULL DEFAULT 'uploading', "userId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files_categories_categories" ("filesId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_f574eb4c4b5433ca60de4281b8d" PRIMARY KEY ("filesId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_900abf4c522caff2765ef2ae6a" ON "files_categories_categories" ("filesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_26664e610ba24c6315c2d6b66c" ON "files_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files_categories_categories" ADD CONSTRAINT "FK_900abf4c522caff2765ef2ae6a4" FOREIGN KEY ("filesId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "files_categories_categories" ADD CONSTRAINT "FK_26664e610ba24c6315c2d6b66c4" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files_categories_categories" DROP CONSTRAINT "FK_26664e610ba24c6315c2d6b66c4"`);
        await queryRunner.query(`ALTER TABLE "files_categories_categories" DROP CONSTRAINT "FK_900abf4c522caff2765ef2ae6a4"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26664e610ba24c6315c2d6b66c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_900abf4c522caff2765ef2ae6a"`);
        await queryRunner.query(`DROP TABLE "files_categories_categories"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_status_enum"`);
    }

}
