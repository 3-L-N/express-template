import assert from "node:assert";
import request from "supertest";
import { describe, it, beforeEach } from "node:test";
import { app } from "../../config/app.mjs";
import { silenceOutput } from "../helpers.mjs";

describe("static pages", () => {
  beforeEach((t) => {
    silenceOutput(t);
  });

  it("loads necessary files", async () => {
    for (const assetPath of ["/", "/favicon.ico"]) {
      const asset = await request(app).get(assetPath);
      assert.strictEqual(asset.status, 200, `${assetPath} should be served`);
    }
  });

  it("redirects to canonical URL format", async () => {
    for (const [requestedPath, expectedLocation] of [
      ["/ABOUT.HTML", "/about"],
      ["/INDEX.HTML", "/"],
      ["/index", "/"],
    ]) {
      const response = await request(app).get(requestedPath).redirects(0);
      assert.strictEqual(
        response.status,
        301,
        `${requestedPath} should redirect to canonical format`,
      );
      assert.strictEqual(
        response.headers.location,
        expectedLocation,
        `${requestedPath} should redirect to ${expectedLocation}`,
      );
    }
  });
});
