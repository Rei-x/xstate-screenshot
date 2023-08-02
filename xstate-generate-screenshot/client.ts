import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../visualEditor";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://xstate-viz-screenshot-generator.vercel.app/trpc",
    }),
  ],
});
