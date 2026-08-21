import { describe, expect, it } from "vitest";
import { AppError } from "./errors.js";

describe("AppError", () => {
    it("creates an application error", () => {
        const error = new AppError("Space not found", 404, "SPACE_NOT_FOUND");

        expect(error.message).toBe("Space not found");
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe("SPACE_NOT_FOUND");
    });
});
