import { ArrowRight } from "@phosphor-icons/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import { Carousel } from "~/components/Carousel";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Taqdimly</title>
        <meta
          name="description"
          content="Create Presentation Slides with AI in seconds"
        />
      </Head>
      <Header />
      <main className="bg-gray-700">
        <Carousel>
          <SwiperSlide>
            <HeroAI />
          </SwiperSlide>
          <SwiperSlide>
            <HeroPitch />
          </SwiperSlide>

          <SwiperSlide>
            <HeroResearch />
          </SwiperSlide>

          <SwiperSlide>
            <HeroData />
          </SwiperSlide>
        </Carousel>

        <StepByStepSection />
      </main>
      <div className="bg-gray-700">
        <Footer />
      </div>
    </>
  );
};

export default Home;

const HeroAI = () => {
  const { data: sessionData } = useSession();
  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <section>
      <div className="flex justify-center bg-gray-800 pt-24">
        <div className="mx-10 mb-20 mt-10 flex max-w-screen-lg flex-col items-center gap-10 lg:mx-0 lg:flex-row lg:items-start">
          <div className="container flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="z-10 text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              AI-Powered <br />
              Business <br />
              <span className="text-fuchsia-500">Presentations</span>
            </h1>
            <h2 className="z-10 px-4 text-center font-light text-white sm:px-20 sm:text-lg">
              Impress your audience with beautifully designed presentations.
            </h2>
            <Link
              className="z-10 flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              href={url}
            >
              <span>Get Started for free</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <Image
            src="/heroes/ai-hero.svg"
            width={404}
            height={380}
            alt=""
            className="z-10 hidden sm:block"
            priority
          />
          <Image
            src="/heroes/ai-hero.svg"
            width={233}
            height={220}
            alt=""
            className="z-10 sm:hidden"
            priority
          />
        </div>
      </div>
      <div className="relative bottom-96 -mb-96 h-96 bg-gray-700 bg-[url('/elipsis/down-white-elipsis.svg')] bg-cover bg-center" />
    </section>
  );
};

const HeroPitch = () => {
  const { data: sessionData } = useSession();
  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <section>
      <div className="flex justify-center bg-gray-800 pt-24">
        <div className="mx-10 mb-20 mt-10 flex max-w-screen-lg flex-col items-center gap-10 lg:mx-0 lg:flex-row lg:items-start">
          <div className="container flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="z-10 text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Craft the <br />
              Perfect <br />
              <span className="text-fuchsia-500">Pitch Deck</span>
            </h1>
            <h2 className="z-10 px-4 text-center font-light text-white sm:px-20 sm:text-lg">
              Win over investors with stunning presentations in no time.
            </h2>
            <Link
              className="z-10 flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              href={url}
            >
              <span>Get Started for free</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <Image
            src="/heroes/pitch-hero.svg"
            width={505}
            height={380}
            alt=""
            className="z-10 hidden sm:block"
            priority
          />
          <Image
            src="/heroes/pitch-hero.svg"
            width={292}
            height={220}
            alt=""
            className="z-10 sm:hidden"
            priority
          />
        </div>
      </div>
      <div className="relative bottom-96 -mb-96 h-96 bg-gray-700 bg-[url('/elipsis/down-white-elipsis.svg')] bg-cover bg-center" />
    </section>
  );
};

const HeroResearch = () => {
  const { data: sessionData } = useSession();
  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <section>
      <div className="flex justify-center bg-gray-800 pt-24">
        <div className="mx-10 mb-20 mt-10 flex max-w-screen-lg flex-col items-center gap-10 lg:mx-0 lg:flex-row lg:items-start">
          <div className="container flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="z-10 text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Efficient <br />
              Market <br />
              <span className="text-fuchsia-500">Research</span>
            </h1>
            <h2 className="z-10 px-4 text-center font-light text-white sm:px-20 sm:text-lg">
              Get data-driven insights and captivating visualizations with ease.
            </h2>
            <Link
              className="z-10 flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              href={url}
            >
              <span>Get Started for free</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <Image
            src="/heroes/research-hero.svg"
            width={446}
            height={380}
            alt=""
            className="z-10 hidden sm:block"
            priority
          />
          <Image
            src="/heroes/research-hero.svg"
            width={258}
            height={220}
            alt=""
            className="z-10 sm:hidden"
            priority
          />
        </div>
      </div>
      <div className="relative bottom-96 -mb-96 h-96 bg-gray-700 bg-[url('/elipsis/down-white-elipsis.svg')] bg-cover bg-center" />
    </section>
  );
};

const HeroData = () => {
  const { data: sessionData } = useSession();
  const url = sessionData ? "/dashboard" : "/log-in";

  return (
    <section>
      <div className="flex justify-center bg-gray-800 pt-24">
        <div className="mx-10 mb-20 mt-10 flex max-w-screen-lg flex-col items-center gap-10 lg:mx-0 lg:flex-row lg:items-start">
          <div className="container flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="z-10 text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Simplify <br />
              Marketing <br />
              <span className="text-fuchsia-500">Plan</span>
            </h1>
            <h2 className="z-10 px-4 text-center font-light text-white sm:px-20 sm:text-lg">
              Make complex data simple and turn numbers into compelling stories.
            </h2>
            <Link
              className="z-10 flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-fuchsia-500"
              href={url}
            >
              <span>Get Started for free</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <Image
            src="/heroes/data-hero.svg"
            width={411}
            height={380}
            alt=""
            className="z-10 hidden sm:block"
            priority
          />
          <Image
            src="/heroes/data-hero.svg"
            width={237}
            height={220}
            alt=""
            className="z-10 sm:hidden"
            priority
          />
        </div>
      </div>
      <div className="relative bottom-96 -mb-96 h-96 bg-gray-700 bg-[url('/elipsis/down-white-elipsis.svg')] bg-cover bg-center" />
    </section>
  );
};

const StepByStepSection = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-16 bg-gray-700 px-6 py-20">
      <div className="max-w-md">
        <p className="mb-4 text-center text-3xl font-bold text-white">
          Get your presentation in four simple steps
        </p>
        <p className="text-center font-light text-white">
          Our intuitive questionnaire makes it easy to create presentations
          that fits your needs and showcases your business in the best way
          possible.
        </p>
      </div>
      <div className="flex max-w-4xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        <Image
          src="/step-1.png"
          width={460}
          height={335}
          alt=""
          className="shrink-0 rounded-2xl shadow-xl"
        />
        <div className="flex max-w-sm flex-col items-center gap-4 sm:px-10">
          <p className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 text-2xl text-fuchsia-300">
            1
          </p>
          <p className="text-center text-2xl font-bold text-white">
            Choose your <br /> presentation type
          </p>
          <p className="text-center font-light text-white">
            Select from a variety of presentation styles, including pitch deck,
            market research, company overview, or marketing plan.
          </p>
        </div>
      </div>

      <div className="flex max-w-4xl flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="flex max-w-sm flex-col items-center gap-4 sm:px-10">
          <p className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 text-2xl text-fuchsia-300">
            2
          </p>
          <p className="text-center text-2xl font-bold text-white">
            Answer a few questions
          </p>
          <p className="text-center font-light text-white">
            Our intuitive questionnaire guides you through the process, helping
            you customize your presentation.
          </p>
        </div>
        <Image
          src="/step-2.png"
          width={460}
          height={335}
          alt=""
          className="shrink-0 rounded-3xl shadow-xl"
        />
      </div>

      <div className="flex max-w-4xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        <Image
          src="/step-3.png"
          width={460}
          height={335}
          alt=""
          className="shrink-0 rounded-3xl shadow-xl"
        />
        <div className="flex max-w-sm flex-col items-center gap-4 sm:px-10">
          <p className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 text-2xl text-fuchsia-300">
            3
          </p>
          <p className="text-center text-2xl font-bold text-white">
            Choose your color theme
          </p>
          <p className="text-center font-light text-white">
            Easily tailor your presentation to match your brand or content by
            choosing from a range of color themes.
          </p>
        </div>
      </div>
      <div className="flex max-w-4xl flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="flex max-w-sm flex-col items-center gap-4 sm:px-10">
          <p className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 text-2xl text-fuchsia-300">
            4
          </p>
          <p className="text-center text-2xl font-bold text-white">
            Bring your <br />
            presentation to life
          </p>
          <p className="text-center font-light text-white">
            Transform your initial idea into a compelling draft as you download
            your PowerPoint and watch it come alive.
          </p>
        </div>
        <Image
          src="/step-4.png"
          width={460}
          height={335}
          alt=""
          className="shrink-0 rounded-3xl shadow-xl"
        />
      </div>
    </section>
  );
};
