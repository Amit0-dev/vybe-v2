import { customTrackWorkerLogger } from "./infra/logger.js";
import { receiveMessages } from "./integrations/queue/sqs.client.js";
import { processSqsMessage } from "./workers/custom-track.worker.js";

async function startWorker() {
    customTrackWorkerLogger.info("Custom track worker started");

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
                    customTrackWorkerLogger.error(
                        {
                            err: error,
                            messageId: message.MessageId,
                        },
                        "Failed to process SQS message",
                    );
                }
            }
        } catch (error) {
            customTrackWorkerLogger.error(
                {
                    err: error,
                },
                "Failed to receive SQS messages",
            );
        }
    }
}

startWorker().catch((error) => {
    customTrackWorkerLogger.fatal(
        {
            err: error,
        },
        "Custom track processing worker crashed",
    );
    process.exit(1);
});
