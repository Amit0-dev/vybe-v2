import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { env } from "../../config/env.js";

export function generatePlaybackUrl(storageKey: string) {
    const url = `${env.CLOUDFRONT_DOMAIN}/${storageKey}`;

    return getSignedUrl({
        url,
        keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
        privateKey: env.CLOUDFRONT_PRIVATE_KEY,
        dateLessThan: new Date(Date.now() + 5 * 60 * 1000),
    });
}