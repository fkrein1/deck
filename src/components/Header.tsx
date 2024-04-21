import { List, X } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { data: sessionData } = useSession();
  const { pathname } = useRouter();

  const ctaUrl = sessionData ? "/dashboard" : "/log-in";

  return (
    <>
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-gray-800 px-8 py-4 shadow-lg">
        <Link href="/">
          <Image
            src="/logo/full-logo.svg"
            width={152}
            height={44}
            alt="blue taqdimly logo"
            className="hidden md:block"
            priority
          />
          <Image
            src="/logo/full-logo.svg"
            width={137}
            height={40}
            alt="blue taqdimly logo"
            className=" md:hidden"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-10 md:flex ">
          <Link
            className="text-sm text-sky-200 transition hover:text-sky-100"
            href="/pricing"
          >
            Pricing
          </Link>

          <Link
            className="text-sm text-sky-200 transition hover:text-sky-100"
            href={ctaUrl}
          >
            Log in
          </Link>

          <Link
            className="rounded-3xl bg-fuchsia-600 px-6 py-2 font-bold text-white transition hover:bg-fuchsia-500"
            href={ctaUrl}
          >
            Try now
          </Link>
        </nav>

        {!open && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden"
          >
            <List size={24} className="text-sky-200" />
          </button>
        )}

        {open && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden"
          >
            <X size={24} className="text-sky-200" />
          </button>
        )}
      </header>

      {open && (
        <nav className="fixed top-[70px] z-50 flex  h-full max-h-full w-full flex-col bg-gray-700 px-4 py-6 md:hidden">
          <Link
            className="border-b border-sky-100 py-4 text-gray-50"
            href="/pricing"
            onClick={
              pathname === "/pricing" ? () => setOpen(false) : () => null
            }
          >
            <span className="px-2">Pricing</span>
          </Link>

          <Link
            className="border-b border-sky-100 py-4 text-gray-50"
            href={ctaUrl}
          >
            <span className="px-2">Log in</span>
          </Link>

          <Link
            className="mt-9 rounded-3xl bg-fuchsia-600 px-6 py-2 text-center text-lg font-bold text-white transition hover:bg-fuchsia-500"
            href={ctaUrl}
          >
            Try now
          </Link>
        </nav>
      )}
    </>
  );
};
