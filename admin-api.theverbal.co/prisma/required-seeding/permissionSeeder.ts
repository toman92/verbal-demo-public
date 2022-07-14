import { seedRole } from "../seeds/seedRole";
import { seedRolePermission } from "../seeds/seedRolePermission";
import { Permission, Role, RolePermission } from "common/build/prisma/client";

const permissionSeedingHelper: (r: Role, p: Permission[]) => Promise<RolePermission[]> = (
    { id: roleId },
    permissions,
) => Promise.all(permissions.map((permission) => seedRolePermission({ roleId, permission })));

export async function permissionSeeder(): Promise<void> {
    const admin = await seedRole({ name: "Admin" });
    const storyAdmin = await seedRole({ name: "StoryAdmin" });
    const coordinator = await seedRole({ name: "Coordinator" });

    // Admin permissions
    await permissionSeedingHelper(admin, [Permission.FullAccess]);

    // Story Admin permissions
    await permissionSeedingHelper(storyAdmin, [
        Permission.WidgetView,
        Permission.StoryView,
        Permission.StoryCreate,
        Permission.StoryDelete,
        Permission.StoryUpdate,
    ]);

    // Coordinator permissions
    await permissionSeedingHelper(coordinator, [
        Permission.WidgetView,
        Permission.UserCreate,
        Permission.UserView,
        Permission.UserDelete,
    ]);
    if (process.env.NODE_ENV !== "test") {
        console.log(`permissions upserted for each role`);
    }
}
