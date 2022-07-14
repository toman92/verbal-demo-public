import { seedStory } from "../seeds/seedStory";

export async function storySeeder(): Promise<void> {
    // seed 10 stories created over a month ago
    const oldStoryNames = [
        "The Rainbow Bear",
        "The Blind Man and the Hunter",
        "Butternuts and Beehives",
        "Wild Geese",
        "Abseiling",
        "Code 5",
        "The Umbrella Man",
        "Doctor Dolittle",
        "The Adventures of Aladdin",
        "Pippi Longstocking",
    ];

    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 2);

    for (let i = 0; i < 10; i++) {
        await seedStory({ storyName: oldStoryNames[i], createdDate: oldDate });
    }

    // seed 6 stories created within last 30 days
    const storyNames = [
        "The Railway Children",
        "Gemma, Rory, Rosie and Tom",
        "King of the Birds",
        "Tamasha and the Troll",
        "Eveline",
        "Mr. Green",
    ];

    for (let i = 0; i < 6; i++) {
        await seedStory({ storyName: storyNames[i], createdDate: new Date() });
    }

    console.log("Multiple stories seeded");
}
