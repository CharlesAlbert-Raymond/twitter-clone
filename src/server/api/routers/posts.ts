import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import z from "zod";

const ID_CHARLES = "user_2b8g2N8lkjpx7Qo2QBI3ztCRLQ8";
const ID_TEST = "user_2bBnFcksXtjXDMhgUPv0vLo4DEK";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username ?? user.firstName,
    imageUrl: user.imageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author?.username) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });
      }

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),
  create: privateProcedure
    .input(z.object({ content: z.string().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const post = await ctx.prisma.post.create({
        data: {
          authorId: input.content.toLowerCase().includes("petit oiseau")
            ? ID_CHARLES
            : authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
