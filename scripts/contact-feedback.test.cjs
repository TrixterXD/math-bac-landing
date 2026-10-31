const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

// Match the existing Turnstile tests: run component handlers with isolated hook/action mocks.
function mountForm() {
  const slots = [];
  let cursor = 0;
  let calls = 0;
  let finish;
  let transition;
  const module = { exports: {} };
  const source = ts.transpileModule(
    readFileSync("src/components/ContactSection/ContactForm.tsx", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require(name) {
      if (name === "react")
        return {
          useState(initial) {
            const index = cursor++;
            if (!(index in slots)) slots[index] = initial;
            return [
              slots[index],
              (value) => {
                slots[index] =
                  typeof value === "function" ? value(slots[index]) : value;
              },
            ];
          },
          useRef(initial) {
            const index = cursor++;
            slots[index] ??= { current: initial };
            return slots[index];
          },
          useCallback(callback) {
            const index = cursor++;
            slots[index] ??= callback;
            return slots[index];
          },
          startTransition(callback) {
            transition = callback();
          },
        };
      if (name.includes("actions/submitContact"))
        return {
          submitContact() {
            calls++;
            return new Promise((resolve, reject) => {
              finish = (result) =>
                result instanceof Error ? reject(result) : resolve(result);
            });
          },
        };
      if (name.includes("validateContactForm"))
        return {
          validateContactForm: () => ({ valid: true }),
          getSupportedInternationalCountry: () => undefined,
        };
      if (name.includes("TurnstileChallenge")) return { default: "challenge" };
      if (name.includes("countries.data")) return { countries: [] };
      if (name.includes("contactErrors.data"))
        return {
          contactErrorMessages: { name: { invalid: "Invalid name" } },
        };
      if (name.endsWith(".css")) return { default: {} };
      return require(name);
    },
  });
  function render() {
    cursor = 0;
    return module.exports.default();
  }
  function find(predicate, node = render()) {
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of [node.props?.children].flat(Infinity)) {
      const found = find(predicate, child ?? null);
      if (found) return found;
    }
  }
  return {
    find,
    submit() {
      render().props.onSubmit({ preventDefault() {} });
    },
    calls: () => calls,
    async finish(result) {
      finish(result);
      await transition;
    },
    challenge: () => find((node) => node.type === "challenge"),
    name: () => find((node) => node.props?.id === "contact-name"),
  };
}

test("token receipt clears requested feedback without changing the widget or callback", () => {
  const form = mountForm();
  const initial = form.challenge();
  form.submit();
  assert.equal(form.calls(), 0);
  assert.equal(form.challenge().props.requested, true);
  initial.props.onToken("");
  assert.equal(form.challenge().props.requested, true);
  initial.props.onToken("token");
  assert.equal(form.challenge().props.requested, false);
  assert.equal(form.challenge().props.onToken, initial.props.onToken);
  assert.equal(form.challenge().key, initial.key);
});

test("retry starts a fresh widget without stale requested feedback or losing draft", () => {
  const form = mountForm();
  form.name().props.onChange({ currentTarget: { value: "Synthetic" } });
  form.submit();
  const previous = form.challenge();
  previous.props.onRetry();
  assert.equal(form.challenge().props.requested, false);
  assert.notEqual(form.challenge().key, previous.key);
  assert.equal(form.name().props.value, "Synthetic");
  form.submit();
  assert.equal(form.calls(), 0);
  assert.equal(form.challenge().props.requested, true);
});

for (const result of [
  { status: "verification_error" },
  { status: "delivery_error" },
  { status: "server_error" },
  { status: "validation_error", errors: { name: "invalid" } },
  new Error("Mock transport failure"),
  { status: "accepted" },
]) {
  test(`submission completion clears feedback: ${result.status ?? "transport failure"}`, async () => {
    const form = mountForm();
    form.name().props.onChange({ currentTarget: { value: "Synthetic" } });
    form.submit();
    form.challenge().props.onToken("token");
    const previous = form.challenge();
    form.submit();
    form.submit();
    assert.equal(form.calls(), 1);
    assert.equal(
      form.find((node) => node.type === "fieldset").props.disabled,
      true,
    );
    // Token expiration during the pending request must not affect completion recovery.
    form.challenge().props.onToken("");
    await form.finish(result);
    if (result.status === "accepted") {
      assert.equal(form.challenge(), undefined);
      form.find((node) => node.type === "button").props.onClick();
      assert.equal(form.name().props.value, "");
    } else {
      assert.equal(form.name().props.value, "Synthetic");
      assert.notEqual(form.challenge().key, previous.key);
      if (result.status === "validation_error") {
        assert.equal(form.name().props["aria-invalid"], true);
      }
    }
    assert.equal(form.challenge().props.requested, false);
    assert.equal(form.challenge().props.onToken, previous.props.onToken);
    form.submit();
    assert.equal(form.calls(), 1);
    assert.equal(form.challenge().props.requested, true);
  });
}
