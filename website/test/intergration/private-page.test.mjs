import assert from "node:assert";
import request from "supertest";
import { describe, it, beforeEach } from "node:test";
import { app } from "../../config/app.mjs";
import { silenceOutput } from "../helpers.mjs";

describe("private page", () => {
  beforeEach(function silenceTestOutput(t) {
    silenceOutput(t);
  });

  it("grants access when access is granted", async () => {
    const response = await request(app).get("/private-page?access=granted");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.type, "text/html");
    assert.match(response.text, /<title>Private page<\/title>/);
    assert.match(response.text, /<h1>Private page<\/h1>/);
  });

  it("does not grant access when access is denied", async () => {
    const response = await request(app).get("/private-page?access=denied");

    assert.strictEqual(response.status, 404);
  });
});
