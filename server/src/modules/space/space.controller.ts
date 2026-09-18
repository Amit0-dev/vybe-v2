import type { RequestHandler } from "express";
import { createSpaceSchema, joinSpaceSchema } from "./space.schema.js";
import {
    closeSpace,
    createSpace,
    getSpace,
    getSpaceMembers,
    getSpaces,
    joinSpace,
    leaveSpace,
} from "./space.service.js";
import { parseSpaceIdParams } from "../../middleware/space.middleware.js";

export const createSpaceController: RequestHandler = async (req, res) => {
    const input = createSpaceSchema.parse(req.body);

    const user = res.locals.user;

    const space = await createSpace(input, user.id);

    return res.status(201).json({ space: { id: space.id } });
};

export const joinSpaceController: RequestHandler = async (req, res) => {
    const input = joinSpaceSchema.parse(req.body);

    const membership = await joinSpace(input, res.locals.user.id);

    return res.status(201).json({
        membership: {
            spaceId: membership.space.id,
            spaceName: membership.space.name,
        },
    });
};

export const getSpaceController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const space = await getSpace(spaceId);

    const isOwner = space.ownerId === res.locals.user.id;

    return res.status(200).json({ ...space, isOwner });
};

export const getSpaceMembersController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const spaceMembers = getSpaceMembers(spaceId);

    return res.status(200).json({ spaceMembers });
};

export const leaveSpaceController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);
    const userId = res.locals.user.id;
    const role = res.locals.spaceMembership.role;

    await leaveSpace(spaceId, userId, role);

    return res.status(204).send();
};

export const closeSpaceController: RequestHandler = async (req, res) => {
    const { spaceId } = parseSpaceIdParams(req.params);

    const space = await closeSpace(spaceId);

    return res.status(200).json({
        space,
    });
};

export const getSpacesController: RequestHandler = async (_req, res) => {
    const userId = res.locals.user.id;

    const memberships = await getSpaces(userId);

    return res.status(200).json({
        spaces: memberships.map((membership) => ({
            spaceId: membership.space.id,
            spaceName: membership.space.name,
            spaceJoinCode: membership.space.joinCode,
            spaceStatus: membership.space.status,
            loggedInUserrole: membership.role,
            owner: membership.space.owner,
            spaceCreatedAt: membership.space.createdAt,
            membershipJoinedAt: membership.joinedAt,
        })),
    });
};
