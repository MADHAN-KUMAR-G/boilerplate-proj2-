import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("User").del();

    // Inserts seed entries
    await knex("User").insert([
        {
            email: "admin@example.com",
            name: "Admin User",
            isActive: true,
        },
        {
            email: "user@example.com",
            name: "Regular User",
            isActive: true,
        },
        {
            email: "inactive@example.com",
            name: "Inactive User",
            isActive: false,
        },
    ]);
}
