"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import { SITE } from "@/constants/site";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/authClient";
import { useSiteSettingsQuery } from "@/queries/settings.queries";

export default function LoginPage() {
    const router = useRouter();
    const { data: settings } = useSiteSettingsQuery();

    const siteName = settings?.name || SITE.name;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
                callbackURL: "/dashboard",
            });

            if (error) {
                toast.error(error.message || "Sign-in failed");
                return;
            }

            toast.success("Signed in successfully");
            router.replace("/dashboard");
            router.refresh();
        } catch {
            toast.error("Unable to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center text-center">
                    <Logo size="lg" className="mb-4" priority />

                    <p
                        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        suppressHydrationWarning
                    >
                        {siteName}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to access your academy portal.
                    </p>
                </div>

                <Card className="shadow-lg shadow-black/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Sign in</CardTitle>
                        <CardDescription>
                            Enter your account credentials to continue.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Secure access for authorized academy users.
                </p>
            </div>
        </main>
    );
}