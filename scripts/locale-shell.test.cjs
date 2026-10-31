const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function mountShell(response = Promise.resolve({ ok: true })) {
  const slots = [];
  const navigations = [];
  const requests = [];
  const transitions = [];
  let cursor = 0;
  let fields = [];
  class Element {
    constructor(inContact) {
      this.inContact = inContact;
    }
    closest(selector) {
      assert.equal(selector, "#contact form");
      return this.inContact ? this : null;
    }
  }
  const module = { exports: {} };
  const source = ts.transpileModule(
    readFileSync("src/components/Header/LocaleShell.tsx", "utf8"),
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
    Element,
    AbortSignal,
    fetch(url, options) {
      requests.push({ url, ...options });
      return response;
    },
    document: { querySelectorAll: () => fields },
    window: {
      location: {
        search: "?source=test",
        hash: "#contact",
        assign: () => assert.fail("must not navigate the whole document"),
      },
    },
    require(name) {
      if (name === "next/navigation")
        return {
          useRouter: () => ({
            push: (path, options) => navigations.push({ path, ...options }),
          }),
        };
      if (name === "react")
        return {
          useRef(initial) {
            const index = cursor++;
            slots[index] ??= { current: initial };
            return slots[index];
          },
          useTransition() {
            const index = cursor++;
            slots[index] ??= 0;
            return [
              slots[index] > 0,
              (action) => {
                slots[index]++;
                transitions.push(
                  Promise.resolve(action()).finally(() => slots[index]--),
                );
              },
            ];
          },
          useState(initial) {
            const index = cursor++;
            if (!(index in slots)) slots[index] = initial;
            return [
              slots[index],
              (value) => {
                slots[index] = value;
              },
            ];
          },
        };
      if (name === "./Header") return { default: "header" };
      return require(name);
    },
  });
  function render() {
    cursor = 0;
    return module.exports.default({
      locale: "ro",
      messages: {},
      children: "unchanged server content",
    });
  }
  return {
    render,
    navigations,
    requests,
    async flush() {
      await Promise.all(transitions);
    },
    header: () => render().props.children[0],
    autofill() {
      fields = [{ value: "Synthetic" }];
    },
    event(name, inContact = true) {
      render().props[name]({ target: new Element(inContact) });
    },
  };
}

test("untouched locale navigation persists preference then pushes query and anchor without reloading", async () => {
  const shell = mountShell();
  shell.event("onFocusCapture", false);
  shell.header().props.onLocaleChange("ru");
  assert.deepEqual(shell.navigations, []);
  assert.equal(shell.header().props.isSwitching, true);
  assert.equal(shell.render().props.children[1].props.inert, true);
  await shell.flush();
  assert.deepEqual(shell.navigations, [
    { path: "/ru?source=test#contact", scroll: false },
  ]);
  assert.equal(shell.requests.length, 1);
  assert.equal(shell.requests[0].url, "/ru");
  assert.equal(shell.requests[0].method, "HEAD");
  assert.equal(shell.requests[0].cache, "no-store");
  assert.equal(shell.requests[0].signal.aborted, false);
  assert.equal(
    shell.render().props.children[1].props.children,
    "unchanged server content",
  );
});

for (const event of [
  "onFocusCapture",
  "onInputCapture",
  "onChangeCapture",
  "onSubmitCapture",
]) {
  test(`${event} locks switching synchronously without cancelling the contact event`, () => {
    const shell = mountShell();
    const staleSwitch = shell.header().props.onLocaleChange;
    shell.event(event);
    staleSwitch("ru");
    assert.equal(shell.header().props.switchingLocked, true);
    assert.deepEqual(shell.navigations, []);
    assert.deepEqual(shell.requests, []);
    shell.header().props.onLocaleChange("ru");
    assert.deepEqual(shell.navigations, []);
  });
}

test("current locale is a no-op", () => {
  const shell = mountShell();
  shell.header().props.onLocaleChange("ro");
  assert.deepEqual(shell.requests, []);
  assert.deepEqual(shell.navigations, []);
});

test("pending preference request blocks duplicate switching and keeps content inert", async () => {
  let finish;
  const shell = mountShell(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const switchLocale = shell.header().props.onLocaleChange;
  switchLocale("ru");
  switchLocale("ru");
  assert.equal(shell.requests.length, 1);
  assert.equal(shell.render().props.children[1].props.inert, true);
  assert.deepEqual(shell.navigations, []);
  finish({ ok: true });
  await shell.flush();
  assert.equal(shell.navigations.length, 1);
});

for (const failure of ["http", "network", "timeout"]) {
  test(`${failure} preference failure keeps the document, restores interaction and reports failure`, async () => {
    const response =
      failure === "http"
        ? Promise.resolve({ ok: false })
        : Promise.reject(new Error(failure));
    const shell = mountShell(response);
    shell.header().props.onLocaleChange("ru");
    await shell.flush();
    assert.deepEqual(shell.navigations, []);
    assert.equal(shell.header().props.switchFailed, true);
    assert.equal(shell.render().props.children[1].props.inert, false);
    assert.equal(
      shell.render().props.children[1].props.children,
      "unchanged server content",
    );
    shell.header().props.onLocaleChange("ru");
    await shell.flush();
    assert.equal(shell.requests.length, 2);
  });
}

test("autofill without any observed input event still prevents losing the draft", () => {
  const shell = mountShell();
  shell.autofill();
  shell.header().props.onLocaleChange("ru");
  assert.equal(shell.header().props.switchingLocked, true);
  assert.deepEqual(shell.navigations, []);
});
