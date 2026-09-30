import type { Request, Response, RequestHandler } from "express";
import { redis } from "../infra/redis.js";

type RateLimitOptions = {
    limit: number;
    windowSeconds: number;
    keyGenerator: (req: Request, res: Response) => string;
};

const RATE_LIMIT_SCRIPT = `
    local current = redis.call("INCR", KEYS[1])

    if current == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return current
`;

export function rateLimiter({
    limit,
    windowSeconds,
    keyGenerator,
}: RateLimitOptions): RequestHandler {
    return async (req, res, next) => {
        const key = `rate-limit:${keyGenerator(req, res)}`;

        const result = await redis.eval(RATE_LIMIT_SCRIPT, {
            keys: [key],
            arguments: [String(windowSeconds)],
        });

        const count = Number(result);

        if (count > limit) {
            return res.status(429).json({
                message: "Too many requests. Please try again later.",
                code: "RATE_LIMIT_EXCEEDED",
            });
        }

        next();
    };
}
