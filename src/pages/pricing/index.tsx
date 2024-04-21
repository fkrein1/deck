import { CheckCircle } from "@phosphor-icons/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { api } from "~/utils/api";
import { getStripeJs } from "~/utils/stripeJs";

const Pricing: NextPage = () => {
  const { data: pricing, isLoading } = api.stripe.getPrices.useQuery();
  const subscribe = api.stripe.subscribe.useMutation();
  const router = useRouter();
  const { data: sessionData } = useSession();

  const url = sessionData ? "/dashboard" : "/log-in";

  const handleSubscription = async (priceId: string) => {
    if (!sessionData) {
      return router.push("/log-in?redirect=/pricing");
    }

    try {
      const { sessionId } = await subscribe.mutateAsync({ priceId });
      const stripe = await getStripeJs();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      return router.push("dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Pricing</title>
        <meta name="pricing" content="Check out all of our templates" />
      </Head>
      <Header />
      <main className="mb-24 mt-36 flex flex-col items-center px-6">
        <div className="max-w-4xl">
          <h1 className="text-center text-3xl font-bold text-white md:px-24">
            Select your plan
          </h1>
          <h2 className="m-auto mt-4 max-w-lg text-center font-light text-white">
            Whether you &apos;re just getting started or need to create
            high-quality presentations on a regular basis, we&apos;ve got you
            covered.
          </h2>
          <section className="mt-16 flex flex-col-reverse items-center gap-14 md:grid md:grid-cols-3 md:gap-12">
            <div className="rounded-3xl bg-gray-700 px-6 py-8">
              <h2 className="font-semibold text-white">Free</h2>
              {pricing ? (
                <p className="mt-10 text-3xl font-semibold text-fuchsia-400">
                  {pricing.userInEurope ? "€0" : "$0"}
                </p>
              ) : (
                <div className="mt-10 block h-10 w-full animate-pulse rounded-lg bg-gray-600 px-6 py-2" />
              )}

              <p className="mt-2 text-xs font-light text-white">
                Suitable for starting out.
              </p>
              <ul className="mt-10 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    1 presentation
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    PowerPoint download
                  </p>
                </li>
              </ul>
              {pricing ? (
                <Link
                  className="mt-10 block  rounded-full bg-fuchsia-600 px-6 py-2 text-center font-semibold text-white transition hover:bg-fuchsia-500"
                  href={url}
                >
                  Get started
                </Link>
              ) : (
                <div className="mt-10 block h-10 w-full animate-pulse rounded-full bg-fuchsia-600 px-6 py-2" />
              )}
            </div>

            <div className="rounded-3xl bg-gray-700 px-6 py-8">
              <h2 className="font-semibold text-white">Monthly</h2>
              {pricing ? (
                <p className="mt-10 text-3xl font-semibold text-fuchsia-400">
                  {pricing?.monthlyPrice.unit_amount
                    ? `${pricing.userInEurope ? "€" : "$"}${
                        pricing?.monthlyPrice.unit_amount / 100
                      } `
                    : ""}
                  <span className="text-sm font-bold text-white">
                    {pricing?.userInEurope ? "EUR" : "USD"}
                  </span>
                  <span className="text-sm font-light text-white">/ month</span>
                </p>
              ) : (
                <div className="mt-10 block h-10 w-full animate-pulse rounded-lg bg-gray-600 px-6 py-2" />
              )}
              <p className="mt-2 text-xs font-light text-white">
                Great for personnal use.
              </p>
              <ul className="mt-10 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    15 presentations / month
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    PowerPoint download
                  </p>
                </li>
              </ul>
              {pricing ? (
                <button
                  className="mt-10 block w-full  rounded-full bg-fuchsia-600 px-6 py-2 text-center font-semibold text-white transition hover:bg-fuchsia-500"
                  onClick={() => handleSubscription(pricing?.monthlyPrice.id)}
                >
                  Get started
                </button>
              ) : (
                <div className="mt-10 block h-10 w-full animate-pulse rounded-full bg-fuchsia-600 px-6 py-2" />
              )}
            </div>

            <div className="rounded-3xl bg-gray-700 px-6 py-8">
              <div className="relative bottom-16 left-40 flex h-24 w-24 items-center justify-center rounded-full bg-fuchsia-400">
                <p className="mb-2 text-center text-xl font-bold leading-5 text-white">
                  <span className="text-xs">
                    the
                    <br />
                  </span>{" "}
                  best <br />
                  deal
                </p>
              </div>

              <h2 className="-mt-24 font-semibold text-white">Yearly</h2>
              <p className="mt-1 w-fit rounded-xl bg-fuchsia-400 px-3 py-1 text-xs font-bold text-white">
                save 17%
              </p>
              {pricing ? (
                <p className="mt-3 text-3xl font-semibold text-fuchsia-400">
                  {pricing?.yearlyPrice.unit_amount
                    ? `${pricing.userInEurope ? "€" : "$"}${
                        pricing?.yearlyPrice.unit_amount / 100
                      } `
                    : ""}

                  <span className="text-sm font-bold text-white">
                    {pricing?.userInEurope ? "EUR" : "USD"}
                  </span>
                  <span className="text-sm font-light text-white">/ year</span>
                </p>
              ) : (
                <div className="mt-3 block h-10 w-full animate-pulse rounded-lg bg-gray-600 px-6 py-2" />
              )}
              <p className="mt-2 text-xs font-light text-white">
                Perfect for professionals.
              </p>
              <ul className="mt-10 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    20 presentations / month
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-sky-200" size={20} />
                  <p className="text-sm font-light text-white">
                    PowerPoint download
                  </p>
                </li>
              </ul>
              {pricing ? (
                <button
                  className="mt-10 block w-full  rounded-full bg-fuchsia-600 px-6 py-2 text-center font-semibold text-white transition hover:bg-fuchsia-500"
                  onClick={() => handleSubscription(pricing?.yearlyPrice.id)}
                >
                  Get started
                </button>
              ) : (
                <div className="mt-10 block h-10 w-full animate-pulse rounded-full bg-fuchsia-600 px-6 py-2" />
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
