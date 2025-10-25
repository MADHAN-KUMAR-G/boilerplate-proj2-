import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Create the set_updatedAt function
    await knex.raw(`
        CREATE OR REPLACE FUNCTION set_updatedAt()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW."updatedAt" = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the function
    await knex.raw(`DROP FUNCTION IF EXISTS set_updatedAt();`);
}
