import { MigrationInterface, QueryRunner } from 'typeorm';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { ROLE_PERMISSIONS } from '@modules/shared/models/role-permissions.const';

export class NewPermissions1601541768300 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get existing permissions in the database
        const existingPermissions = await queryRunner.query(`SELECT  "name", "group" FROM public."permission"`);

        // Iterate through all of the permissions in the permissions.const
        await Promise.all(
            Object.keys(PERMISSIONS).map(async (key) => {
                // Find if the selected permission is missing from the existing permissions
                if (!existingPermissions.some((permission) => permission.name === PERMISSIONS[key].name)) {
                    // If the permission does not exist in the database then insert it
                    await queryRunner.query(
                        `INSERT INTO public.permission ("name","group") VALUES ('${PERMISSIONS[key].name}', '${PERMISSIONS[key].group}')`,
                    );
                    return `('${PERMISSIONS[key].name}', '${PERMISSIONS[key].group}')`;
                }
            }),
        );

        // Get existing roles in the database
        const existingRoles = await queryRunner.query(`SELECT  "name" FROM public."role"`);
        const existingRolePermissions = await queryRunner.query(`SELECT  "Role"."name" AS "roleName",
        "Permission"."name" AS "permissionName"
        FROM "public"."role_permission"
        LEFT JOIN "public"."role" "Role" ON "public"."role_permission"."roleId" = "Role"."roleId"
        LEFT JOIN "public"."permission" "Permission" ON "public"."role_permission"."permissionId" = "Permission"."permissionId"`);

        // Iterate through all of the roles
        await Promise.all(
            ROLE_PERMISSIONS.map(async (role) => {
                // Find if the selected role is missing from the existing roles
                if (!existingRoles.some((existingRole) => existingRole.name === role.name)) {
                    // If the role does not exist in the database then insert it
                    await queryRunner.query(`INSERT INTO public.role ("name") VALUES ('${role.name}')`);
                }

                // iterate through all permissions for that role
                await Promise.all(
                    role.permissions.map(async (permission) => {
                        if (
                            !existingRolePermissions.some((existingRolePermission) => {
                                return (
                                    existingRolePermission.roleName === role.name &&
                                    existingRolePermission.permissionName === permission.name
                                );
                            })
                        ) {
                            // add missing role permissions
                            await queryRunner.query(`INSERT INTO public.role_permission ("roleId", "permissionId")
                                VALUES(
                                (select "roleId" from public."role"  where "role"."name" = '${role.name}'),
                                (select "permissionId" from public."permission" where permission."name" = '${permission.name}')
                                );`);
                        }
                    }),
                );
                return role;
            }),
        );

        //  // Throw error for testing:
        // await queryRunner.query(`INSERT INTO public.permission ("name","group") VALUES ${existingPermissions}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
