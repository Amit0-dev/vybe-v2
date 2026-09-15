import { authClient } from "@/lib/auth-client";

export async function signInWithGoogle() {
    return authClient.signIn.social({
        provider: "google",
        callbackURL: "/spaces",
    });
}

export async function sendMagicLink(email: string) {
    return authClient.signIn.magicLink({
        email,
        callbackURL: "/spaces",
    });
}

export async function signOut() {
    return authClient.signOut();
}
