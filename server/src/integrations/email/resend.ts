import { Resend } from "resend";
import { env } from "../../config/env.js";
import { apiLogger } from "../../infra/logger.js";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: env.MAIL_FROM,
            to,
            subject,
            html,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        apiLogger.error({ err: error, to, subject }, "Failed to send email");

        throw error;
    }
}

export function magicLinkTemplate(url: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <body style="margin:0; padding:0; background-color:#201b17; color:#f5f0e8; font-family:Manrope, 'Trebuchet MS', sans-serif;">
                <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
                    Your secure sign-in link for Vybe.
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#201b17;">
                    <tr>
                        <td align="center" style="padding:48px 16px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
                                <tr>
                                    <td style="padding:0 8px 18px; color:#f1aa5a; font-size:14px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                                        Vybe
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:36px 32px 34px; border:1px solid #494039; border-radius:14px; background-color:#2c2520;">
                                        <h1 style="margin:0; color:#fffaf2; font-size:30px; line-height:1.2; font-weight:700; letter-spacing:-0.02em;">
                                            Welcome back.
                                        </h1>

                                        <p style="margin:18px 0 0; color:#d5c9bc; font-size:16px; line-height:1.6;">
                                            Use the button below to sign in to your Vybe account and get back to the room.
                                        </p>

                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
                                            <tr>
                                                <td align="center" style="border-radius:8px; background-color:#f1aa5a;">
                                                    <a href="${url}" style="display:inline-block; padding:14px 22px; border:1px solid #f1aa5a; border-radius:8px; color:#201b17; font-size:15px; font-weight:700; line-height:1; text-decoration:none;">
                                                        Sign in to Vybe
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin:26px 0 0; color:#a99b8d; font-size:13px; line-height:1.6;">
                                            This secure link expires shortly and can only be used once.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:20px 8px 0; color:#8f8275; font-size:12px; line-height:1.6;">
                                        If you did not request this email, you can safely ignore it.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}
