import assert from "node:assert/strict";
import test from "node:test";
import { describeFunctionError } from "./functionErrors.mjs";

function responseError(status, body, message = "Edge Function returned a non-2xx status code") {
  return {
    message,
    context: new Response(body, {
      status,
      headers: { "content-type": "application/json" },
    }),
  };
}

test("shows the structured Edge Function error", async () => {
  assert.equal(
    await describeFunctionError(responseError(503, JSON.stringify({ error: "Signup is not configured yet. Please contact Adsrow support." }))),
    "Signup is not configured yet. Please contact Adsrow support.",
  );
});

test("maps an empty 503 response to a safe retry message", async () => {
  assert.match(await describeFunctionError(responseError(503, "")), /temporarily unavailable/);
});

test("maps authentication failures without exposing raw SDK text", async () => {
  assert.match(await describeFunctionError(responseError(401, "not json", "secret token failure")), /could not be authorized/);
});

test("maps network failures without leaking their raw details", async () => {
  assert.match(await describeFunctionError({ message: "Failed to send a request to the Edge Function" }), /unavailable right now/);
});
