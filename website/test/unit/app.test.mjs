import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { app } from "../../config/app.mjs";
import { sendDynamicFile, sendPrivateFile } from "../../config/middleware.mjs";

describe("Application", () => {
  it("registers the application response helpers", () => {
    assert.strictEqual(app.response.sendPrivateFile, sendPrivateFile);
    assert.strictEqual(app.response.sendDynamicFile, sendDynamicFile);
  });

  it("configures the EJS view engine", () => {
    assert.strictEqual(app.get("view engine"), "ejs");
  });
});
