import { logger } from "./infra/logger.js";
import { deleteMessage, receiveMessages } from "./integrations/queue/sqs.client.js";

async function startWorker() {
    logger.info("Custom track worker started");

    while (true) {
        const response = await receiveMessages();

        if (!response.Messages?.length) {
            continue;
        }

        for (const message of response.Messages) {
            logger.info(`Received SQS message: ${message.MessageId}`);

            if (!message.Body) {
                logger.warn(`SQS message has no body`);
                continue;
            }

            logger.info(`Message body: ${message.Body}`);

            if (message.ReceiptHandle) {
                await deleteMessage(message.ReceiptHandle);
            }
        }
    }
}

startWorker().catch((error) => {
    logger.error(
        {
            err: error,
        },
        "Worker crashed",
    );
    process.exit(1);
});
