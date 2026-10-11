import { createAuthClient } from "better-auth/react";
import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { ac, authRoles } from "./authRoles";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac: ac,
            roles: authRoles,
        }),
        emailOTPClient()
    ],
});