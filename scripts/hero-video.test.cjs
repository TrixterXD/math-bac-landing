const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

// Exercise component handlers like the existing form tests; native browser behavior needs manual QA.
function mountVideo(messages) {
  const slots = [];
  let cursor = 0;
  let focused = "";
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(
      readFileSync("src/components/Hero/HeroVideo.tsx", "utf8"),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    ).outputText,
    {
      module,
      exports: module.exports,
      require(name) {
        if (name === "react")
          return {
            useId: () => "video-title",
            useRef(initial) {
              const index = cursor++;
              slots[index] ??= { current: initial };
              return slots[index];
            },
            useState(initial) {
              const index = cursor++;
              if (!(index in slots)) slots[index] = initial;
              return [slots[index], (value) => (slots[index] = value)];
            },
          };
        if (name.endsWith(".css")) return { default: {} };
        return require(name);
      },
    },
  );
  function render() {
    cursor = 0;
    return module.exports.default({ messages });
  }
  function find(predicate, node = render()) {
    if (!node || typeof node !== "object") return;
    if (predicate(node)) return node;
    for (const child of [node.props?.children].flat(Infinity)) {
      const found = find(predicate, child ?? null);
      if (found) return found;
    }
  }
  const trigger = {
    focus: () => {
      focused = "trigger";
    },
  };
  const dialog = {
    open: false,
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      find((node) => node.type === "dialog").props.onClose();
    },
    getBoundingClientRect: () => ({
      left: 20,
      top: 20,
      right: 300,
      bottom: 500,
    }),
  };
  find((node) => node.type === "dialog").props.ref.current = dialog;
  find((node) => node.props["aria-haspopup"] === "dialog").props.ref.current =
    trigger;
  return {
    find,
    dialog,
    focused: () => focused,
    play() {
      find((node) => node.props["aria-haspopup"] === "dialog").props.onClick({
        currentTarget: trigger,
      });
    },
    backdrop(start, end = start) {
      const handlers = find((node) => node.type === "dialog").props;
      handlers.onPointerDown({ currentTarget: dialog, ...start });
      handlers.onPointerUp({ currentTarget: dialog, ...end });
    },
  };
}

for (const locale of ["ro", "ru"]) {
  const messages = require(`../src/i18n/${locale}.ts`)[locale].hero.video;
  test(`${locale}: no iframe before Play; close removes it and reopening works`, () => {
    assert.ok(messages, "video labels must exist");
    const video = mountVideo(messages);
    assert.equal(
      video.find((node) => node.type === "iframe"),
      undefined,
    );
    video.play();
    assert.equal(video.dialog.open, true);
    const frame = video.find((node) => node.type === "iframe");
    assert.equal(
      frame.props.src,
      "https://www.tiktok.com/player/v1/7690978841367416085",
    );
    assert.equal(frame.props.title, messages.iframeTitle);
    assert.equal(frame.props.referrerPolicy, "no-referrer");
    video
      .find(
        (node) =>
          node.type === "button" && node.props["aria-label"] === messages.close,
      )
      .props.onClick();
    assert.equal(video.dialog.open, false);
    assert.equal(
      video.find((node) => node.type === "iframe"),
      undefined,
    );
    assert.equal(video.focused(), "trigger");
    video.play();
    assert.ok(video.find((node) => node.type === "iframe"));
    const dialog = video.find((node) => node.type === "dialog");
    assert.equal(
      dialog.props.onCancel,
      undefined,
      "keep native Escape behavior",
    );
    video.dialog.close(); // Simulate the native close event after Escape.
    assert.equal(
      video.find((node) => node.type === "iframe"),
      undefined,
    );
    assert.equal(video.focused(), "trigger");
  });

  test(`${locale}: only a pointer interaction entirely outside dismisses`, () => {
    const video = mountVideo(messages);
    video.play();
    video.backdrop({ clientX: 40, clientY: 40 });
    assert.equal(video.dialog.open, true, "dialog padding is not backdrop");
    video.backdrop({ clientX: 40, clientY: 40 }, { clientX: 5, clientY: 5 });
    assert.equal(video.dialog.open, true, "dragging out must not dismiss");
    video.backdrop({ clientX: 5, clientY: 5 }, { clientX: 40, clientY: 40 });
    assert.equal(video.dialog.open, true, "dragging in must not dismiss");
    video.backdrop({ clientX: 5, clientY: 5 });
    assert.equal(video.dialog.open, false);
    assert.equal(
      video.find((node) => node.type === "iframe"),
      undefined,
    );
    assert.equal(video.focused(), "trigger");
  });
}
