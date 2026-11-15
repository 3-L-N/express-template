import assert from "node:assert";
import { describe, it } from "node:test";
import request from "supertest";
import { app } from "../../config/app.mjs";

describe("app", () => {
  it("returns the dynamic page", async () => {
    const response = await request(app).get("/");
    assert.strictEqual(response.status, 200);
    assert.match(
      response.text,
      /^This is a dynamic page and the current server time is: .+$/,
    );
  });
});
