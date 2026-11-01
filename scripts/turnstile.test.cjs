const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { ru } = require("../src/i18n/ru.ts");

// Exercise the actual component callbacks without loading Cloudflare or sending mail.
function mount({ siteKey = "mock-key", requested = false } = {}) {
  const states = [];
  const timers = new Map();
  const tokens = [];
  let cursor = 0;
  let effect;
  let options;
  let removed;
  let retries = 0;
  const container = {};
  const window = {
    setTimeout(callback, delay) {
      timers.set(delay, callback);
      return delay;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    turnstile: {
      render(element, config) {
        assert.equal(element, container);
        options = config;
        return "widget";
      },
      remove(id) {
        removed = id;
      },
    },
  };
  const module = { exports: {} };
  const source = ts.transpileModule(
    readFileSync(
      "src/components/ContactSection/TurnstileChallenge.tsx",
      "utf8",
    ),
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
    process: { env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: siteKey } },
    window,
    require(name) {
      if (name === "react")
        return {
          useRef: () => ({ current: container }),
          useState(initial) {
            const index = cursor++;
            if (!(index in states)) states[index] = initial;
            return [
              states[index],
              (value) => {
                states[index] = value;
              },
            ];
          },
          useEffect(callback) {
            effect ??= callback;
          },
        };
      if (name.endsWith(".css")) return { default: {} };
      return require(name);
    },
  });
  const props = {
    locale: "ru",
    messages: ru.turnstile,
    requested,
    onToken: (token) => tokens.push(token),
    onRetry: () => {
      retries++;
    },
  };
  function render() {
    cursor = 0;
    return module.exports.default(props);
  }
  render();
  const cleanup = effect();
  return {
    tokens,
    timers,
    options: () => options,
    status: () => render().props.children[1].props.children,
    retry() {
      render().props.children[2].props.onClick();
    },
    canRetry: () => Boolean(render().props.children[2]),
    retries: () => retries,
    cleanup,
    removed: () => removed,
  };
}

test("automatic verification is interaction-only and silent on success", () => {
  const widget = mount();
  const options = widget.options();
  assert.equal(options.appearance, "interaction-only");
  assert.equal(options.execution, "render");
  assert.equal(options["response-field"], false);
  assert.equal(widget.status(), "");
  options.callback("token");
  assert.equal(widget.status(), "");
  assert.equal(widget.tokens.at(-1), "token");
  assert.equal(widget.timers.size, 0);
  widget.cleanup();
  assert.equal(widget.removed(), "widget");
  options.callback("stale-token");
  assert.equal(widget.tokens.at(-1), "token");
});

test("submission while waiting and delayed loading have accessible feedback", () => {
  const requested = mount({ requested: true });
  assert.match(requested.status(), /выполняется/);
  requested.options().callback("token");
  assert.equal(requested.status(), "");
  const delayed = mount();
  delayed.timers.get(3000)();
  assert.match(delayed.status(), /выполняется/);
});

test("interaction feedback clears after successful verification", () => {
  const widget = mount();
  widget.options()["before-interactive-callback"]();
  assert.match(widget.status(), /Пройдите/);
  assert.equal(widget.tokens.at(-1), "");
  widget.options()["after-interactive-callback"]();
  assert.match(widget.status(), /выполняется/);
  widget.options().callback("interactive-token");
  assert.equal(widget.status(), "");
});

for (const callback of [
  "error-callback",
  "expired-callback",
  "timeout-callback",
]) {
  test(`${callback} invalidates the token and offers retry`, () => {
    const widget = mount();
    widget.options().callback("token");
    widget.options()[callback]();
    assert.equal(widget.tokens.at(-1), "");
    assert.notEqual(widget.status(), "");
    assert.equal(widget.canRetry(), true);
    widget.retry();
    assert.equal(widget.retries(), 1);
    widget.cleanup();
    const fresh = mount();
    fresh.options().callback("fresh-token");
    assert.equal(fresh.tokens.at(-1), "fresh-token");
    assert.equal(fresh.canRetry(), false);
  });
}

test("missing configuration fails closed", () => {
  const widget = mount({ siteKey: "" });
  assert.equal(widget.options(), undefined);
  assert.equal(widget.tokens.at(-1), "");
  assert.match(widget.status(), /недоступна/);
});
