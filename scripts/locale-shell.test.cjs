const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function mountShell() {
  const slots = [];
  const navigations = [];
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
    document: { querySelectorAll: () => fields },
    window: {
      location: {
        search: "?source=test",
        hash: "#contact",
        assign: (path) => navigations.push(path),
      },
    },
    require(name) {
      if (name === "react")
        return {
          useRef(initial) {
            const index = cursor++;
            slots[index] ??= { current: initial };
            return slots[index];
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
    header: () => render().props.children[0],
    autofill() {
      fields = [{ value: "Synthetic" }];
    },
    event(name, inContact = true) {
      render().props[name]({ target: new Element(inContact) });
    },
  };
}

test("untouched locale navigation preserves query and anchor without modifying content", () => {
  const shell = mountShell();
  shell.event("onFocusCapture", false);
  shell.header().props.onLocaleChange("ru");
  assert.deepEqual(shell.navigations, ["/ru?source=test#contact"]);
  assert.equal(shell.render().props.children[1], "unchanged server content");
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
    shell.header().props.onLocaleChange("ru");
    assert.deepEqual(shell.navigations, []);
  });
}

test("autofill without any observed input event still prevents losing the draft", () => {
  const shell = mountShell();
  shell.autofill();
  shell.header().props.onLocaleChange("ru");
  assert.equal(shell.header().props.switchingLocked, true);
  assert.deepEqual(shell.navigations, []);
});
