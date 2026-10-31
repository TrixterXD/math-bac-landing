const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

// Test synchronous coordination directly, without emulating React rendering.
const moduleUnderTest = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync("src/components/Header/contactCoordination.ts", "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText,
  { module: moduleUnderTest, exports: moduleUnderTest.exports, require },
);
const { createContactCoordination } = moduleUnderTest.exports;

function setup() {
  let locked = false;
  const coordination = createContactCoordination((value) => {
    locked = value;
  });
  return { coordination, locked: () => locked };
}

test("empty/focused-empty and cleared drafts navigate without confirmation", () => {
  const { coordination } = setup();
  const noConfirmation = () => assert.fail("empty draft must not prompt");
  assert.equal(coordination.beginNavigation(noConfirmation), true);
  coordination.endNavigation();
  coordination.update({ dirty: true });
  coordination.update({ dirty: false });
  assert.equal(coordination.beginNavigation(noConfirmation), true);
});

test("dirty draft cancellation changes nothing; confirmed discard starts only once", () => {
  const { coordination, locked } = setup();
  coordination.update({ dirty: true });
  assert.equal(
    coordination.beginNavigation(() => false),
    false,
  );
  assert.equal(locked(), false);
  let confirmations = 0;
  const confirm = () => {
    confirmations++;
    return true;
  };
  assert.equal(coordination.beginNavigation(confirm), true);
  assert.equal(coordination.beginNavigation(confirm), false);
  assert.equal(confirmations, 1);
  assert.equal(coordination.beginSubmission(), false);
  coordination.endNavigation();
  assert.equal(coordination.beginSubmission(), true);
});

test("submission wins synchronously and blocks rapid repeated operations", () => {
  const { coordination, locked } = setup();
  assert.equal(coordination.beginSubmission(), true);
  assert.equal(locked(), true);
  assert.equal(coordination.beginSubmission(), false);
  assert.equal(
    coordination.beginNavigation(() => assert.fail("must not prompt")),
    false,
  );
  coordination.update({ pending: false, dirty: false });
  assert.equal(locked(), false);
  assert.equal(
    coordination.beginNavigation(() => assert.fail("success has no draft")),
    true,
  );
});

test("recoverable failure allows discard; uncertainty blocks both operations after edits", () => {
  const { coordination, locked } = setup();
  coordination.beginSubmission();
  coordination.update({ pending: false, dirty: true });
  assert.equal(
    coordination.beginNavigation(() => false),
    false,
  );
  assert.equal(coordination.beginSubmission(), true);
  coordination.update({ pending: false, uncertain: true });
  coordination.update({ dirty: false });
  assert.equal(locked(), true);
  assert.equal(coordination.beginSubmission(), false);
  assert.equal(
    coordination.beginNavigation(() => assert.fail("must not prompt")),
    false,
  );
});
