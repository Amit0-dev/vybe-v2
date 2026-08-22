import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.get("/me", requireAuth, (_req, res) => {
    return res.status(200).json({
        user: res.locals.user,
    });
});
