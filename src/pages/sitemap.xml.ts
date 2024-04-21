import { type NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export function getServerSideProps({ res }: { res: NextApiResponse }) {
  res.setHeader("Content-Type", "text/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
     <loc>${BASE_URL}</loc>
   </url>
   <url>
     <loc>${BASE_URL}/pricing</loc>
   </url>
   <url>
     <loc>${BASE_URL}/log-in</loc>
   </url>
   <url>
     <loc>${BASE_URL}/terms-of-service</loc>
   </url>
   <url>
     <loc>${BASE_URL}/privacy-policy</loc>
   </url>

  </urlset>
`);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
