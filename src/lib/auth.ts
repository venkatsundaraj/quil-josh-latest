import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import { env } from "./env.mjs";
import EmailProvider from "next-auth/providers/email";
import { Client } from "postmark";
import { Resend } from "resend";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        });
        // const postmarkClient = new Client(env.POSTMARK_API_KEY);
        // const response = await postmarkClient.sendEmailWithTemplate({
        //   From: provider.from as string,
        //   To: identifier,
        //   TemplateId: parseInt(env.POSTMARK_TEMPLATE_ID),
        //   TemplateModel: {
        //     action_url: url,
        //     product_name: "Venkat",
        //   },
        //   Headers: [
        //     {
        //       Name: "X-Entity-Ref-ID",
        //       Value: new Date().getTime() + "",
        //     },
        //   ],
        // });
        const resend = new Resend(env.RESEND_API_KEY);
        const response = await resend.emails.create({
          from: provider.from as string,
          to: identifier,
          subject: "Regarding Authentication",
          text: `Click the link to login - ${url}`,
          headers: {
            "X-Entity-Ref-ID": new Date().getTime() + "",
          },
        });
        console.log(response);
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.email = token.email),
          (session.user.name = token.name),
          (session.user.image = token.picture);
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    redirect() {
      return "/dashboard";
    },
  },
};
