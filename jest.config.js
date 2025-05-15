module.exports = {
    testEnvironment: 'jsdom', // for React apps, use jsdom (browser-like)
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/index.js",  // ignore entry files if you want
      "!src/serviceWorker.js" // example to ignore
    ],
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ]
  };
  