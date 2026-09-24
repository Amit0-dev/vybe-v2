import { randomUUID } from "node:crypto";
import { redis } from "../infra/redis.js";

const getConnectionsKey = (spaceId: string) => `vybe:presence:${spaceId}:connections`;

const getUsersKey = (spaceId: string) => `vybe:presence:${spaceId}:users`;

const PRESENCE_LEASE_MS = 60_000; // 60s

const REGISTER_CONNECTION_SCRIPT = `
    redis.call("ZADD", KEYS[1], ARGV[1], ARGV[2])
    redis.call("SADD", KEYS[2], ARGV[3])
    return 1
`;

const UNREGISTER_CONNECTION_SCRIPT = `
    local connectionKey = KEYS[1]
    local usersKey = KEYS[2]

    local connectionMember = ARGV[1]
    local userId = ARGV[2]

    redis.call("ZREM", connectionKey, connectionMember)

    local members = redis.call("ZRANGE", connectionKey, 0, -1)

    for _, member in ipairs(members) do
        if string.match(member, ":" .. userId .. "$") then
            return 0
        end
    end

    redis.call("SREM", usersKey, userId)

    return 1
`;

const CLEANUP_EXPIRED_CONNECTIONS_SCRIPT = `
    local expiredConnections =
        redis.call("ZRANGEBYSCORE", KEYS[1], "-inf", ARGV[1])

    if #expiredConnections == 0 then
        return {}
    end

    local affectedUsers = {}

    for _, connection in ipairs(expiredConnections) do
        local userId = string.match(connection, ":(.+)$")

        affectedUsers[userId] = true

        redis.call("ZREM", KEYS[1], connection)
    end

    local offlineUsers = {}

    for userId in pairs(affectedUsers) do
        local userStillConnected = false

        local remainingConnections =
            redis.call("ZRANGE", KEYS[1], 0, -1)

        for _, connection in ipairs(remainingConnections) do
            local connectionUserId =
                string.match(connection, ":(.+)$")

            if connectionUserId == userId then
                userStillConnected = true
                break
            end
        end

        if not userStillConnected then
            redis.call("SREM", KEYS[2], userId)
            table.insert(offlineUsers, userId)
        end
    end

    return offlineUsers
`;

export async function registerConnection(spaceId: string, userId: string) {
    const connectionId = randomUUID();

    const member = `${connectionId}:${userId}`;
    const expiresAt = Date.now() + PRESENCE_LEASE_MS;

    await redis.eval(REGISTER_CONNECTION_SCRIPT, {
        keys: [getConnectionsKey(spaceId), getUsersKey(spaceId)],
        arguments: [String(expiresAt), member, userId],
    });

    return connectionId;
}

export async function refreshConnection(spaceId: string, connectionId: string, userId: string) {
    const member = `${connectionId}:${userId}`;
    const expiresAt = Date.now() + PRESENCE_LEASE_MS;

    await redis.zAdd(getConnectionsKey(spaceId), {
        score: expiresAt,
        value: member,
    });
}

export async function unregisterConnection(spaceId: string, connectionId: string, userId: string) {
    const member = `${connectionId}:${userId}`;

    const result = await redis.eval(UNREGISTER_CONNECTION_SCRIPT, {
        keys: [getConnectionsKey(spaceId), getUsersKey(spaceId)],
        arguments: [member, userId],
    });

    return Number(result) === 1;
}

// NOTE: Can be improved, but i don't want to add more complexity at starting.
export async function cleanupExpiredPresence(spaceId: string) {
    const now = Date.now();

    const result = await redis.eval(CLEANUP_EXPIRED_CONNECTIONS_SCRIPT, {
        keys: [getConnectionsKey(spaceId), getUsersKey(spaceId)],
        arguments: [String(now)],
    });

    return result as string[];
}
