import { GoogleSignInButton } from "./GoogleSignInButton";
import { MagicLinkForm } from "./MagicLinkForm";

export function AuthForm() {
    return (
        <div className="w-full max-w-sm space-y-6">
            <GoogleSignInButton />

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <MagicLinkForm />
        </div>
    );
}
