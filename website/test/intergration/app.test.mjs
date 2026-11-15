import assert from "node:assert";
import { describe, it } from "node:test";
import request from "supertest";
import { app } from "../../config/app.mjs";

describe("app", () => {
  it("returns hello world", async () => {
    const response = await request(app).get("/");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.text, "Hello, world!");
  });
});
