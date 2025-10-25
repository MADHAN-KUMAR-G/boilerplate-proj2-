/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import { db } from "../config/knex";
import { logger } from "../utils/logger";

require("dotenv").config();

async function main() {
    if (!process.argv[2]) {
        throw new Error(
            "Missing command argument. Usage: ts-node knex.ts <section:subcommand>",
        );
    }

    const pair = process.argv[2].split(":");
    const section = pair[0];
    const subcommand = pair[1];

    if (!section || !subcommand) {
        throw new Error("Invalid command format. Use: <section:subcommand>");
    }

    const anyKnex: any = db;

    if (!anyKnex[section]) {
        throw new Error(`Knex command "${section}" is invalid`);
    }
    if (!anyKnex[section][subcommand]) {
        throw new Error(
            `Knex sub command "${section}:${subcommand}" is invalid`,
        );
    }
    if (!["migrate", "seed"].includes(section)) {
        throw new Error(`Unexpected section ${section}`);
    }

    const folder = section === "migrate" ? "migrations" : "seeds";
    const opts = {
        directory: path.resolve(__dirname, "..", "data", folder),
        extension: "ts",
    };

    if (section === "migrate" && ["latest", "rollback"].includes(subcommand)) {
        if (process.env.IGNORE_KNEX_MIGRATION) {
            logger.warn(
                "Variable IGNORE_KNEX_MIGRATION set. Ignoring Knex migrations",
            );
        } else {
            // Apply migration one by one, to avoid locking the DB with all migrations in a single transaction
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const startTime = Date.now();
                const [, migrations] = await db.migrate.up(opts);
                if (migrations.length === 0) break;
                const duration = (Date.now() - startTime) / 1000;
                console.log(
                    `Migration ${migrations[0]} applied in ${duration} seconds`,
                );
            }
        }

        return null;
    }

    return subcommand === "make"
        ? anyKnex[section][subcommand](process.argv[3] || "", opts)
        : anyKnex[section][subcommand](opts);
}

main()
    .then(async () => {
        await db.destroy();
        return process.exit(0);
    })
    .catch(async (error) => {
        console.error(error);
        await db.destroy();
        process.exit(1);
    });
