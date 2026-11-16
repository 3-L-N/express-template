import assert from "node:assert";
import { EventEmitter } from "node:events";
import { afterEach, describe, it } from "node:test";
import { createServer, shutdownServer } from "../../config/server.mjs";
import express from "express";

const app = express();

describe("Server creation", () => {
  const host = "127.0.0.2";
  const port = 50000;
  let previousEnv = { ...process.env };

  // Delete the server after each test without calling "shutdown"
  let server;
  afterEach(async function restoreServerState() {
    process.env = { ...previousEnv };
    if (server?.listening) {
      await new Promise(function closeTestServer(resolve, reject) {
        server.close(function handleTestServerClose(error) {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  });

  it("uses default host and port when environment values are unset", async function usesDefaultHostAndPort(t) {
    t.mock.method(console, "log", function discardLog() {});
    server = await createServer(app);
    assert.equal(server.address().port, 3000);
    assert.equal(server.address().address, "127.0.0.1");
  });

  it("uses the host and port from the environment", async (t) => {
    process.env.HOST = host;
    process.env.PORT = port;
    t.mock.method(console, "log", function discardLog() {});
    server = await createServer(app);
    assert.equal(server.listening, true);
    assert.equal(server.address().address, host);
    assert.equal(server.address().port, port);
  });

  it("rejects if the server fails to listen", async (t) => {
    t.mock.method(console, "log", function discardLog() {});
    server = await createServer(app);
    await assert.rejects(createServer(app), {
      code: "EADDRINUSE",
    });
  });

  it("handles errors", async (t) => {
    t.mock.method(console, "log", function discardLog() {});
    const errorLog = t.mock.method(
      console,
      "error",
      function discardError() {},
    );

    server = await createServer(app);
    const exitCode = process.exitCode;
    const error = new Error("Fake test error");
    try {
      server.emit("error", error);
      assert.equal(process.exitCode, 1);
      assert.deepStrictEqual(errorLog.mock.calls[0].arguments, [
        "Unable to start server:",
        error,
      ]);
    } finally {
      process.exitCode = exitCode;
    }
  });
});

describe("Server shutdown", () => {
  it("works on a running server", async (t) => {
    t.mock.method(console, "log", function discardLog() {});
    const server = await createServer(app);
    await shutdownServer(server);
    assert.equal(server.listening, false);
  });

  it("ignores a missing server", async () => {
    await shutdownServer(new EventEmitter());
    await shutdownServer(undefined);
  });

  it("rejects when closing fails", async () => {
    const server = {
      listening: true,
      close: function closeWithError(callback) {
        callback(new Error("close failed"));
      },
    };
    await assert.rejects(shutdownServer(server), /close failed/);
  });
});
