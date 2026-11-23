import assert from "node:assert";
import { EventEmitter } from "node:events";
import { describe, it, mock } from "node:test";
import { fileURLToPath } from "node:url";

import { silenceOutput } from "../helpers.mjs";

describe("entry point", () => {
  it("runs the app when launched as the program entrypoint", async (t) => {
    const originalArgv1 = process.argv[1];
    const build = t.mock.fn(async function mockBuild() {});

    mock.module("../../config/build.mjs", {
      exports: {
        build,
        engine: function mockEngine(filePath, options, callback) {
          callback(null, "mocked template");
        },
      },
    });

    const { app } = await import("../../config/app.mjs");
    const originalListen = app.listen;
    const registered = {};
    const fakeServer = new EventEmitter();
    fakeServer.address = function getFakeServerAddress() {
      return { address: "127.0.0.1", port: 4321 };
    };
    fakeServer.close = function closeFakeServer(callback) {
      if (callback) {
        callback(null);
      }
      return fakeServer;
    };

    app.listen = function listen() {
      process.nextTick(function emitListening() {
        fakeServer.emit("listening");
      });
      return fakeServer;
    };

    silenceOutput(t);
    t.mock.method(
      process,
      "once",
      function captureSignalHandler(signal, callback) {
        registered[signal] = callback;
        return process;
      },
    );

    const modulePath = fileURLToPath(
      new URL("../../config/index.mjs", import.meta.url),
    );
    process.argv[1] = modulePath;

    try {
      await import("../../config/index.mjs");

      assert.equal(build.mock.callCount(), 1);
      assert.deepStrictEqual(Object.keys(registered).sort(), [
        "SIGINT",
        "SIGTERM",
      ]);
      await registered.SIGINT();
      await registered.SIGTERM();
    } finally {
      app.listen = originalListen;
      process.argv[1] = originalArgv1;
    }
  });
});
