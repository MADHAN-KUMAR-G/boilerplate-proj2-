/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

export interface Configuration {
    // Server
    port: number;
    host: string;
    node_env: string;

    // Logging
    log_level: string;

    // Database
    database_url?: string;

    // Redis
    redis_url?: string;

    // Security
    jwt_secret?: string;
    api_key?: string;

    // External Services
    google_api_key: string;
}

let configuration: Configuration | null = null;

const envsToInclude: (keyof Configuration)[] = [
    "port",
    "host",
    "node_env",
    "log_level",
    "database_url",
    "redis_url",
    "jwt_secret",
    "api_key",
    "google_api_key",
];

function assignEnvironment(config: any): Configuration {
    const newConfig = config;
    envsToInclude.forEach((key) => {
        const lc = key.toLowerCase();
        const uc = key.toUpperCase();
        newConfig[lc] = process.env[uc] || config[lc];
    });
    return newConfig;
}

const ensureInteger = (
    fields: (keyof Configuration)[],
    config: Configuration,
) =>
    fields.forEach((field) => {
        const value = config[field];
        if (typeof value === "string") {
            // eslint-disable-next-line no-param-reassign
            config[field] = parseInt(value, 10) as never;
        }
    });

function load(): Configuration {
    // Default configuration
    const defaultConfig: Configuration = {
        port: 3000,
        host: "localhost",
        node_env: "development",
        log_level: "info",
        google_api_key: "",
    };

    // Load config from env variables
    const config = assignEnvironment(defaultConfig);

    // Ensure integer fields
    const intFields: (keyof Configuration)[] = ["port"];
    ensureInteger(intFields, config);

    return config;
}

export function getConfig(): Configuration {
    if (!configuration) {
        configuration = load();
    }
    return configuration;
}

// Validate configuration on startup
const validateConfiguration = (): void => {
    const config = getConfig();

    if (!config.database_url) {
        logger.warn(
            "⚠️  DATABASE_URL not set - database features will be disabled",
        );
    }

    // if (!config.jwt_secret) {
    //     logger.warn(
    //         "⚠️  JWT_SECRET not set - authentication features will be disabled",
    //     );
    // }

    if (!config.google_api_key) {
        logger.warn(
            "⚠️  GOOGLE_API_KEY not set - Google services will be disabled",
        );
    }
};

// Initialize configuration
if (!configuration) {
    configuration = load();
}

// Run validation on import
validateConfiguration();

// Export for convenience
export default configuration as Configuration;
