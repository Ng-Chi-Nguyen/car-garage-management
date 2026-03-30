import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const serverEnvExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const clientEnvExample = readFileSync(new URL("../../client/.env.example", import.meta.url), "utf8");

test("server env example exposes the corrected server port key", () => {
  assert.match(serverEnvExample, /APP_PORT_SERVER=5000/);
  assert.doesNotMatch(serverEnvExample, /APP_PORT_SEVER=/);
});

test("client env example documents the api url", () => {
  assert.match(clientEnvExample, /VITE_API_URL=http:\/\/localhost:5000/);
});
