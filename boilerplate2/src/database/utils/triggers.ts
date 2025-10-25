import { Knex } from "knex";

export const createUpdateTrigger = (knex: Knex, tableName: string) =>
    knex.raw(`CREATE TRIGGER table_update
	BEFORE UPDATE ON "${tableName}" FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();`);
