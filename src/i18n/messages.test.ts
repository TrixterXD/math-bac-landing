import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";
import { advantages } from "../components/AdvantagesSection/advantages.data";
import { countries } from "../components/ContactSection/countries.data";
import { faqItems } from "../components/FAQSection/faq.data";
import { navigationItems } from "../components/Header/Header.data";
import { heroBenefits } from "../components/Hero/Hero.data";
import { teachers } from "../components/TeamSection/team.data";
import { defaultLocale, isLocale, supportedLocales } from "./locales";
import { ro } from "./ro";
import { ru } from "./ru";

function strings(value: unknown, path = ""): Map<string, string> {
  if (typeof value === "string") {
    assert.ok(value.trim(), `Empty translation: ${path}`);
    return new Map([[path, value]]);
  }
  assert.ok(value !== null && typeof value === "object", path);
  const entries = Object.entries(value);
  assert.ok(entries.length > 0, `Empty translation group: ${path}`);
  return new Map(
    entries.flatMap(([key, child]) => [
      ...strings(child, path ? `${path}.${key}` : key),
    ]),
  );
}

function placeholders(value: string) {
  return [...value.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]).sort();
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

test("only exact supported locale strings pass the guard; Romanian is the default", () => {
  assert.deepEqual(supportedLocales, ["ro", "ru"]);
  assert.equal(defaultLocale, "ro");
  for (const locale of supportedLocales) assert.equal(isLocale(locale), true);
  for (const value of [
    undefined,
    null,
    false,
    0,
    "",
    "RO",
    "ru-RU",
    " ro",
    "ru ",
    "en",
    "__proto__",
    "constructor",
    ["ro"],
    { toString: () => "ro" },
  ]) {
    assert.equal(isLocale(value), false);
  }
});

test("dictionary paths match, every leaf is non-empty, and placeholders agree", () => {
  const russian = strings(ru);
  const romanian = strings(ro);
  assert.deepEqual([...romanian.keys()].sort(), [...russian.keys()].sort());
  for (const [path, value] of russian) {
    const translation = romanian.get(path);
    assert.ok(translation);
    assert.deepEqual(placeholders(translation), placeholders(value), path);
  }
  assert.deepEqual(placeholders(ru.contact.feedback.fieldErrors), ["count"]);
  assert.deepEqual(placeholders(ro.contact.feedback.fieldErrors), ["count"]);
});

test("dictionary traversal includes nested arrays with indexed paths", () => {
  assert.deepEqual(
    [...strings({ items: ["First", { content: [["Hello {name}"]] }] })],
    [
      ["items.0", "First"],
      ["items.1.content.0.0", "Hello {name}"],
    ],
  );
});

test("dictionary validation rejects empty or missing translation groups", () => {
  for (const value of [
    "",
    " \n ",
    {},
    { missing: undefined },
    { empty: "" },
    [],
    { items: [[" \n "]] },
    { items: [{ content: [] }] },
    { items: [undefined] },
    { items: [null] },
    { items: [42] },
  ]) {
    assert.throws(() => strings(value));
  }
});

test("Russian validation copy and all existing field-error codes are preserved", () => {
  for (const messages of [ro, ru]) {
    assert.deepEqual(Object.keys(messages.contact.errors).sort(), [
      "comment",
      "country",
      "name",
      "phone",
    ]);
    for (const errors of Object.values(messages.contact.errors)) {
      assert.deepEqual(Object.keys(errors).sort(), [
        "invalid",
        "required",
        "too_long",
      ]);
    }
  }
  assert.match(ro.contact.errors.name.too_long, /\b100\b/);
  assert.match(ro.contact.errors.comment.too_long, /\b1000\b/);
  assert.match(ro.contact.errors.phone.invalid, /\+/);
});

test("existing navigation, FAQ, advantage and teacher IDs/copy stay aligned", () => {
  assert.deepEqual(
    Object.keys(ru.header.navigation),
    navigationItems.map((item) => item.href.slice(1)),
  );
  assert.deepEqual(
    Object.values(ru.header.navigation),
    navigationItems.map((item) => item.label),
  );
  assert.deepEqual(
    Object.entries(ru.advantages.items).map(([id, copy]) => ({ id, ...copy })),
    advantages.map(({ id, title, description }) => ({
      id,
      title,
      description,
    })),
  );
  assert.deepEqual(
    Object.entries(ru.faq.items).map(([id, copy]) => ({ id, ...copy })),
    faqItems,
  );
  assert.deepEqual(
    Object.entries(ru.team.portraits),
    teachers.map(({ id, alt }) => [id, alt]),
  );
  assert.deepEqual(
    Object.keys(ru.hero.benefits),
    heroBenefits.map(({ id }) => id),
  );
});

test("Hero updates the headline and preserves its description and benefits in both locales", () => {
  assert.deepEqual(ru.hero, {
    pill: "Онлайн-школа · Математика · Подготовка к BAC",
    heading: "Индивидуальные занятия",
    headingEmphasis: "по математике",
    description:
      "Уверенные знания. Спокойные родители.\nВысокие результаты на экзамене.",
    benefits: {
      explanation: { text: "Понятное объяснение", detail: " сложных тем" },
      preparation: {
        text: "Системная подготовка",
        detail: " по программе BAC",
      },
      support: {
        text: "Поддержка",
        detail: " и мотивация",
        ending: " на каждом этапе",
      },
    },
    cta: "Оставить заявку",
    portraitAlt: "Настя сидит за столом с тетрадью и ручкой",
  });
  for (const { hero } of [ro, ru]) {
    assert.equal(hero.description.split("\n").length, 2);
    for (const { id } of heroBenefits) assert.ok(hero.benefits[id]);
  }
  assert.equal(ro.hero.heading, "Meditații individuale");
  assert.equal(ro.hero.headingEmphasis, "la matematică");
  assert.equal(ro.hero.cta, "Lasă o solicitare");
});

test("EasyMath branding and Anastasia headings are consistent in both locales", () => {
  for (const messages of [ro, ru]) {
    assert.ok(messages.metadata.title.startsWith("EasyMath — "));
    assert.ok(messages.header.homeLabel.startsWith("EasyMath — "));
  }
  assert.equal(ro.team.heading, "Despre Anastasia");
  assert.equal(ru.team.heading, "Об Анастасии");
});

test("both dictionaries cover exactly the 50 supported countries without owning calling codes", () => {
  const codes = countries.map(({ code }) => code).sort();
  assert.equal(codes.length, 50);
  for (const messages of [ro, ru]) {
    assert.deepEqual(Object.keys(messages.countries).sort(), codes);
    assert.ok(
      Object.values(messages.countries).every(
        (name) => typeof name === "string",
      ),
    );
  }
  assert.deepEqual(
    Object.entries(ru.countries),
    countries.map(({ code, name }) => [code, name]),
  );
});

test("current Russian component text, accessibility labels and runtime messages are extracted verbatim", () => {
  const dictionaryValues = new Set(
    [...strings(ru).values()]
      .flatMap((value) => [value, ...value.split("\n")])
      .map(normalize),
  );
  const components = [
    "Header/Header",
    "Hero/Hero",
    "TeamSection/TeamSection",
    "TeamSection/TeacherCard",
    "TeamSection/NastyaProfile",
    "AdvantagesSection/AdvantagesSection",
    "FAQSection/FAQSection",
    "FAQSection/FAQItem",
    "ContactSection/ContactSection",
    "ContactSection/ContactForm",
    "ContactSection/TurnstileChallenge",
  ];
  const sources = [
    ...components.map((component) => `src/components/${component}.tsx`),
    "src/components/ContactSection/contactErrors.data.ts",
  ];
  for (const path of sources) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node: ts.Node) {
      if (ts.isStringLiteralLike(node) || ts.isJsxText(node)) {
        const value = normalize(node.text);
        if (/[А-Яа-яЁё]/u.test(value)) {
          assert.ok(
            dictionaryValues.has(value),
            `Unextracted copy in ${path}: ${value}`,
          );
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.equal(
    ru.contact.feedback.fieldErrors.replace("{count}", "4"),
    "Проверьте отмеченные поля: 4.",
  );
});
