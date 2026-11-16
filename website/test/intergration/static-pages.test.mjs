import assert from "node:assert";
import request from "supertest";
import { describe, it, beforeEach } from "node:test";
import { app } from "../../config/app.mjs";
import { silenceOutput } from "../helpers.mjs";

const baseUrl = new URL(process.env.BASE_URL ?? "http://127.0.0.1:8000");

describe("static pages", () => {
  beforeEach(function silenceTestOutput(t) {
    silenceOutput(t);
  });

  it("loads necessary files", async () => {
    for (const assetPath of ["/", "/favicon.ico"]) {
      const asset = await request(app).get(assetPath);
      assert.strictEqual(asset.status, 200, `${assetPath} should be served`);
    }
  });

  it("redirects to canonical URL", async () => {
    for (const [requestedPath, expectedLocation] of [
      ["/ABOUT.HTML", "/about"],
      ["/INDEX.HTML", "/"],
      ["/index", "/"],
    ]) {
      const response = await request(app).get(requestedPath).redirects(0);
      assert.strictEqual(response.status, 301, `${requestedPath} redirects`);
      assert.strictEqual(
        response.headers.location,
        `${baseUrl}${expectedLocation}`,
        `${requestedPath} redirects to the correct canonical URL`,
      );
    }
  });
});
