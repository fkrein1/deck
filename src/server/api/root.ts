import { presentationRouter } from "~/server/api/routers/presentation";
import { createTRPCRouter } from "~/server/api/trpc";
import { assetsRouter } from "./routers/assets";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  presentation: presentationRouter,
  assets: assetsRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
