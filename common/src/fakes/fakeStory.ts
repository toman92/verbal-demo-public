import { Story } from "../../build/prisma/client";
import { stories } from "./data/stories";
import { FakerSingleton } from "./fakerSingleton";

export function fakeStory(partial?: Partial<Story>): Story {
    const faker = FakerSingleton.getInstance();
    const story = faker.random.arrayElement(stories);

    return {
        id: partial?.id,
        synopsis: partial?.synopsis ?? faker.lorem.paragraphs(3),
        overview: partial?.overview ?? partial?.type === "Extract" ? faker.lorem.paragraphs(3) : undefined,
        createdDate: partial?.createdDate ?? new Date().toISOString(),
        storyName: partial?.storyName ?? story.storyName,
        author: partial?.author ?? story.author ?? faker.name.findName(),
        type: partial?.type ?? "ShortStory",
    } as Story;
}
