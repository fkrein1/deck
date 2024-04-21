import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo/favicon.ico" />
        </Head>

        <body className="bg-gray-600">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
