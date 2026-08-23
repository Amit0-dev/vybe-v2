import type { RequestHandler } from "express";
import { createSpaceSchema, joinSpaceSchema } from "./space.schema.js";
import { createSpace, joinSpace } from "./space.service.js";

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

export const joinSpaceController: RequestHandler = async (req, res) => {
    const input = joinSpaceSchema.parse(req.body);

    const membership = await joinSpace(input, res.locals.user.id);

    return res.status(201).json({
        membership: {
            id: membership.id,
            spaceId: membership.spaceId,
            role: membership.role,
            joinedAt: membership.joinedAt,
        },
    });
};
