import { z } from 'zod';
import { procedure, router } from '../trpc';
import { db } from '../../lib/db';
import { getBaseUrl } from '../../lib/trpc';

export const appRouter = router({
  createMachine: procedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const url = getBaseUrl();

      const { id } = await db
        .insertInto('machines')
        .values({
          fileContent: input.source,
        })
        .returning('id')
        .executeTakeFirstOrThrow();

      const params = new URLSearchParams({
        url: `${url}/${id}`,
        element: '#canvas > div:nth-child(1) > div:nth-child(2)',
      });

      const screenshotApiUrl = `https://browser-screenshots.vercel.app/api?${params}`;

      return {
        screenshotUrl: screenshotApiUrl,
        url: `${url}/${id}`,
        id,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
