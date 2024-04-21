import { GoogleLogo, LinkedinLogo } from "@phosphor-icons/react";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Signin: NextPage = () => {
  const router = useRouter();
  const redirect =
    router.query.redirect === "/pricing" ? "/pricing" : "/dashboard";
  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Sign up or log in to your account." />
      </Head>
      <div className="mt-14 flex items-center justify-center gap-6 md:mt-28">
        <Image
          src="/heroes/signin-hero.svg"
          alt=""
          width={440}
          height={363}
          className="hidden md:block"
        />
        <div className="flex w-96 flex-col items-center p-8">
          <Link href="/" className="">
            <Image
              src="/logo/full-logo.svg"
              alt="purple taqdimly logo"
              width={137}
              height={40}
            />
          </Link>
          <h1 className="mt-4 text-center text-3xl font-bold text-white">
            Start creating!
          </h1>
          <p className="mt-1 text-center font-light text-white">
            Sign up or log in to your account.
          </p>
          <button
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-3xl bg-fuchsia-600 px-6 py-2 font-semibold leading-6 text-white transition hover:bg-fuchsia-500"
            onClick={() => void signIn("google", { callbackUrl: redirect })}
          >
            <GoogleLogo size={18} weight="bold" className="shrink-0" />
            Continue with Google
          </button>
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-fuchsia-600 px-6 py-2 font-semibold leading-6 text-white transition hover:bg-fuchsia-500"
            onClick={() => void signIn("linkedin", { callbackUrl: redirect })}
          >
            <LinkedinLogo size={18} weight="bold" className="shrink-0" />
            Continue with Linkedin
          </button>

          <p className="mt-7 px-8 text-center text-xs text-white">
            By signing in, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="font-bold text-fuchsia-400 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-bold text-fuchsia-400 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
