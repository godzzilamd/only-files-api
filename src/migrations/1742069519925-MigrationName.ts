import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1742069519925 implements MigrationInterface {
    name = 'MigrationName1742069519925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."file_status_enum" AS ENUM('uploading', 'uploaded', 'error')`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(100) NOT NULL, "size" character varying(100) NOT NULL DEFAULT '0', "status" "public"."file_status_enum" NOT NULL DEFAULT 'uploading', "userId" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'unknown')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'regular')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "job_title" character varying(100), "age" integer, "password" character varying NOT NULL, "gender" "public"."users_gender_enum", "role" "public"."users_role_enum" NOT NULL DEFAULT 'regular', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file_categories_categories" ("fileId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_689df7c622206036f2d8294e80c" PRIMARY KEY ("fileId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea51672007f0a3142b41a29136" ON "file_categories_categories" ("fileId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2448f7d35db0302ee64af595aa" ON "file_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_categories_categories" ADD CONSTRAINT "FK_ea51672007f0a3142b41a29136d" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_categories_categories" ADD CONSTRAINT "FK_2448f7d35db0302ee64af595aaa" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_categories_categories" DROP CONSTRAINT "FK_2448f7d35db0302ee64af595aaa"`);
        await queryRunner.query(`ALTER TABLE "file_categories_categories" DROP CONSTRAINT "FK_ea51672007f0a3142b41a29136d"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2448f7d35db0302ee64af595aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea51672007f0a3142b41a29136"`);
        await queryRunner.query(`DROP TABLE "file_categories_categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TYPE "public"."file_status_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
