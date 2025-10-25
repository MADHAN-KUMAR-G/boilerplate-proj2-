import knex from "knex";
import { config } from "./env";
import { logger } from "../utils/logger";

// Create Knex configuration
const createKnexConfig = () => {
    const environment = config.NODE_ENV || "development";

    const baseConfig = {
        client: "postgresql" as const,
        pool: {
            min: 2,
            max: environment === "production" ? 20 : 10,
        },
        migrations: {
            directory: "./dist/database/knex-migrations",
            extension: "js",
        },
        seeds: {
            directory: "./dist/database/seeds",
            extension: "js",
        },
    };

    return {
        ...baseConfig,
        connection: config.DATABASE_URL || {
            host: "localhost",
            port: 5432,
            user: "postgres",
            password: "password",
            database: `print_${environment}`,
        },
    };
};

const db = knex(createKnexConfig());

// Test database connection
export const testKnexConnection = async (): Promise<boolean> => {
    try {
        await db.raw("SELECT 1");
        logger.info("Knex database connection successful");
        return true;
    } catch (error) {
        logger.error("Knex database connection failed", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return false;
    }
};

// Graceful shutdown
export const closeKnexConnection = async (): Promise<void> => {
    try {
        await db.destroy();
        logger.info("Knex database connection closed");
    } catch (error) {
        logger.error("Error closing Knex database connection", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export { db };
