import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";

import * as authSchema from "@/database/auth-schema";
import { db } from "@/database/drizzle";
import { sendRegisterOtpEmail, sendResetPasswordOtpEmail } from "@/lib/smtp";
import { authRoles } from "./authRoles";


export const auth = betterAuth({
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL!,
        process.env.BETTER_AUTH_URL!,
        "http://127.0.0.1:3000",
        "http://10.79.207.132:3000",
    ],
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: authSchema
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // DB checks for 5-minute increments
        },
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: true,
        autoSignIn: false,
        minPasswordLength: 8,
        requireEmailVerification: true
    },
    plugins: [
        admin({
            roles: authRoles,
            adminRoles: ["owner", "admin"],
        }),
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log(`[Email Service] Sending ${type} OTP: ${otp} to ${email}`);
                if (type === "forget-password") {
                    await sendResetPasswordOtpEmail({ to: email, otp });
                } else {
                    await sendRegisterOtpEmail({ to: email, otp });
                }
            },
        }),
    ]
});