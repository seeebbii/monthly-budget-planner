"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Navbar() {
    const { user, loading } = useAuth();

    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <nav className="border-b bg-card">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <span className="text-2xl">FlowFunds</span>
                </Link>

                <div className="flex items-center gap-4">
                    {!loading && (
                        <>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                        {user.displayName}
                                    </span>
                                    <Button variant="outline" onClick={handleLogout}>
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={handleLogin}>Sign In</Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
