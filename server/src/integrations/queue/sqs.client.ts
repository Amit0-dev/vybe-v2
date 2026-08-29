import { SQSClient, DeleteMessageCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { env } from "../../config/env.js";

const sqsClient = new SQSClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function receiveMessages() {
    return sqsClient.send(
        new ReceiveMessageCommand({
            QueueUrl: env.SQS_CUSTOM_TRACK_QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20,
            VisibilityTimeout: 60,
        }),
    );
}

export async function deleteMessage(receiptHandle: string) {
    await sqsClient.send(
        new DeleteMessageCommand({
            QueueUrl: env.SQS_CUSTOM_TRACK_QUEUE_URL,
            ReceiptHandle: receiptHandle,
        }),
    );
}
