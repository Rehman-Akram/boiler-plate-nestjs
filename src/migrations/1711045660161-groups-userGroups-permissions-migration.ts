import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupsUserGroupsPermissionsMigration1711045660161 implements MigrationInterface {
  name = 'GroupsUserGroupsPermissionsMigration1711045660161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "permissionId" uuid, CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"), CONSTRAINT "REL_7aa8bc7bf140da19af7ba9fee2" UNIQUE ("permissionId"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_659d1483316afb28afd3a90646" ON "groups" ("id") `);
    await queryRunner.query(
      `CREATE TABLE "usersGroups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "groupId" uuid NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dc6d95b2640f69a14d88bb4c845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc6d95b2640f69a14d88bb4c84" ON "usersGroups" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_7aa8bc7bf140da19af7ba9fee21" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersGroups" ADD CONSTRAINT "FK_3f35279973a210c1f1fff4d6549" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersGroups" ADD CONSTRAINT "FK_01ade21ed91a1c8d8b4ddb2dfaa" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usersGroups" DROP CONSTRAINT "FK_01ade21ed91a1c8d8b4ddb2dfaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersGroups" DROP CONSTRAINT "FK_3f35279973a210c1f1fff4d6549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_7aa8bc7bf140da19af7ba9fee21"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_dc6d95b2640f69a14d88bb4c84"`);
    await queryRunner.query(`DROP TABLE "usersGroups"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_659d1483316afb28afd3a90646"`);
    await queryRunner.query(`DROP TABLE "groups"`);
  }
}
