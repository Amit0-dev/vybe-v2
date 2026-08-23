import type { RequestHandler } from "express";

export function asyncHandler(handlerFun: RequestHandler): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(handlerFun(req, res, next)).catch(next);
    };
}
