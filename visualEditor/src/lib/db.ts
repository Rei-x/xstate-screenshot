import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely';
import { DB } from 'kysely-codegen/dist/db';

export const db = createKysely<DB>();

const migrate = async () => {
  await db.schema.dropTable('machines').ifExists().execute();

  await db.schema
    .createTable('machines')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('fileContent', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .ifNotExists()
    .execute();
};

// migrate();
