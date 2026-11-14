import assert from "node:assert";
import { describe, it } from "node:test";
import { setup } from "../../config/global-middleware.mjs";

describe("setup", () => {
  it("can be run", () => {
    assert.ok(setup() == 1);
  });
});
