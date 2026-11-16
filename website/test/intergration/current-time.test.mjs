import assert from "node:assert";
import request from "supertest";
import { app } from "../../config/app.mjs";
import { describe, it, beforeEach } from "node:test";
import { silenceOutput } from "../helpers.mjs";

describe("app", () => {
  beforeEach(function silenceTestOutput(t) {
    silenceOutput(t);
  });
  it("renders the current time as an HTML page", async () => {
    const response = await request(app).get("/time");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.type, "text/html");
    assert.match(response.text, /<title>Current Time<\/title>/);
    assert.match(response.text, /<h1>Current Time<\/h1>/);
    assert.match(
      response.text,
      /The current server time is: <time>[^<]+<\/time>/,
    );
  });
});
