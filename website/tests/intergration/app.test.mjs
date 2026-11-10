import assert from "node:assert";
import { test } from "node:test";
import request from "supertest";
import { app } from "../../config/app.mjs";

test("Hello world is returned", async () => {
  const response = await request(app).get("/");
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.text, "Hello, world!");
});