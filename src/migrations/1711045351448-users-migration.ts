import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersMigration1711045351448 implements MigrationInterface {
  name = 'UsersMigration1711045351448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'pending', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending', "gender" character varying, "emailVerified" boolean NOT NULL DEFAULT false, "password" character varying(100), "phoneNo" character varying, "dateOfBirth" TIMESTAMP, "address" character varying, "avatar" character varying, "phoneVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_8fa17b55b91f0e4b348e1472a13" UNIQUE ("phoneNo"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ff3728a9bed31fbd9cefc1833" ON "users" ("email", "status", "id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_9ff3728a9bed31fbd9cefc1833"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}
