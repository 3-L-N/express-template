import assert from "node:assert";
import { test } from "node:test";
import { getConfig, setup } from "../../config/setup.mjs";

test("Configuration value defaults are applied", () => {
  assert.deepStrictEqual(getConfig(), { host: "127.0.0.1", port: 3000 });
});

test("Configuration values are correctly retrieved", () => {
  process.env.HOST = "0.0.0.3";
  process.env.PORT = "1234";
  assert.deepStrictEqual(getConfig(), { host: "0.0.0.3", port: 1234 });
});

test("Setup can be run", () => {
  assert.ok( setup() == 1);
});