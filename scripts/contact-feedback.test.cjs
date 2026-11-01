const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { ru } = require("../src/i18n/ru.ts");

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
      if (name.includes("Header/contactCoordination"))
        return {
          useContactCoordination: () => ({
            update() {},
            beginSubmission: () => true,
          }),
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
    return module.exports.default({
      locale: "ru",
      messages: ru.contact,
      countryNames: ru.countries,
      turnstileMessages: ru.turnstile,
    });
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
    assert.equal(
      form.challenge().props.requested,
      result.status !== "delivery_error" && !(result instanceof Error),
    );
  });
}

for (const result of [
  { status: "delivery_error" },
  new Error("Mock transport failure"),
]) {
  test(`uncertainty survives all edits and blocks submission: ${result.status ?? "transport failure"}`, async () => {
    const form = mountForm();
    form.name().props.onChange({ currentTarget: { value: "Synthetic" } });
    form.challenge().props.onToken("token");
    form.submit();
    await form.finish(result);
    const feedback = () =>
      form.find((node) => node.props?.["aria-live"] === "polite");
    const warning = feedback().props.children;
    assert.match(warning, /не отправляйте/i);
    assert.equal(feedback().props["aria-atomic"], "true");
    assert.equal(form.name().props.value, "Synthetic");
    for (const [field, value] of [
      ["name", "Edited"],
      ["country", "RO"],
      ["phone", "0721234567"],
      ["comment", "Updated comment"],
    ]) {
      const input = () =>
        form.find((node) => node.props?.id === `contact-${field}`);
      input().props.onChange({ currentTarget: { value } });
      assert.equal(input().props.value, value);
      assert.equal(feedback().props.children, warning);
      // A new verification token must not authorize another send after uncertainty.
      form.challenge().props.onToken("fresh-token");
      form.submit();
      assert.equal(form.calls(), 1);
      assert.equal(
        form.find((node) => node.props?.type === "submit").props.disabled,
        true,
      );
    }
    form.find((node) => node.props?.id === "contact-phone").props.onBlur();
    form.challenge().props.onRetry();
    assert.equal(feedback().props.children, warning);
    form.challenge().props.onToken("another-token");
    form.submit();
    assert.equal(form.calls(), 1);
  });
}

test("server field validation is recoverable and pending prevents edits and duplicate sends", async () => {
  const form = mountForm();
  for (const [field, value] of [
    ["name", "Synthetic"],
    ["phone", "0721234567"],
    ["comment", "Context"],
    ["country", "RO"],
  ]) {
    form
      .find((node) => node.props?.id === `contact-${field}`)
      .props.onChange({ currentTarget: { value } });
  }
  form.challenge().props.onToken("token");
  form.submit();
  form.name().props.onChange({ currentTarget: { value: "Lost edit" } });
  form.submit();
  assert.equal(form.name().props.value, "Synthetic");
  assert.equal(form.calls(), 1);
  await form.finish({
    status: "validation_error",
    errors: { name: "invalid" },
  });
  form.name().props.onChange({ currentTarget: { value: "Corrected" } });
  assert.equal(form.name().props["aria-invalid"], undefined);
  form.challenge().props.onToken("fresh-token");
  form.submit();
  assert.equal(form.calls(), 2);
  await form.finish({ status: "accepted" });
  assert.equal(form.name(), undefined);
  form.find((node) => node.props?.type === "button").props.onClick();
  for (const [field, value] of [
    ["name", ""],
    ["phone", ""],
    ["comment", ""],
    ["country", "MD"],
  ]) {
    assert.equal(
      form.find((node) => node.props?.id === `contact-${field}`).props.value,
      value,
    );
  }
});
