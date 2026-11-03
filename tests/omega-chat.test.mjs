import assert from "node:assert/strict";
import test from "node:test";
import { isCorporateOnlyQuestion, isPlainCalculation, isProjectBrandQuestion, omegaChatRequest, omegaChatText, omegaScope } from "../lib/omega-chat.ts";

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

test("scope gate refuses off-topic classifications and plain arithmetic", () => {
  assert.equal(omegaScope({ choices: [{ message: { content: "OTHER" } }] }), "other");
  assert.equal(omegaScope({ choices: [{ message: { content: "PROJECT" } }] }), "project");
  assert.equal(omegaScope({ choices: [{ message: { content: "PROJECT." } }] }), "project");
  assert.equal(omegaScope({ choices: [{ message: { content: "2 + 1 = 3" } }] }), "other");
  assert.equal(isPlainCalculation("2+1"), true);
  assert.equal(isPlainCalculation("What is 2 + 1?"), true);
  assert.equal(isPlainCalculation("What is Jutaku's price?"), false);
});

test("MEMCO shorthand refers to Jutaku without admitting corporate questions", () => {
  assert.equal(isProjectBrandQuestion("MEMCO"), true);
  assert.equal(isProjectBrandQuestion("where can i find memco"), true);
  assert.equal(isProjectBrandQuestion("Where is MEMCO Skyline?"), true);
  assert.equal(isCorporateOnlyQuestion("Who founded MEMCO?"), true);
  assert.equal(isCorporateOnlyQuestion("What does MEMCO do?"), true);
  assert.equal(isProjectBrandQuestion("What does MEMCO do?"), false);
  assert.equal(isProjectBrandQuestion("What is the capital of France, MEMCO?"), false);
});
