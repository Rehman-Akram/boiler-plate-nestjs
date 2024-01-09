import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersMigration1704829658115 implements MigrationInterface {
  name = 'UsersMigration1704829658115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'deactivated')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('superAdmin', 'admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "middleName" character varying, "lastName" character varying, "email" character varying(50) NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{admin}', "emailVerified" boolean NOT NULL DEFAULT false, "password" character varying(100) NOT NULL, "phoneNumber" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ff3728a9bed31fbd9cefc1833" ON "users" ("email", "status", "id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_9ff3728a9bed31fbd9cefc1833"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
