import {
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env.js";

const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function generateUploadUrl(storagekey: string) {
    const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: storagekey,
        ContentType: "audio/mpeg",
    });

    return getSignedUrl(s3Client, command, {
        expiresIn: 60 * 5,
    });
}

export async function getObjectMetadata(storageKey: string) {
    return s3Client.send(
        new HeadObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: storageKey,
        }),
    );
}

export async function getObject(storageKey: string) {
    return s3Client.send(
        new GetObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: storageKey,
        }),
    );
}

export async function getObjectBuffer(storageKey: string): Promise<Buffer> {
    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: storageKey,
        }),
    );

    if (!response.Body) {
        throw new Error("S3 object has no body");
    }

    const bytes = await response.Body.transformToByteArray();

    return Buffer.from(bytes);
}
