import assert from "node:assert/strict";
import path from "node:path";
import { describe, it, mock } from "node:test";

import { dynamicViewsPath } from "../../constants.mjs";
import { sendDynamicFile, sendPrivateFile } from "../../config/middleware.mjs";

describe("Application response helpers", () => {
  it("sends private files from the private views directory", () => {
    const sendFile = mock.fn(function sendFile() {});

    sendPrivateFile.call({ sendFile }, "example.html");

    assert.equal(sendFile.mock.callCount(), 1);
    const [fileName, options] = sendFile.mock.calls[0].arguments;
    assert.equal(fileName, "example.html");
    assert.equal(typeof options.root, "string");
  });

  it("renders dynamic files with locals", () => {
    const render = mock.fn(function render() {});
    const locals = { currentTime: "now" };

    sendDynamicFile.call({ render }, "current-time", locals);

    assert.equal(render.mock.callCount(), 1);
    assert.deepStrictEqual(render.mock.calls[0].arguments, [
      path.join(dynamicViewsPath, "current-time"),
      locals,
    ]);
  });
});
