import { logger } from "./infra/logger.js";
import { deleteMessage, receiveMessages } from "./integrations/queue/sqs.client.js";
import { parseS3Event } from "./integrations/storage/s3.events.js";
import { processSqsMessage } from "./workers/custom-track.worker.js";

async function startWorker() {
    logger.info("Custom track worker started");

    while (true) {
        try {
            const response = await receiveMessages();

            if (!response.Messages?.length) {
                continue;
            }

            for (const message of response.Messages) {
                try {
                    await processSqsMessage(message);
                } catch (error) {
                    logger.error(
                        {
                            err: error,
                            messageId: message.MessageId,
                        },
                        "Failed to process SQS message",
                    );
                }
            }
        } catch (error) {
            logger.error(
                {
                    err: error,
                },
                "Failed to receive SQS messages",
            );
        }
    }
}

startWorker().catch((error) => {
    logger.fatal(
        {
            err: error,
        },
        "Worker crashed",
    );
    process.exit(1);
});
