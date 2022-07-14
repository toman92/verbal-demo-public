import { PrismaClientSingleton } from "./prismaClientSingleton";
import { permissionSeeder } from "./required-seeding/permissionSeeder";
import { storySeeder } from "./required-seeding/storySeeder";
import { userSeeder } from "./required-seeding/userSeeder";

async function main() {
    await permissionSeeder();
    await userSeeder();
    await storySeeder();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        const prisma = PrismaClientSingleton.getInstance();
        await prisma.$disconnect();
        process.exit(0);
    });
