import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { r2 } from "~/server/providers/StorageProvider";

export const assetsRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const storageKey = randomUUID().concat("-").concat(input.name);
      const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: "deckify",
          Key: storageKey,
          ContentType: input.contentType,
        }),
        { expiresIn: 600 }
      );

      return { signedUrl, storageKey };
    }),
  getMultipleSignedUrl: protectedProcedure
    .input(
      z
        .object({
          name: z.string(),
          contentType: z.string(),
        })
        .array()
    )
    .mutation(async ({ input }) => {
      const storageData = input.map((data) => {
        return {
          storageKey: randomUUID().concat("-").concat(data.name),
          contentType: data.contentType,
        };
      });
      const signedUrls = await Promise.all(
        storageData.map((data) => {
          return getSignedUrl(
            r2,
            new PutObjectCommand({
              Bucket: "deckify",
              Key: data.storageKey,
              ContentType: data.contentType,
            }),
            { expiresIn: 600 }
          );
        })
      );

      const fullStorageData = storageData.map((data, index) => {
        return {
          storageKey: data.storageKey,
          contentType: data.contentType,
          signedUrl: signedUrls[index] as string,
        };
      });

      return { storageData: fullStorageData };
    }),

  addLogo: protectedProcedure
    .input(
      z.object({
        presentationId: z.string(),
        storageKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.presentation.update({
        where: {
          id: input.presentationId,
        },
        data: {
          logo: input.storageKey,
        },
      });
    }),

  addManagement: protectedProcedure
    .input(
      z.object({
        presentationId: z.string(),
        storageKeys: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const keysData = input.storageKeys.map((key) => {
        return { url: key, presentationId: input.presentationId };
      });
      await ctx.prisma.management.createMany({
        data: keysData,
      });
    }),

  addPipeline: protectedProcedure
    .input(
      z.object({
        presentationId: z.string(),
        storageKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.presentation.update({
        where: {
          id: input.presentationId,
        },
        data: {
          pipeline: input.storageKey,
        },
      });
    }),
});
