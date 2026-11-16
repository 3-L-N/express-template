import assert from "node:assert";
import { EventEmitter } from "node:events";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { app } from "../../config/app.mjs";

describe("entry point", () => {
  it("runs the app when launched as the program entrypoint", async (t) => {
    const originalArgv1 = process.argv[1];
    const originalListen = app.listen;
    const registered = {};
    const fakeServer = new EventEmitter();
    fakeServer.address = () => ({ address: "127.0.0.1", port: 4321 });
    fakeServer.close = (callback) => {
      if (callback) {
        callback(null);
      }
      return fakeServer;
    };

    app.listen = () => {
      process.nextTick(() => fakeServer.emit("listening"));
      return fakeServer;
    };

    t.mock.method(console, "log", () => {});
    t.mock.method(process, "once", (signal, callback) => {
      registered[signal] = callback;
      return process;
    });

    const modulePath = fileURLToPath(
      new URL("../../config/index.mjs", import.meta.url),
    );
    process.argv[1] = modulePath;

    try {
      await import("../../config/index.mjs");

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
