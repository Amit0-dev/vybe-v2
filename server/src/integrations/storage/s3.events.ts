import { z } from "zod";

const s3ObjectSchema = z.object({
    bucket: z.object({
        name: z.string().min(1),
    }),
    object: z.object({
        key: z.string().min(1),
    }),
});

const s3RecordSchema = z.object({
    eventName: z.string().min(1),
    s3: s3ObjectSchema,
});

const s3EventSchema = z.object({
    Records: z.array(s3RecordSchema).min(1),
});

export function parseS3Event(body: string) {
    const parsed = JSON.parse(body);

    const event = s3EventSchema.parse(parsed);

    return event.Records.map((record) => ({
        eventName: record.eventName,
        bucket: record.s3.bucket,
        key: decodeURIComponent(record.s3.object.key.replace(/\+/g, " ")),
    }));
}
