import assert from "node:assert";
import request from "supertest";
import { app } from "../../config/app.mjs";
import { describe, it, beforeEach } from "node:test";
import { silenceOutput } from "../helpers.mjs";

describe("app", () => {
  beforeEach((t) => {
    silenceOutput(t);
  });
  it("returns the dynamic page", async () => {
    const response = await request(app).get("/time");
    assert.strictEqual(response.status, 200);
    assert.match(
      response.text,
      /^This is a dynamic page and the current server time is: .+$/,
    );
  });
});
