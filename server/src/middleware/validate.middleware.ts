import type { ZodType } from "zod";
import type { RequestHandler } from "express";

export function validateBody(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid request body",
                    details: result.error.issues,
                },
            });
        }

        req.body = result.data;

        next();
    };
}
