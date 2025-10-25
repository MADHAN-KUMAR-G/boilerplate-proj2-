import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config, validateEnv } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found-handler";
import { generalLimiter } from "./middleware/rate-limiter";
import { healthRouter } from "./routes/health";
import { exampleRouter } from "./routes/example";
import { usersRouter } from "./routes/users";
import { testKnexConnection } from "./config/knex";
import { logger } from "./utils/logger";

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

// Rate limiting (only in production)
if (config.NODE_ENV === "production") {
    app.use(generalLimiter);
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRouter);
app.use("/example", exampleRouter);
app.use("/users", usersRouter);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection and run migrations
        if (config.DATABASE_URL) {
            const dbConnected = await testKnexConnection();
            if (dbConnected) {
                logger.info("Database initialized successfully");

                // Run migrations in production
                if (config.NODE_ENV === "production") {
                    try {
                        logger.info("Running database migrations...");
                        const { execSync } = require("child_process");
                        execSync("yarn migrate", {
                            stdio: "inherit",
                            timeout: 60000, // 60 second timeout
                        });
                        logger.info(
                            "Database migrations completed successfully",
                        );
                    } catch (error) {
                        logger.warn(
                            "Database migrations failed, but continuing...",
                            {
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : "Unknown error",
                            },
                        );
                    }
                }
            } else {
                logger.warn(
                    "Database connection failed, using in-memory storage",
                );
            }
        } else {
            logger.info("No DATABASE_URL provided, using in-memory storage");
        }

        // Start server
        const server = app.listen(config.PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${config.PORT}`);
            console.log(`🌍 Environment: ${config.NODE_ENV}`);
            console.log(
                `📊 Health check available at http://0.0.0.0:${config.PORT}/health`,
            );
        });

        // Graceful shutdown
        process.on("SIGTERM", () => {
            console.log("SIGTERM received, shutting down gracefully");
            server.close(() => {
                console.log("Process terminated");
                process.exit(0);
            });
        });

        process.on("SIGINT", () => {
            console.log("SIGINT received, shutting down gracefully");
            server.close(() => {
                console.log("Process terminated");
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error("Failed to start server", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
        process.exit(1);
    }
}

startServer();

export default app;
