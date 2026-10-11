import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";

export async function GET(request: Request) {
    try {

        // return ApiResponse.okMessage("Owner bootstrap is disabled for security reasons. Please create the owner manually.");

        const name = process.env.BOOTSTRAP_OWNER_NAME;
        const email = process.env.BOOTSTRAP_OWNER_EMAIL;
        const password = process.env.BOOTSTRAP_OWNER_PASSWORD;

        if (!name || !email || !password || password.length < 8) {
            return ApiResponse.badRequest("Owner environment variables are missing or invalid");
        }

        const result = await auth.api.createUser({
            body: {
                name,
                email,
                password,
                role: "owner",
                data: {
                    emailVerified: true,
                },
            },
        });

        return ApiResponse.okMessage("Owner created successfully");

    } catch (error) {
        console.error("Owner bootstrap failed:", error);
        return ApiResponse.internalServerError("Unable to create owner");
    }
}
