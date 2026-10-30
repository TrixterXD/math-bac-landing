# TASK-005C — Desktop responsive audit

## Scope and method

- Audit only: Header and Hero; no application code or assets changed.
- Source: current `feature/hero-section` working tree, including the mobile Hero changes in `Hero.tsx` and `Hero.module.css`. These were uncommitted when the audit began; the final repository check showed them committed as `7915978` (`feat: add responsive mobile hero layout`). The agent did not create that commit.
- Reference inspected: `design/reference/hero/desktop.png`. This reference includes later sections; those are not part of this audit or approval to implement them.
- Fresh production build: `npm run build` **passed**. Served locally at `http://localhost:3109`.
- All seven requested viewport sizes were actually rendered and visually inspected in managed headless Chrome at device scale factor 1. Screenshots and DOM measurements were used together. Screenshots are viewport captures, not stitched full-page captures.
- The 1024px view was inspected both at the top and after scrolling to the portrait. Other viewports show the complete Hero without scrolling.
- No code fixes, commits, pushes, or merges performed. Lint and standalone typecheck were not rerun for this diagnostic task; the production build included TypeScript checking.

## Summary

No document-level horizontal overflow, clipped live text, or clearly obscured headline/benefit/CTA was observed at the tested sizes. Header navigation remains on one row throughout. Face, both hands, and pen are visible in the Hero, although the portrait is almost entirely below the first screen at 1024 × 768.

The main responsive defects are **the note being cut off at 1280px**, lesser decorative clipping at 1366px, and a substantial laptop composition change at 1024px. Large-screen whitespace is partly expected from the 1200px content cap and partly due to the page having no subsequent sections yet; it is not evidence of a giant Hero bottom padding.

## Viewport-by-viewport results

| Viewport | Observed rendering | Overflow / text | Portrait and decoration | Header |
|---|---|---|---|---|
| **1024 × 768** | Stacked Hero, approximately **1327px** tall, under a 76px Header. Wide benefit cards and full-width CTA dominate the first screen. Portrait only begins at the bottom of that screen. | No horizontal overflow: document client/scroll width 1009px, with a vertical scrollbar. Headline is two lines; no clipped text. | After scrolling, face, supporting hand, writing hand and pen are visible. Bottom notebook is trimmed by the wave. Note/pyramid hidden. | Six links and CTA fit, with tighter outer spacing. Header stayed at `top: 0` during real page scrolling. |
| **1280 × 800** | Two-column desktop Hero, approximately **629px** tall. Pill, two-line headline, description, three compact benefits, CTA and disclaimer fit. | No horizontal overflow: scroll width 1280px. No live-text clipping or portrait covering copy observed. | Face, hands and pen visible; notebook lower edge trimmed. **Right-hand note is visibly cut through its text at the viewport edge.** | Single row, no collisions. Spacious brand-to-navigation gap persists. |
| **1366 × 768** | Same desktop hierarchy and 629px Hero; content fits above approximately y=705px. | No horizontal overflow: scroll width 1366px. Two headline lines; benefits wrap compactly, without clipping. | Face, hands and pen visible. Note image extends to **x=1395**, 29px beyond the viewport; rightmost decorative edge/marks are clipped. Most handwriting remains readable. | One row, no navigation/CTA collisions. |
| **1440 × 900** | Baseline desktop composition, 629px Hero, ending at approximately y=705px including Header. | No overflow: scroll width 1440px. Clear navy/coral hierarchy; no new wrapping defect. | Face, hands and pen visible. Note fits, ending at x=1432, only 8px from the viewport edge. Wave trims the lower notebook. | One row; keyboard Tab reached brand then first navigation link, with visible 3px navy focus outline. |
| **1536 × 864** | Same content scale and Hero height as 1440px, centered with larger gutters. | No overflow: scroll width 1536px; no clipped live text. | Portrait remains prominent. Note fits. Full rounded right edge of the larger pastel blob becomes visible. No obstructive overlap seen. | Links fit; peach background decoration shifts farther right relative to the CTA. |
| **1920 × 1080** | Content remains capped at 1200px, rather than scaling up. Hero still ends around y=705px, leaving approximately 375px of empty page below. | No overflow: scroll width 1920px. Readable, unchanged wrapping. | Hands/pen remain visible; no new cropping. Left peach edge decoration is far from the centered content. | Navigation fits. Header's peach decoration is shifted right of the main composition and extends well beyond the CTA. |
| **2560 × 1440** | Centered 1200px content occupies under half the viewport width; approximately 680px nominal side gutters. Hero remains 629px tall; roughly **735px** of empty page follows it. | No overflow: scroll width 2560px. No live-text clipping. | Face/hands/pen visible at the same CSS scale. Peripheral decorations feel detached from the central composition. | Links fit, but the peach Header shape is visibly separated to the right of the CTA rather than sitting behind it. |

## Observed issues, ranked by severity

Severity here distinguishes broken functionality from composition/polish. No critical rendering failure was found.

### 1. Medium — Note handwriting is cut off on smaller desktop widths

- **Affected:** clearly at 1280 × 800; decorative edge clipping also at 1366 × 768.
- **Evidence:** screenshots S2 and S3. At 1366px the note's box ends at x=1395. At 1440px it fits with only 8px spare.
- **Likely cause:** `Hero.module.css` `.note { right: -7rem; width: 17.5rem; }` extends outside the centered `.inner`; `.hero { overflow: clip; }` hides the excess rather than causing document scrolling.
- **Suggested fix:** add an intermediate desktop placement/size rule, or constrain the note to a viewport-safe inset. Preserve the approved 1440px placement where practical. Do not merely remove clipping, which could introduce scrolling.

### 2. Medium — 1024px laptop layout loses the side-by-side desktop composition

- **Affected:** 1024 × 768.
- **Evidence:** S1 and S1b. Hero is about 1327px tall versus 629px at the larger tested widths. Almost the entire portrait is below the initial viewport, despite a wide laptop screen.
- **Likely cause:** `@media (width < 80rem)` applies the full mobile-style stack, `.inner { max-width: 42rem; }`, vertical benefits and a normal-flow 536px-wide portrait to every width below 1280px. Header still uses desktop navigation at 1024px.
- **Suggested fix:** consider an intermediate laptop layout with scaled typography/portrait and compact benefits, rather than either a dense desktop arrangement or the full narrow-screen stack. Retain the safe mobile rules. Review the design intent before changing the breakpoint; lowering it alone could create overlaps.
- **Qualification:** this is an observed departure from desktop composition, not clipped or inaccessible content. The CTA remains visible before the portrait.

### 3. Low — Large-screen peripheral decorations detach from the content

- **Affected:** most apparent at 1920px and 2560px.
- **Evidence:** S6 and S7. Header peach shape moves away from the CTA; Hero's left peach decoration remains at the viewport edge while copy stays centered.
- **Likely cause:** Header `.header::before { right: 5%; }` tracks viewport width, while `.inner` is capped at 75rem. Hero `.hero::before { left: -9rem; }` is also viewport-relative rather than content-relative.
- **Suggested fix:** anchor those decorative positions to the centered content container or constrain their offset at wide widths. Keep the main content width cap unless a separate wide-screen design is approved.

### 4. Low / contextual — Large empty lower screen on wide, tall monitors

- **Affected:** 1920 × 1080 and especially 2560 × 1440.
- **Evidence:** S6 and S7. Current page ends after the Hero, at about y=705px.
- **Likely cause:** the Hero and its contents retain their intentional fixed desktop scale, and later landing sections do not exist yet. Blank canvas below the Hero is not inside `.inner` padding.
- **Suggested fix:** reassess after the next real section is integrated. Do not stretch the portrait/Hero to fill every screen merely to conceal absent page content. Decide separately whether 2560px should retain a compact 1200px composition.

### 5. Known integration limitation — Navigation targets are absent

- **Affected:** all sizes.
- **Evidence:** DOM check at 1440px found no elements for `#about`, `#advantages`, `#programs`, `#reviews`, `#faq`, or `#contact`.
- **Cause:** destination sections are not implemented; not a responsive regression.
- **Suggested fix:** verify anchor scrolling and sticky clearance as real sections arrive. Resolve Reviews scope before declaring navigation complete; do not fabricate destinations or testimonials.

## Comparison with the approved 1440px direction

The current 1440px view retains the established large two-line heading, left copy/benefits/CTA and right portrait composition. No new overlap of headline, portrait or note was observed. Lower notebook cropping appears deliberate and does not remove Nastya's hands or the visible pen tip.

Differences from `desktop.png` remain: no mug/books/video control, simpler iconography and pastel shapes, a visible prototype disclaimer, and a different portrait crop/desk boundary. These are existing scope/design choices, not newly discovered responsive regressions. The reference includes Team and Advantages; their absence explains much of the empty lower screen in this partial implementation.

## Code-level risks — not reproduced defects

1. **Limited safe desktop placement range:** fixed 49rem heading width, a 58%/42% grid and absolute portrait offsets depend on the current copy and font metrics. At tested desktop sizes the visible text and portrait do not collide; browser zoom, translated/longer text and custom font-size preferences were not tested.
2. **Abrupt breakpoint:** the complete layout changes at 1280 CSS px. Only the requested sizes were rendered; an interactive continuous resize and widths immediately below/above the breakpoint were not audited. The 1024/1280 screenshots demonstrate the different states, not the exact transition experience.
3. **Clipping can mask overflow:** document width alone is insufficient because `.hero` uses `overflow: clip`. Screenshots reveal note loss despite a clean overflow measurement.
4. **Sticky offset is manually coupled:** global `scroll-padding-top: 5.75rem` currently exceeds the measured 76px Header height. Future wrapping, font scaling or Header changes could invalidate it. Actual target clearance cannot be tested until targets exist.

## Screenshot index

Files are local browser artifacts, **not committed repository assets**. Base directory:

`C:\Users\Admin\.pi\browser-artifacts\`

| ID | Viewport / state | Filename |
|---|---|---|
| S1 | 1024 × 768, top | `page-1793314916337.png` |
| S1b | 1024 × 768, scrolled to portrait | `page-1793314948798.png` |
| S2 | 1280 × 800 | `page-1793315031704.png` |
| S3 | 1366 × 768 | `page-1793315077060.png` |
| S4 | 1440 × 900 | `page-1793315126104.png` |
| S5 | 1536 × 864 | `page-1793315168482.png` |
| S6 | 1920 × 1080 | `page-1793315211816.png` |
| S7 | 2560 × 1440 | `page-1793315262213.png` |

## Limits and next review

No source-code fixes implemented. Suggested first follow-up: review the 1280px note constraint and an intermediate laptop composition, then reconsider wide-screen decoration alignment. Existing Hero work was left intact; the final status showed only this new report directory as untracked.

Not checked: physical hardware, alternate browsers/DPRs, zoom/font scaling, continuous resizing, full keyboard traversal, or screen readers. Screenshot paths depend on this local machine; copy artifacts separately if the report must be shared.
