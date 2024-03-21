import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesUserRolesPermissionsMigration1711045541548 implements MigrationInterface {
  name = 'RolesUserRolesPermissionsMigration1711045541548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userPermissions" jsonb NOT NULL DEFAULT '{"create":false,"read":false,"update":false,"delete":false}', "rolePermissions" jsonb NOT NULL DEFAULT '{"create":false,"read":false,"update":false,"delete":false}', "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_920331560282b8bd21bb02290d" ON "permissions" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "permissionId" uuid, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "REL_23a97f7d96517373f5ea98841c" UNIQUE ("permissionId"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_c1433d71a4838793a49dcad46a" ON "roles" ("id") `);
    await queryRunner.query(
      `CREATE TABLE "usersRoles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "roleId" uuid NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8094993d65f5fb97e8d7a213aac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8094993d65f5fb97e8d7a213aa" ON "usersRoles" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_23a97f7d96517373f5ea98841c9" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRoles" ADD CONSTRAINT "FK_00d84ef80250c870219a11bd05b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRoles" ADD CONSTRAINT "FK_ee43811b1319ce18b887e4ff503" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usersRoles" DROP CONSTRAINT "FK_ee43811b1319ce18b887e4ff503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRoles" DROP CONSTRAINT "FK_00d84ef80250c870219a11bd05b"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_23a97f7d96517373f5ea98841c9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8094993d65f5fb97e8d7a213aa"`);
    await queryRunner.query(`DROP TABLE "usersRoles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c1433d71a4838793a49dcad46a"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_920331560282b8bd21bb02290d"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
