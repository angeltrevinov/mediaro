import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // your prisma client instance
import { nextCookies } from "better-auth/next-js";
import {
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from "@/lib/better-auth/password-policy";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "sqlite", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: PASSWORD_MIN_LENGTH,
        maxPasswordLength: PASSWORD_MAX_LENGTH,
    },
    plugins: [nextCookies()]
});