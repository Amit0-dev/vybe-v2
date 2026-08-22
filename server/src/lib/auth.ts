import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import prisma from "../infra/db.js";
import { env } from "../config/env.js";
import { magicLink } from "better-auth/plugins";
import { logger } from "../infra/logger.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
    },

    trustedOrigins: [
        env.CLIENT_URL
    ],

    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                if (env.NODE_ENV === "development") {
                    logger.info(
                        {
                            email,
                            url,
                        },
                        "Magic link generated",
                    );
                }
            },
        }),
    ],
});
