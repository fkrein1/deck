import { ArrowCircleLeft, DownloadSimple } from "@phosphor-icons/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { DashboardHeader } from "~/components/DashboardHeader";
import { Loading } from "~/components/Loading";
import { api } from "~/utils/api";
import { generatePptx } from "~/utils/generatePptx";
import { themes } from "~/utils/themes";

const Theme: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const parse = z.string().safeParse(id);
  const parsedId = parse.success ? parse.data : "";

  const {
    data: presentationData,
    isSuccess,
    isLoading,
  } = api.presentation.getOne.useQuery({
    id: parsedId,
  });

  if (presentationData === null) {
    void router.push("/dashboard");
  }

  if (status === "loading") {
    return (
      <>
        <DashboardHeader />
        <Loading />
      </>
    );
  }
  if (status === "unauthenticated") {
    void router.push("/");
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Theme</title>
      </Head>
      <DashboardHeader />
      <main className="flex justify-center px-6">
        {isLoading && <Loading />}
        {isSuccess && (
          <div className="mx-6 max-w-lg">
            <p className="mb-2 text-3xl font-semibold text-white">
              Choose a theme and download your presentation
            </p>
            <p className="font-extralight text-white">
              Pick your preferred color and get your tailored PowerPoint
              presentation.
            </p>
            <div className="mt-8 grid grid-cols-2 items-center gap-5 sm:grid-cols-3">
              {themes.map((theme) => (
                <div key={theme.name} className="flex flex-col items-center">
                  <button
                    key={theme.name}
                    className="h-28 w-28 rounded-3xl shadow-lg hover:opacity-90"
                    onClick={() =>
                      generatePptx({
                        data: presentationData?.presentation,
                        theme,
                        base64: presentationData?.base64,
                      })
                    }
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${theme.background}, ${theme.title}, ${theme.graphFirst}, ${theme.subtitle})`,
                    }}
                  >
                    <DownloadSimple
                      size={26}
                      className="relative bottom-9 left-[74px] text-white"
                    />
                  </button>
                  <p className="mt-4 text-white">{theme.name}</p>
                </div>
              ))}
            </div>
            <div className="my-10 flex justify-center gap-9">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-1 text-sky-200 transition hover:text-sky-100"
              >
                <ArrowCircleLeft size={20} />
                Back
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Theme;
