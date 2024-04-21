import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const { data: sessionData } = useSession();

  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <section className="flex flex-col">
      <Image
        src="/heroes/footer-hero.svg"
        width={470}
        height={389}
        alt=""
        className="relative top-56 -mt-56 self-center px-4"
        priority
      />
      <div className="h-64 bg-[url('/elipsis/up-violet-elipsis.svg')] bg-cover bg-center" />
      <footer className="flex flex-col items-center bg-violet-900 px-8">
        <p className="mb-5 max-w-2xl px-6 text-center text-5xl text-white">
          Create your first PowerPoint presentation for free
        </p>
        <Link
          className="mb-10 rounded-full border border-white px-6 py-3 font-semibold text-white no-underline transition hover:border-sky-100 hover:text-sky-100"
          href={url}
        >
          Start for Free
        </Link>

        <div className="h-[1px] w-full bg-sky-200"></div>
        <div className="mt-8 flex flex-col items-center md:mt-12 md:flex-row md:items-center md:gap-24">
          <Image
            src="/logo/full-logo-white.svg"
            width={137}
            height={40}
            alt="white taqdimly logo"
          />
          <nav className="mt-6 grid grid-cols-2 gap-8 md:mt-0 md:gap-10">
            <div>
              <p className="text-sm font-bold text-white">Product</p>

              <Link href="/pricing" className="block text-sm text-white">
                Pricing
              </Link>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Company</p>
              <Link
                href="/terms-of-service"
                className="block text-sm text-white"
              >
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="block text-sm text-white">
                Privacy Policy
              </Link>
            </div>
          </nav>
        </div>
        <p className="mb-4 mt-11 text-center text-sm text-white">
          Taqdimly.ai. All Rights Reserved. <br /> Taqdimly.ai is a trademark of
          Veos Ventures, SL
        </p>
      </footer>
    </section>
  );
};
