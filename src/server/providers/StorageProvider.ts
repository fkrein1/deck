import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

export const r2 = new S3Client({
  region: "auto",
  endpoint: env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACESS_KEY,
  },
});
