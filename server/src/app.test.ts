import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "./app.js";

describe("Application", () => {
    it("returns health status", async () => {
        const app = createApp();

        const response = await request(app).get("/health").expect(200);

        expect(response.body).toEqual({
            status: "ok",
        });
    });
});
