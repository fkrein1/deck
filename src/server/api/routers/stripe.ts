import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { isUserInEurope } from "~/utils/isUserInEurope";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  appInfo: {
    name: "deckify",
  },
});

export const stripeRouter = createTRPCRouter({
  getPrices: publicProcedure.query(async ({ ctx }) => {
    const userInEurope = await isUserInEurope(ctx.ipAddress);

    if (userInEurope) {
      const [yearlyPrice, monthlyPrice] = await Promise.all([
        stripe.prices.retrieve(env.STRIPE_EUROPE_YEARLY_SUBSCRIPTION_PRICE_ID, {
          expand: ["product"],
        }),

        stripe.prices.retrieve(
          env.STRIPE_EUROPE_MONTHLY_SUBSCRIPTION_PRICE_ID,
          {
            expand: ["product"],
          }
        ),
      ]);
      return { yearlyPrice, monthlyPrice, userInEurope };
    }
    const [yearlyPrice, monthlyPrice] = await Promise.all([
      stripe.prices.retrieve(env.STRIPE_YEARLY_SUBSCRIPTION_PRICE_ID, {
        expand: ["product"],
      }),

      stripe.prices.retrieve(env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID, {
        expand: ["product"],
      }),
    ]);

    return { yearlyPrice, monthlyPrice, userInEurope };
  }),

  subscribe: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (subscription?.status === "active") {
        throw new Error("User is already subscribed");
      }

      if (!ctx.session.user.stripeId) {
        const stripeCustomer = await stripe.customers.create({
          email: ctx.session.user?.email || undefined,
          name: ctx.session.user.name || undefined,
        });

        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            stripeId: stripeCustomer.id,
          },
        });

        ctx.session.user.stripeId = stripeCustomer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: ctx.session.user.stripeId,
        billing_address_collection: "auto",
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL as string}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL as string}/pricing`,
      });

      return { sessionId: stripeCheckoutSession.id };
    }),

  portal: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.stripeId) {
      throw new Error("Unauthorized user to acess stripe portal");
    }

    const stripePortalSession = await stripe.billingPortal.sessions.create({
      customer: ctx.session.user.stripeId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL as string}/dashboard`,
    });

    return { portalUrl: stripePortalSession.url };
  }),

  status: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [subscription, monthlyPresentations, lifetimePresentations] =
      await Promise.all([
        ctx.prisma.subscription.findUnique({
          where: { userId: ctx.session.user.id },
        }),
        ctx.prisma.presentation.count({
          where: {
            userId: ctx.session.user.id,
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        }),
        ctx.prisma.presentation.count({
          where: {
            userId: ctx.session.user.id,
          },
        }),
      ]);

    const isSubscribed =
      subscription?.status === "active" || subscription?.status === "trialing";
    let plan: "free" | "monthly" | "yearly" = "free";
    let limit = 1;
    if (isSubscribed && subscription?.recurring === "month") {
      plan = "monthly";
      limit = 15;
    }
    if (isSubscribed && subscription?.recurring === "year") {
      plan = "yearly";
      limit = 20;
    }
    const usage = Math.min(
      limit,
      plan === "free" ? lifetimePresentations : monthlyPresentations
    );
    const limitReached = limit <= usage;

    return { isSubscribed, plan, limit, usage, limitReached };
  }),
});
