import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import superjson from "superjson";
import { DashboardHeader } from "~/components/DashboardHeader";
import { Loading } from "~/components/Loading";
import { appRouter } from "~/server/api/root";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

import { GeneratePresentation } from "~/components/GeneratePresentation";
import Custom404 from "~/pages/404";

const GenerateMarketingPlan: NextPage = () => {
  const { data: subscription } = api.stripe.status.useQuery();
  const router = useRouter();
  const { status } = useSession();

  if (subscription?.limitReached) {
    return <Custom404 />;
  }

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    void router.push("/");
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Generate Marketing Plan</title>
      </Head>
      <DashboardHeader />
      <GeneratePresentation presentationType="marketing_plan" />
    </>
  );
};

export default GenerateMarketingPlan;

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
