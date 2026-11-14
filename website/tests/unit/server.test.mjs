import assert from "node:assert";
import { EventEmitter, once } from "node:events"; // Only run code once the server is actually listening
import { afterEach, suite, test } from "node:test";
import { createServer, shutdown, getConfig } from "../../config/server.mjs";
import express from "express";

const app = express();

suite("Configuration", () => {
  test("Configuration value defaults are applied", () => {
    assert.deepStrictEqual(getConfig(), { host: "127.0.0.1", port: 3000 });
  });

  test("Configuration values are correctly retrieved", () => {
    process.env.HOST = "0.0.0.3";
    process.env.PORT = "1234";
    assert.deepStrictEqual(getConfig(), { host: "0.0.0.3", port: 1234 });
  });
});


suite("Server creation", () => {

  const host = "127.0.0.2";
  const port = 50000;
  // Delete the server after each test without calling "shutdown"
  let server;
  afterEach(async () => {
    if (server?.listening) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  test("Server is created on specified host and port", async () => {
    server = await createServer(app, host, port);
    await once(server, "listening");
    assert.equal(server.address().address, host);
    assert.equal(server.address().port, port);
  });

  test("Sever is not created if an error is found", async () => {
    server = await createServer(app, host, port);
    await once(server, "listening");
    const exitCode = process.exitCode;
    server.emit("error", new Error("Fake test error"));
    assert.equal(process.exitCode, 1);
    process.exitCode = exitCode;
  });
});

suite("Server shutdown", () => {
  test("Server is shut down", async () => {
    const server = await createServer(app, "127.0.0.1", 0);
    await once(server, "listening");
    await shutdown(server);
    assert.equal(server.listening, false);
  });

  test("Shutdown ignores a missing server", async () => {
    await shutdown(new EventEmitter());
    await shutdown(undefined);
  });

  test("Shutdown rejects when closing fails", async () => {
    const server = {
      listening: true,
      close: (callback) => callback(new Error("close failed")),
    };
    await assert.rejects(shutdown(server), /close failed/);
  });
});