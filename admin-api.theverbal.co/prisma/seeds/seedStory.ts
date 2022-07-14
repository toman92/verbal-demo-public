import { fakeStory } from "common/build/fakes/fakeStory";
import { Story } from "common/build/prisma/client";
import { PrismaClientSingleton } from "../prismaClientSingleton";

export async function seedStory(partialStory?: Partial<Story>): Promise<Story> {
    const prisma = PrismaClientSingleton.getInstance();

    const storymeta = { ...fakeStory(partialStory), ...partialStory };

    const story = await prisma.story.upsert({
        create: storymeta,
        update: storymeta,
        where: {
            storyName: storymeta.storyName,
        },
    });

    return story;
}
