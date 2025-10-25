import { Knex } from "knex";
import { createUpdateTrigger } from "../../database/utils/triggers";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("User", (table) => {
        table.increments("id").primary();
        table.string("email", 255).unique().notNullable();
        table.string("name", 255).notNullable();
        table.boolean("isActive").defaultTo(true);
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());

        // Indexes for better performance
        table.index("email");
        table.index("isActive");
        table.index("createdAt");
    });

    // Apply the trigger to automatically update updatedAt
    await createUpdateTrigger(knex, "User");
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("User");
}
