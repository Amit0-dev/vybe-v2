import { logger } from "../infra/logger.js";
import { deleteMessage } from "../integrations/queue/sqs.client.js";
import { parseS3Event } from "../integrations/storage/s3.events.js";
import { processCustomTrack } from "../modules/track/custom-track.processor.js";

export async function processSqsMessage(message: {
    MessageId?: string | undefined;
    Body?: string | undefined;
    ReceiptHandle?: string | undefined;
}) {
    if (!message.Body) {
        logger.warn(
            {
                messageId: message.MessageId,
            },
            "SQS message has no body",
        );

        return;
    }

    let records;

    try {
        records = parseS3Event(message.Body);
    } catch (error) {
        logger.warn(
            {
                err: error,
                messageId: message.MessageId,
            },
            "Ignoring unsupported S3 event message",
        );

        if (message.ReceiptHandle) {
            await deleteMessage(message.ReceiptHandle);
        }

        return;
    }

    console.log("Started processing...", records)
    for (const record of records) {
        await processCustomTrack({
            storageKey: record.key,
        });
    }
    console.log("Processing end :", records)

    if (message.ReceiptHandle) {
        await deleteMessage(message.ReceiptHandle);
    }

    logger.info(
        {
            messageId: message.MessageId,
            records: records.length,
        },
        "SQS message processed successfully",
    );
}
