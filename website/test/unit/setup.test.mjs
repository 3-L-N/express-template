import assert from "node:assert";
import { describe, it } from "node:test";
import express from "express";
import { setup } from "../../config/global-middleware.mjs";

describe("setup", () => {
  it("can be run", () => {
    assert.strictEqual(setup(express()), 1);
  });
});
