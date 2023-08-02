import { z } from 'zod';
import { procedure, router } from '../trpc';
import { db } from '../../lib/db';

export const appRouter = router({
  createMachine: procedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return db
        .insertInto('machines')
        .values({
          fileContent: input.source,
        })
        .returning('id')
        .execute();
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
