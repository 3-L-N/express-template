import assert from "node:assert/strict";
import path from "node:path";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { dynamicViewsPath } from "../../constants.mjs";
import {
  errorHandler,
  sendDynamicFile,
  sendPrivateFile,
} from "../../config/middleware.mjs";

describe("Application error handler", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  let sendDynamicFile;

  beforeEach(function createErrorResponseMock() {
    sendDynamicFile = mock.fn(function sendDynamicFile() {});
  });

  afterEach(function restoreNodeEnvironment() {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  function assertErrorResponse(error, nodeEnvironment, expectedStatus) {
    process.env.NODE_ENV = nodeEnvironment;

    errorHandler(error, {}, { sendDynamicFile }, mock.fn());

    assert.equal(sendDynamicFile.mock.callCount(), 1);
    assert.deepStrictEqual(sendDynamicFile.mock.calls[0].arguments, [
      "500",
      {
        error: nodeEnvironment === "development" ? error : undefined,
      },
      expectedStatus,
    ]);
  }

  it("shares the error and its status during development", () => {
    const error = Object.assign(new Error("Development failure"), {
      status: 404,
    });

    assertErrorResponse(error, "development", 404);
  });

  it("hides the error and defaults to status 500 outside development", () => {
    assertErrorResponse(new Error("Production failure"), "production", 500);
  });

  it("uses status 500 when a development error has no status", () => {
    assertErrorResponse(new Error("Failure"), "development", 500);
  });
});

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
    const status = mock.fn(function status() {});
    const render = mock.fn(function render() {});
    const locals = { currentTime: "now" };

    sendDynamicFile.call({ status, render }, "current-time", locals);

    assert.equal(status.mock.callCount(), 1);
    assert.deepStrictEqual(status.mock.calls[0].arguments, [200]);
    assert.equal(render.mock.callCount(), 1);
    assert.deepStrictEqual(render.mock.calls[0].arguments, [
      path.join(dynamicViewsPath, "current-time"),
      locals,
    ]);
  });
});
