import type { RequestHandler } from "express";
import { createSpaceSchema } from "./space.schema.js";
import { createSpace } from "./space.service.js";

export const createSpaceController: RequestHandler = async (req, res) => {
    const input = createSpaceSchema.parse(req.body);

    const user = res.locals.user;

    const space = await createSpace(input, user.id);

    return res.status(201).json({
        space: {
            id: space.id,
            name: space.name,
            joinCode: space.joinCode,
            status: space.status,
            createdAt: space.createdAt,
        },
    });
};
