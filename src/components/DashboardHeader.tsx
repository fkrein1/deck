import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export const DashboardHeader = () => {
  const { pathname } = useRouter();

  const url = pathname === "/dashboard" ? "/" : "/dashboard";

  return (
    <header className="my-8 flex justify-center">
      <Link href={url}>
        <Image
          src="/logo/full-logo.svg"
          width={180}
          height={52}
          alt="purple taqdimly logo"
          className="hidden md:block"
          priority
        />
        <Image
          src="/logo/full-logo.svg"
          width={137}
          height={40}
          alt="purple taqdimly logo"
          className=" md:hidden"
          priority
        />
      </Link>
    </header>
  );
};
