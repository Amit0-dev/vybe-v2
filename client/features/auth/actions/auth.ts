import { authClient } from "@/lib/auth-client";

console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

export async function signInWithGoogle() {
    return authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/spaces`,
    });
}

export async function sendMagicLink(email: string) {
    return authClient.signIn.magicLink({
        email,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/spaces`,
    });
}

export async function signOut() {
    return authClient.signOut();
}
