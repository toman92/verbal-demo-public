import faker from "faker";

export class FakerSingleton {
    private static instance: Faker.FakerStatic;

    public static setSeed(seed: number): void {
        faker.seed(seed);

        if (!FakerSingleton.instance) {
            FakerSingleton.instance = faker;
        }
    }

    public static getInstance(): Faker.FakerStatic {
        if (!FakerSingleton.instance) {
            FakerSingleton.instance = faker;
        }

        if (!faker.seedValue) {
            // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
            faker.seed(747972783273833265876983797769);
        }

        return FakerSingleton.instance;
    }
}
