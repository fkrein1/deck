import { type NextPage } from "next";
import Head from "next/head";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Header />
      <main>
        <article className="m-auto mb-10 mt-32 max-w-screen-sm px-6 text-white">
          <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
          <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            Please, read carefully this privacy policy before using
            www.taqdimly.ai (the “Website”), a company operated by Veos Ventures,
            SL, a Spanish Company. This Privacy Policy describes how we collect,
            use, and protect personal information that we obtain from users of
            our Website. By accessing or using our software, you consent to the
            collection, use, and disclosure of your personal information in
            accordance with this Privacy Policy. If you do not agree to these
            terms, you must immediately cease using our Website, as you do not
            have our permission to access or use it. The use of the Website is
            conditional upon your acceptance of and compliance with these terms.
          </p>

          <h2 className="mb-4 text-2xl font-bold">Personal Information</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            &quot;Personal information&quot; refers to any information that can
            be used to identify an individual. When you use our Website, we may
            collect personal information from you, such as your name, email
            address, company name, job title, and other contact information. We
            may also collect information about your use of our Website, such as
            the pages you visit and the features you use. We may also collect
            information necessary to fulfill our contractual obligations to you,
            as part of the service delivered by the Website.
          </p>

          <h2 className="mb-4 text-2xl font-bold">
            Use of Personal Information
          </h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            We use personal information to provide and improve our Website, to
            communicate with you, and to fulfill our contractual obligations to
            you. We may also use personal information for direct marketing
            purposes, such as to send you promotional materials or to inform you
            about new features or updates to our software. We will only use your
            personal information for the purposes for which it was collected,
            unless we obtain your consent to use it for other purposes. Direct
            marketing is the act of selling products or services directly to
            consumers rather than through retailers. You may, at any time,
            request that we cease to use your information for direct marketing
            purposes by email at{" "}
            <span className="font-medium text-fuchsia-600">
              contact@taqdimly.ai
            </span>
            .
          </p>

          <h2 className="mb-4 text-2xl font-bold">
            Disclosure of Personal Information
          </h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            We do not sell, rent, or share personal information with third
            parties, except as described in this Privacy Policy. We may disclose
            personal information to our employees, contractors, and service
            providers who need access to the information to provide services to
            us or to you. We may also disclose personal information if required
            by law or if we believe that disclosure is necessary to protect our
            rights, property, or safety, or the rights, property, or safety of
            our users or others.
          </p>

          <h2 className="mb-4 text-2xl font-bold">
            Security of Personal Information
          </h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            We take reasonable measures to protect personal information from
            unauthorized access, disclosure, and misuse. We use
            industry-standard security technologies and procedures to help
            protect personal information from unauthorized access, disclosure,
            and misuse. However, no security system is perfect, and we cannot
            guarantee the security of personal information.
          </p>

          <h2 className="mb-4 text-2xl font-bold">
            International Data Transfers
          </h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            We may transfer personal information to our affiliates or service
            providers in other countries, which may have different data
            protection laws than the country in which the information was
            originally collected. If we transfer personal information to another
            country, we will take appropriate measures to protect the
            information in accordance with applicable data protection laws.
          </p>

          <h2 className="mb-4 text-2xl font-bold">Third-party websites</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            This Website may contain hyperlinks to websites operated by parties
            other than us. We do not control such websites and are not
            responsible for their contents or the privacy or other practices of
            such websites.
          </p>

          <h2 className="mb-4 text-2xl font-bold">Your Rights</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            You have the right to access, modify, and delete your personal
            information that we collect, subject to applicable data protection
            laws. You may also have the right to restrict or object to the
            processing of your personal information, and to receive a copy of
            your personal information in a structured, machine-readable format.
            To exercise these rights, please contact us using the contact
            information provided below.
          </p>
          <h2 className="mb-4 text-2xl font-bold">Children&apos;s privacy</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            This Website is intended for use by a general audience and does not
            offer services to children. Should a child whom we know to be under
            18 send personal information to us, we will use that information
            only to respond to that child to inform him or her that they cannot
            use this Website.
          </p>

          <h2 className="mb-4 text-2xl font-bold">
            Changes to this Privacy Policy
          </h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            We may update this Privacy Policy from time to time by posting a new
            version on our website. We will notify you of any material changes
            to this Privacy Policy by email or by posting a notice on our
            website.
          </p>

          <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
          <p className="mb-4 text-lg font-extralight leading-6">
            If you have any questions, complains or concerns about this Privacy
            Policy or our privacy practices, please contact us at{" "}
            <span className="font-medium text-fuchsia-600">
              contact@taqdimly.ai
            </span>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
