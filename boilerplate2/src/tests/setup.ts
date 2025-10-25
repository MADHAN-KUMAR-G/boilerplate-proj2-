// Jest setup file
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set test environment
process.env.NODE_ENV = "test";

// Global test timeout
jest.setTimeout(10000);

// Helper function to temporarily enable console for specific tests
export const enableConsoleForTest = () => {
    const originalConsole = { ...console };

    // Restore original console methods
    global.console = {
        ...console,
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
    };

    // Return function to restore mocks
    return () => {
        global.console = originalConsole;
    };
};
