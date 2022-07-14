module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    modulePathIgnorePatterns: ["./build/"],
    setupFilesAfterEnv: ["./tests/bootstrap.ts"],
};
