import assert from "node:assert";
import { test } from "node:test";
import { setup } from "../../config/global-middleware.mjs";

test("Setup can be run", () => {
  assert.ok( setup() == 1);
});