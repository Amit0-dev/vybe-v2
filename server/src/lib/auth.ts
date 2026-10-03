import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import prisma from "../infra/db.js";
import { env } from "../config/env.js";
import { magicLink } from "better-auth/plugins";
import { apiLogger } from "../infra/logger.js";
import { magicLinkTemplate, sendEmail } from "../integrations/email/resend.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    advanced: {
        crossSubDomainCookies:
            env.NODE_ENV === "production"
                ? {
                      enabled: true,
                      domain: "vybe.amitx.tech",
                  }
                : undefined,
    },

    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
    },

    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
    },

    trustedOrigins: [env.CLIENT_URL],

    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                try {
                    await sendEmail({
                        to: email,
                        subject: "Sign in to Vybe",
                        html: magicLinkTemplate(url),
                    });

                    apiLogger.info({ email }, "Magic link email sent");
                } catch (error) {
                    apiLogger.error({ err: error, email }, "Failed to send magic link email");

                    throw new Error("Unable to send magic link email");
                }
            },
        }),
    ],
});
