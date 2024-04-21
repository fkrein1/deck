import { ArrowRight } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Header } from "~/components/Header";

const Custom404 = () => {
  const { data: sessionData } = useSession();
  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <>
      <Head>
        <title>Page not found</title>
        <meta
          name="description"
          content="It looks like the page you were looking for couldn't be
          found."
        />
      </Head>
      <Header />
      <main className="mb-20 mt-44 flex flex-col items-center justify-center px-6">
        <Image src="/heroes/404-hero.svg" alt="" height={183} width={409} />

        <h1 className="mt-10 text-center text-3xl font-bold text-white">
          Where is it?
        </h1>
        <p className="mt-2 max-w-md text-center font-thin text-white">
          Oops! It looks like the page you were looking for couldn&apos;t be
          found.
        </p>

        <Link
          className="m-auto mt-8 flex w-fit items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-10 py-2 font-semibold text-white transition hover:bg-fuchsia-500"
          href={url}
        >
          <span>Create your presentation</span>
          <ArrowRight size={16} weight="bold" />
        </Link>
      </main>
    </>
  );
};

export default Custom404;
