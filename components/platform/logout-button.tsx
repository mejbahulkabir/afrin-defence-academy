"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/authClient";

interface LogoutButtonProps {
    className?: string;
    iconClassName?: string;
    label?: string;
    redirectTo?: string;
}

export function LogoutButton({
    className,
    iconClassName,
    label = "Sign out",
    redirectTo = "/login",
}: LogoutButtonProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSignOut() {
        if (loading) return;

        setLoading(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "Failed to sign out");
                return;
            }

            setOpen(false);
            toast.success("Signed out successfully");
            router.replace(redirectTo);
            router.refresh();
        } catch {
            toast.error("Unable to sign out. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={className}
                disabled={loading}
            >
                <LogOut
                    aria-hidden="true"
                    className={cn("h-[18px] w-[18px] shrink-0", iconClassName)}
                />
                <span>{label}</span>
            </button>

            <AlertDialog
                open={open}
                onOpenChange={(nextOpen: any) => {
                    if (!loading) setOpen(nextOpen);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to sign out? You will need to sign in
                            again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={loading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={(event: any) => {
                                event.preventDefault();
                                void handleSignOut();
                            }}
                        >
                            {loading ? "Signing out..." : "Sign out"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}