import assert from "node:assert/strict";
import test from "node:test";
import { omegaChatRequest, omegaChatText } from "../lib/omega-chat.ts";

test("Omega request keeps project instructions separate from visitor turns", () => {
  const request = omegaChatRequest("Verified project facts", [{ role: "user", content: "Where is Jutaku?" }]);
  assert.equal(request.model, "omega-plus");
  assert.equal(request.stream, false);
  assert.deepEqual(request.messages, [
    { role: "system", content: "Verified project facts" },
    { role: "user", content: "Where is Jutaku?" },
  ]);
});

test("Omega reply extracts only assistant text", () => {
  assert.equal(omegaChatText({ choices: [{ message: { content: "  Singasandra, South Bengaluru.  " } }] }), "Singasandra, South Bengaluru.");
  assert.equal(omegaChatText({ choices: [{ message: { content: [{ type: "text", text: "First" }, { type: "image", text: "ignored" }, { type: "text", text: "Second" }] } }] }), "First\nSecond");
  assert.equal(omegaChatText({ error: { message: "Unavailable" } }), "");
});
