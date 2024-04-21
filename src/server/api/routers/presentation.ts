import axios from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ChatGPTProvider } from "~/server/providers/ChatGPTProvider";
import { generatePrompt } from "~/utils/generatePrompt";
import {
  presentationKeys,
  presentationValidationSchema,
  slidesValidationSchema,
} from "~/utils/presentationSchema";

export const presentationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const presentations = await ctx.prisma.presentation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
      select: {
        title: true,
        subtitle: true,
        id: true,
        type: true,
        createdAt: true,
        public: true,
      },
    });
    return presentations;
  }),

  getOneSimple: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const presentation = await ctx.prisma.presentation.findUnique({
        where: {
          id: input.id,
        },
        include: {
          management: true,
        },
      });
      if (presentation?.userId !== userId) {
        return null;
      }
      return presentation;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const presentation = await ctx.prisma.presentation.findUnique({
        where: {
          id: input.id,
        },
        include: {
          management: true,
          slides: {
            orderBy: {
              number: "asc",
            },
            include: {
              graph: {
                include: {
                  dataPoints: true,
                },
              },
              bulletPoints: true,
            },
          },
        },
      });
      if (presentation?.userId !== userId) {
        return null;
      }
      const encodeImageToBase64 = async (url: string) => {
        try {
          const response = await axios.get(
            `${env.CLOUDFLARE_PUBLIC_BUCKET_URL}/${url}`,
            { responseType: "arraybuffer" }
          );

          const base64 = Buffer.from(
            response.data as string,
            "binary"
          ).toString("base64");
          const formattedBase64 = `image/png;base64,${base64}`;

          return formattedBase64;
        } catch (error) {
          console.error("Error fetching image:", error);
          return undefined;
        }
      };

      type Base64 = {
        logo?: string;
        management?: (string | undefined)[];
        pipeline?: string;
      };

      const base64: Base64 = {};

      if (presentation.logo) {
        base64.logo = await encodeImageToBase64(presentation.logo);
      }
      if (presentation.management.length > 0) {
        base64.management = await Promise.all(
          presentation.management.map((value) => encodeImageToBase64(value.url))
        );
      }
      if (presentation.pipeline) {
        base64.pipeline = await encodeImageToBase64(presentation.pipeline);
      }
      return { presentation, base64 };
    }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(presentationKeys),
        description: z.string(),
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const promptData = generatePrompt(input.type, input.description);
      const chatGPT = new ChatGPTProvider();
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const isSubscribed = subscription?.status === "active";
      const chatGPTdata = await Promise.all(
        promptData.prompts.map((prompt) =>
          isSubscribed
            ? chatGPT.generateGPT4(prompt, promptData.tokens)
            : chatGPT.generateGPT3(prompt, promptData.tokens)
        )
      );

      const presentation = chatGPTdata.shift() || "";
      const slides = chatGPTdata;

      const validPresentation = presentationValidationSchema.parse(
        JSON.parse(presentation)
      );

      const slidesJSON = slides.map((slide) => {
        return JSON.parse(slide) as string;
      });

      const validSlides = slidesJSON.map((slide) => {
        return slidesValidationSchema.parse(slide);
      });

      const userId = ctx.session.user.id;

      const { id: presentationId } = await ctx.prisma.presentation.create({
        data: {
          prompt: input.description,
          type: input.type,
          userId,
          title: validPresentation.title,
          subtitle: validPresentation.subtitle,
          public: input.isPublic,
        },
      });

      await Promise.all(
        validSlides.map(async (slide) => {
          if (slide.graph) {
            await ctx.prisma.slide.create({
              data: {
                presentationId,
                number: slide.number,
                title: slide.title,
                subtitle: slide.subtitle,
                summary: slide.summary,
                bulletPoints: {
                  createMany: {
                    data: slide.bulletPoints.map((slide) => {
                      return { value: slide };
                    }),
                  },
                },
                graph: {
                  create: {
                    title: slide.graph.title,
                    source: slide.graph.source,
                    type: slide.graph.type,
                    valueIn: slide.graph.valueIn,
                    dataPoints: {
                      createMany: {
                        data: slide.graph.dataPoints,
                      },
                    },
                  },
                },
              },
            });
          } else {
            await ctx.prisma.slide.create({
              data: {
                presentationId,
                number: slide.number,
                title: slide.title,
                subtitle: slide.subtitle,
                summary: slide.summary,
                bulletPoints: {
                  createMany: {
                    data: slide.bulletPoints.map((slide) => {
                      return { value: slide };
                    }),
                  },
                },
              },
            });
          }
        })
      );

      return presentationId;
    }),
});
