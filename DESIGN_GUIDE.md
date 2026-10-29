# Design Guide — Math BAC Landing Page

> Version: **0.1** · 2026-10-29 · Status: **visual reference approved; tokens are provisional**
> Reference: `design/reference/landing-desktop.png` (941 × 1672 px). Source is an AI-generated **static concept**, not an annotated Figma design or a responsive specification.

## 1. Design objective

Recreate **Design Concept A — Warm & Playful** as faithfully as practical. Preserve hierarchy, warm cream surfaces, coral primary accents, lilac secondary accents, dark navy typography, rounded cards, teacher-led hero, playful handwritten/math annotations and spacious section layout.

**Priority:** fidelity at a specified desktop viewport → visual consistency → deliberate responsive adaptation. Do not achieve screenshot similarity at the cost of semantic HTML, accessibility, working controls, or understandable CSS.

**Image ≠ verified content.** The generated portrait does not represent Nastya. Team photos, school claims, prices, videos, testimonials, program details, social links and outcomes visible or implied in the artwork are **not approved business facts**. Use approved or explicitly marked placeholder content, according to `PRODUCT_SPEC.md`.

## 2. Provisional visual tokens

The following values are **initial approximations by visual inspection**. They are *not* exact sampled design specifications. Adjust based on browser screenshots against the reference, rather than treating every number as immutable.

| Role | Initial suggestion | Notes |
|---|---|---|
| Background / warm canvas | `#FFF9F4` | Light warm cream |
| Surface / cards | `#FFFFFF` | Clean white |
| Main text | `#111A32` | Deep navy, not pure black |
| Secondary text | `#42475A` | Supporting copy |
| Primary coral | `#F45C62` | CTA, emphasized headings |
| Coral pale surface | `#FFE4DE` | Program card, highlights |
| Secondary lilac | `#8A71EE` | Alternate CTA/decoration |
| Lilac pale surface | `#E9E3FF` | Secondary card |
| Mint accent | `#C9F3DF` | Small badges/icons |
| Border | `#E9E5E5` | Soft separators/input borders |

**Suggested CSS variables:** `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-primary-soft`, `--color-secondary`, `--color-secondary-soft`, `--color-mint`, `--color-border`.

## 3. Typography

- Large, heavy geometric/modern sans-serif headings; smaller, legible sans-serif body text. Choose a real available or licensed web font after checking the project's current font policy; **do not install fonts or add third-party network requests without approval**.
- Heading feel: bold (approximately 700–800), tight but legible line-height. Key phrase can be coral.
- Body: approximately 16–18 CSS px on desktop and 15–16 CSS px on mobile, with readable line-height.
- Decorative handwritten captions are **optional visual assets**, not a substitute for meaningful content, and should remain subordinate to primary headings.
- Avoid copying garbled/generated image text or inventing copy from the mockup.

## 4. Layout and rhythm

- Desktop: central max-width content region approximately 1120–1200 CSS px; comfortable horizontal gutters. **The 941px reference image is a downscaled composition and is not a literal CSS viewport measurement.**
- Section order remains: Hero → Nastya & Team → Advantages → Programs → FAQ → Contact. Header and Footer are shared in `RootLayout` (A-018).
- Hero: two-column structure, strong left-aligned message and CTA, dominant teacher portrait on the right.
- Teams/advantages: varied compositions, not repetitive identical grids everywhere.
- Programs: two visually distinct cards (coral wash and lilac wash).
- FAQ: simple accordion treatment; native semantic `details` remains a valid first option.
- Contact: friendly headline next to a short, accessible form.
- Start with a restrained spacing scale such as `4, 8, 12, 16, 24, 32, 48, 64, 80` CSS px; refine during visual comparison.
- Card radii: approximately 16–24px; button radii: rounded/pill; soft shadows, not strong floating effects.

## 5. Components and details

- **Header:** compact brand placeholder, anchor navigation, coral primary CTA. Sticky behavior **not yet agreed**; do not implement it solely because of the mockup.
- **Buttons:** dominant coral background with accessible contrast, generous target size, visible keyboard focus. Lilac may be used only for secondary emphasis.
- **Cards:** rounded edges, quiet shadow, soft pastel fill. Avoid packing in unverifiable information just to match the image.
- **Decorations:** math doodles, arrows, rounded color blobs and handwritten notes. Prefer simple CSS/SVG assets with clear positioning; decorative elements should not intercept clicks, obscure text or create horizontal overflow.
- **Portrait:** generated figure is composition reference only; real Nastya portrait requires an approved file. Use a visibly marked placeholder until provided.
- **Navigation:** use real in-page anchor IDs. Never create functional-looking links or buttons without destinations.

## 6. Responsive strategy (new design work, not present in source image)

The provided concept only depicts a tall desktop-style layout. Mobile, tablet and small-desktop layouts **must be designed and reviewed separately**; do not claim pixel-perfect fidelity at unspecified viewports.

- Prefer responsive grid/flex layouts over fixed absolute coordinates for core content.
- On narrow screens: stack hero copy and portrait; preserve immediate headline/CTA visibility; stack program cards; keep form fields usable and labels accessible.
- Choose actual breakpoints only when the content requires a layout change; avoid hardcoding arbitrary media queries before testing.
- Check 360–390px mobile, ~768px tablet and an agreed desktop width (suggest 1440px) as starting review widths.
- Honor reduced-motion preference if adding motion later.

## 7. Image-to-code review workflow

1. Agree on **one small scoped task** and allowed files (starting with the design foundation, then Header).
2. Implement semantic and responsive structure with CSS Modules, applying the token system sparingly.
3. Take a screenshot of the page at the agreed desktop viewport; compare visually with `design/reference/landing-desktop.png`.
4. Record **observable differences**: position, text wrap, spacing, color, size, assets and decoration.
5. Fix the largest fidelity gaps before micro-tuning; compare mobile separately.
6. Run Biome, typecheck, build and relevant manual interactions; developer reviews the diff before commit.

No image-to-code agent should treat the artwork as source of truth for business facts, functional behavior, prices, team identities or privacy statements.

## 8. Open design decisions

- Actual logo/brand and final language/copy.
- Real portrait/team media and rights/approval.
- Final font choice and font-loading strategy.
- Whether Header is static or sticky, and mobile-menu design.
- Exact responsive mockup(s) and breakpoint selection.
- Decorative illustration assets and SVG style.
- Final palette/contrast verified in browser; token values are candidates pending visual iteration.

## 9. Relationship to project documents

- `PRODUCT_SPEC.md` controls **what** the product does and what copy is approved.
- `DECISIONS.md` records architecture/product commitments.
- `CODE_STYLE_GUIDE.md` controls code organization and coding conventions.
- `AGENTS.md` controls AI scope and acceptance gate.
- `IMPLEMENTATION_PLAN.md` controls task order; a scoped design-foundation task should be added before implementation of the visual Header.
- This file controls **visual direction**, subject to accessibility and the documents above.
