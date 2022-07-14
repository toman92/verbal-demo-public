import { defaultAdminUser } from "../prisma/required-seeding/userSeeder";
import { seedUser } from "../prisma/seeds/seedUser";
import { FakerSingleton } from "common/build/fakes/fakerSingleton";
import { permissionSeeder } from "../prisma/required-seeding/permissionSeeder";
import { PrismaClientSingleton } from "../prisma/prismaClientSingleton";

process.env.DATABASE_URL = "mysql://demo:demo@localhost:3310/demoTest";
process.env.NODE_ENV = "test";
process.env.jwtSecret = "docker";
const prisma = PrismaClientSingleton.getInstance();
let counter = 1;

beforeEach(async () => {
    try {
        await permissionSeeder();

        const role = await prisma.role.findFirst({ where: { name: "Admin" } });
        await seedUser({ ...defaultAdminUser, roleId: role?.id });
    } catch (exception) {}

    FakerSingleton.setSeed(counter++);
    await prisma.$disconnect();
});

afterEach(async () => {
    await clearDatabase();
    await prisma.$disconnect();
});

afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
});

export const clearDatabase = async (): Promise<void> => {
    const modelKeys = prisma._dmmf.datamodel.models.map((model: { name: string }) => model.name);

    const transactions = [];

    transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

    modelKeys.map((table: string) => {
        transactions.push(prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`));
    });

    transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);
    try {
        await prisma.$transaction(transactions);
    } catch (error) {
        console.log(error);
    }
};
