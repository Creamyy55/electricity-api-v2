module.exports = {
    testEnviroment :"node",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.js"],
    collectCoverageFrom: ["index.js", "**/*.js", "!/node_modules/**"],
    coveragePathIgnorePatterns:["/node_modules/"],
    verbose: true,
}