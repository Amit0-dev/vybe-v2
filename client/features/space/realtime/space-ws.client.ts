type SpaceWsClientOptions = {
    spaceId: string;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: () => void;
    onReconnect?: () => void;
    onMessage?: (event: MessageEvent) => void;
};

export function createSpaceWsClient({
    spaceId,
    onOpen,
    onClose,
    onError,
    onReconnect,
    onMessage,
}: SpaceWsClientOptions) {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_WS_URL is not configured.");
    }

    const url = new URL(baseUrl);
    url.searchParams.set("spaceId", spaceId);

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    let manuallyClosed = false;

    function connect() {
        if (manuallyClosed) return;

        socket = new WebSocket(url.toString());

        socket.addEventListener("open", () => {
            reconnectAttempts = 0;
            onOpen?.();
        });

        socket.addEventListener("close", () => {
            onClose?.();

            if (manuallyClosed) return;

            onReconnect?.();
            scheduleReconnect();
        });

        socket.addEventListener("error", () => {
            onError?.();
        });

        socket.addEventListener("message", (event) => {
            onMessage?.(event);
        });
    }

    function scheduleReconnect() {
        if (manuallyClosed || reconnectTimer) return;

        const baseDelay = 1000; // 1 second
        const maxDelay = 30_000; // 30 seconds

        const exponentialDelay = Math.min(baseDelay * 2 ** reconnectAttempts, maxDelay);

        const jitter = Math.random() * exponentialDelay * 0.5; // 50% jitter
        const delay = exponentialDelay * 0.5 + jitter;

        reconnectAttempts += 1;

        reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
        }, delay);
    }

    function close() {
        manuallyClosed = true;

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }

        socket?.close(1000, "Client leaving Space");
        socket = null;
    }

    connect();

    return {
        close,
    };
}
