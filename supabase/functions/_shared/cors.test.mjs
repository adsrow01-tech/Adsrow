import assert from "node:assert/strict";
import test from "node:test";
import { corsGate } from "./cors.mjs";

const preflightHeaders = {
  Origin: "",
  "Access-Control-Request-Method": "POST",
  "Access-Control-Request-Headers": "authorization, apikey, content-type, x-client-info",
};

function preflight(origin) {
  return corsGate(new Request("https://project.supabase.co/functions/v1/example", {
    method: "OPTIONS",
    headers: { ...preflightHeaders, Origin: origin },
  }));
}

for (const origin of ["https://adsrow.com", "https://www.adsrow.com"]) {
  test(`allows OPTIONS preflight from ${origin}`, async () => {
    const result = preflight(origin);
    assert.equal(result.allowed, true);
    assert.equal(result.response.status, 204);
    assert.equal(result.response.headers.get("Access-Control-Allow-Origin"), origin);
    assert.equal(result.response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
    assert.equal(
      result.response.headers.get("Access-Control-Allow-Headers"),
      "authorization, apikey, content-type, x-client-info",
    );
    assert.equal(result.response.headers.get("Vary"), "Origin");
  });
}

test("rejects an unauthorized origin without a wildcard", async () => {
  const result = preflight("https://attacker.example");
  assert.equal(result.allowed, false);
  assert.equal(result.response.status, 403);
  assert.equal(result.response.headers.get("Access-Control-Allow-Origin"), "null");
  assert.notEqual(result.response.headers.get("Access-Control-Allow-Origin"), "*");
});

test("rejects a malformed origin and does not reflect it", () => {
  const result = preflight("https://adsrow.com/extra-path");
  assert.equal(result.allowed, false);
  assert.equal(result.response.status, 403);
  assert.equal(result.response.headers.get("Access-Control-Allow-Origin"), "null");
});

test("uses configured origins without allowing wildcard configuration", () => {
  const configured = corsGate(new Request("https://project.supabase.co/functions/v1/example", {
    method: "OPTIONS",
    headers: { ...preflightHeaders, Origin: "https://preview.adsrow.net" },
  }), { appOrigins: "https://preview.adsrow.net, *" });
  assert.equal(configured.response.status, 204);
  assert.equal(configured.response.headers.get("Access-Control-Allow-Origin"), "https://preview.adsrow.net");
});

test("allows the local signup origin only when explicitly configured", () => {
  const origin = "http://localhost:5173";
  assert.equal(preflight(origin).response.status, 403);

  const configured = corsGate(new Request("https://project.supabase.co/functions/v1/example", {
    method: "OPTIONS",
    headers: { ...preflightHeaders, Origin: origin },
  }), { appOrigins: origin });
  assert.equal(configured.response.status, 204);
  assert.equal(configured.response.headers.get("Access-Control-Allow-Origin"), origin);
});
