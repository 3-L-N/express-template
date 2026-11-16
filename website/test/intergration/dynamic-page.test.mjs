import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import request from "supertest";
import { silenceOutput } from "../helpers.mjs";
import { app } from "../../config/app.mjs";

describe("app", () => {
  beforeEach((t) => {
    silenceOutput(t);
  });
  it("returns the dynamic page", async () => {
    const response = await request(app).get("/");
    assert.strictEqual(response.status, 200);
    assert.match(
      response.text,
      /^This is a dynamic page and the current server time is: .+$/,
    );
  });
});
