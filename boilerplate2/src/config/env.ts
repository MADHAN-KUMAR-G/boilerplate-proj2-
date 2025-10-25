import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
    // Server
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || "info",

    // Database (optional)
    DATABASE_URL: process.env.DATABASE_URL,

    // Redis (optional)
    REDIS_URL: process.env.REDIS_URL,

    // Security
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEY: process.env.API_KEY,

    // External Services (optional)
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL,
    EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY,
} as const;

// Validate required environment variables
export const validateEnv = () => {
    // Only validate PORT, NODE_ENV has a default value
    const required = ["PORT"];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`,
        );
    }

    // Validate PORT is a number
    if (isNaN(config.PORT)) {
        throw new Error("PORT must be a valid number");
    }

    console.log("✅ Environment validation passed");
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
    console.log(`🚀 Port: ${config.PORT}`);
};

// Validate environment on import
if (config.NODE_ENV === "production") {
    validateEnv();
}
