import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Poppins } from "next/font/google";
import "swiper/css";
import "swiper/css/navigation";
import "~/styles/globals.css";
import "~/styles/swiper.css";
import { api } from "~/utils/api";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>
        {`
          :root {
            --poppins-font: ${poppins.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} className={poppins} />
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
