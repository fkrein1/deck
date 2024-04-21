import { type NextApiRequest, type NextApiResponse } from "next";
import { type Readable } from "stream";
import type Stripe from "stripe";
import { env } from "~/env.mjs";
import { stripe } from "~/server/api/routers/stripe";
import { prisma } from "~/server/db";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const webhooksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send("Webhook error");
    }

    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.created":
            const subscriptionCreation = event.data.object as Stripe.Subscription;
            await updateSubscription(subscriptionCreation);
            break;
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscriptionUpdate = event.data.object as Stripe.Subscription;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await updateSubscription(subscriptionUpdate);
            break;

          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        return res.json({ error: "Webhook handler failed" });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

export default webhooksHandler;

async function updateSubscription(subscriptionEvent: Stripe.Subscription) {
  const user = await prisma.user.findUnique({
    where: {
      stripeId: subscriptionEvent.customer as string,
    },
    include: {
      subscription: true,
    },
  });

  if (user?.subscription) {
    await prisma.subscription.update({
      where: {
        userId: user.id,
      },
      data: {
        id: subscriptionEvent.id,
        status: subscriptionEvent.status,
        priceId: subscriptionEvent.items.data[0]?.plan.id as string,
        recurring: subscriptionEvent.items.data[0]?.price.recurring?.interval,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        id: subscriptionEvent.id,
        userId: user?.id as string,
        status: subscriptionEvent.status,
        priceId: subscriptionEvent.items.data[0]?.plan.id as string,
        recurring: subscriptionEvent.items.data[0]?.price.recurring?.interval,
      },
    });
  }
}
