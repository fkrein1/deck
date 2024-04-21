import {
  DownloadSimple,
  UserCircle,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSideProps, type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import superjson from "superjson";
import { DashboardHeader } from "~/components/DashboardHeader";
import { Loading } from "~/components/Loading";
import { appRouter } from "~/server/api/root";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import {
  presentationKeys,
  presentationQuestions,
} from "~/utils/presentationSchema";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const subscription = api.stripe.status.useQuery();

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    void router.push("/");
    return <Loading />;
  }

  if (subscription.status !== "success") {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardHeader />
      <main className="mb-10 flex justify-center px-6">
        <section className="flex max-w-screen-md flex-col gap-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
            <Profile subscription={subscription.data} />
            <PresentationSelect
              limitReached={subscription.data.limitReached}
              isSubscribed={subscription.data.isSubscribed}
            />
          </div>
          <PresentationList />
        </section>
      </main>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session, prisma, ipAddress: "" },
    transformer: superjson,
  });

  await helpers.stripe.status.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

interface ProfileProps {
  subscription: {
    isSubscribed: boolean;
    plan: "free" | "monthly" | "yearly";
    usage: number;
    limit: number;
  };
}

const Profile = ({ subscription }: ProfileProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const portalAcess = api.stripe.portal.useMutation();

  const presentationsLeft = subscription.limit - subscription.usage;
  const presentationsLeftText =
    presentationsLeft === 1
      ? `${presentationsLeft} presentation`
      : `${presentationsLeft} presentations`;
  const isFree = subscription.plan === "free";

  const handleCustomerPortal = async () => {
    try {
      const { portalUrl } = await portalAcess.mutateAsync();
      void router.push(portalUrl);
    } catch (err) {}
  };

  return (
    <div className="rounded-sm bg-gray-700 p-8 shadow-lg">
      <div className="flex items-start justify-between ">
        <div className="flex flex-col">
          <UserCircle className="text-gray-400" size={50} weight="fill" />
        </div>

        <div className="flex flex-col gap-2">
          {isFree && (
            <Link
              className="rounded-full bg-fuchsia-600 px-6 py-2 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              href="/pricing"
            >
              Subscribe
            </Link>
          )}
          {!isFree && (
            <button
              className="rounded-full bg-fuchsia-600 px-6 py-2 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              onClick={handleCustomerPortal}
            >
              Subscription
            </button>
          )}
          <button
            className="px-3 py-1 text-sm text-sky-200 transition hover:text-sky-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Log Out
          </button>
        </div>
      </div>

      <div>
        <p className="mt-2 text-xl font-bold text-white">
          {session?.user.name
            ? `Welcome, ${session?.user.name?.split(" ")[0] || ""}!`
            : "Welcome!"}
        </p>
        <p className="text font-light text-white">You look nice today!</p>
        {isFree && (
          <p className="text font-light text-white">Have you seen our plans?</p>
        )}
        {!isFree && (
          <p className="text font-light text-white">
            It&apos;s delightful to have you back.
          </p>
        )}
      </div>

      {isFree && (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-amber-300 px-5 py-2">
          <Warning size={28} className="text-amber-300" />
          <p className="text-xs font-light text-amber-300">
            You have {presentationsLeftText} on your free plan.{" "}
            <Link className="font-bold text-sky-200" href="/pricing">
              Subscribe
            </Link>
          </p>
        </div>
      )}

      {!isFree && (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-amber-300 px-5 py-2">
          <WarningCircle size={28} className="text-amber-300" />
          <p className="text-xs font-light text-amber-300">
            You have {presentationsLeftText} left this month on your{" "}
            <button
              className="font-bold text-sky-200"
              onClick={handleCustomerPortal}
            >
              subscription.
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

const PresentationSelect = ({
  limitReached,
  isSubscribed,
}: {
  limitReached: boolean;
  isSubscribed: boolean;
}) => {
  return (
    <div className="rounded-sm bg-gray-700 p-8 shadow-lg">
      <h2 className="text-2xl font-semibold text-white">Ready to start?</h2>
      <p className="font-light text-white">
        Choose one of the categories below:
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {presentationKeys.map((presentationType) => {
          return (
            <HoverCard.Root key={presentationType} openDelay={300}>
              {limitReached && !isSubscribed && (
                <HoverCard.Trigger asChild>
                  <Link
                    href={`/pricing`}
                    className="flex h-12 items-center justify-center rounded-3xl bg-gray-500 px-4 py-2 text-center text-sm text-white transition hover:bg-gray-400"
                  >
                    {presentationQuestions[presentationType].title}
                  </Link>
                </HoverCard.Trigger>
              )}

              {limitReached && isSubscribed && (
                <HoverCard.Trigger asChild>
                  <div className="flex h-12 cursor-not-allowed items-center justify-center rounded-3xl bg-gray-500 px-4 py-2 text-center text-sm text-white transition hover:opacity-60">
                    {presentationQuestions[presentationType].title}
                  </div>
                </HoverCard.Trigger>
              )}

              {!limitReached && (
                <HoverCard.Trigger asChild>
                  <Link
                    href={`/generate/${presentationQuestions[presentationType].url}`}
                    className="flex h-12 items-center justify-center rounded-3xl bg-gray-500 px-4 py-2 text-center text-sm text-white transition hover:bg-gray-400"
                  >
                    {presentationQuestions[presentationType].title}
                  </Link>
                </HoverCard.Trigger>
              )}

              <HoverCard.Portal>
                <HoverCard.Content
                  className="w-64 bg-white px-6 py-4 text-sm transition"
                  sideOffset={8}
                >
                  {presentationQuestions[presentationType].description}
                  <HoverCard.Arrow className="fill-white" />
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
          );
        })}
      </div>
    </div>
  );
};

const PresentationList = () => {
  const { data, refetch, isLoading } = api.presentation.getAll.useQuery();

  if (isLoading) {
    return <></>;
  }

  if (data && data.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-10 rounded-sm bg-gray-700 p-8 shadow-lg">
      <h2 className="text-2xl font-semibold text-white">
        Here are your saved presentations
      </h2>
      <table className="my-6 flex flex-col">
        <thead>
          <tr className="flex justify-between gap-1 border-b border-sky-100 py-2">
            <th className="basis-3/6 text-start text-sm font-semibold text-white md:basis-6/12">
              Title
            </th>
            <th className="basis-2/6 text-center text-sm font-semibold text-white md:block md:basis-2/12">
              Category
            </th>
            <th className="hidden text-center text-sm font-semibold text-white md:block md:basis-3/12">
              Date
            </th>
            <th className="basis-1/6 text-center text-sm font-semibold text-white md:basis-1/12">
              Get
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((ppt) => (
            <tr
              key={ppt.id}
              className="flex items-center justify-between gap-1 border-b border-sky-100 py-2"
            >
              <td className="basis-3/6 text-start text-sm font-light text-white md:basis-6/12">
                {ppt.title}
              </td>
              <td className="basis-2/6 text-center text-sm font-light text-white md:block md:basis-2/12">
                {presentationQuestions[ppt.type].title}
              </td>
              <td className="hidden text-center text-sm font-light text-white md:block md:basis-3/12">
                {ppt.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>

              <td className="basis-1/6 text-center text-sm font-light text-white md:basis-1/12">
                <DownloadLink id={ppt.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DownloadLink = ({ id }: { id: string }) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <Link className="flex items-center" href={`/dashboard/theme/${id}`}>
        <DownloadSimple
          size={26}
          className="mb-1 shrink-0 text-fuchsia-300 hover:text-fuchsia-200"
        />
      </Link>
    </div>
  );
};
