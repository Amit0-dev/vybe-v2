# Design

<!-- impeccable:design-schema 1 -->

## World

**Stage light.** Late-night room with a single warm spotlight. Warm near-black canvas, coral-amber accent as the only saturated color — like a lamp hitting a speaker stack. Quiet chrome, loud music hierarchy.

## Mode by surface

- `/` — Persuade
- `/spaces`, `/space/[spaceId]` — Operate

## Color

| Role | Token | Value |
|------|-------|-------|
| Canvas | `--background` | `oklch(0.14 0.012 55)` warm black |
| Elevated | `--card` | `oklch(0.18 0.014 55)` |
| Text | `--foreground` | `oklch(0.96 0.01 70)` |
| Muted text | `--muted-foreground` | `oklch(0.68 0.02 60)` |
| Accent / action | `--primary` | `oklch(0.74 0.17 45)` coral-amber |
| Accent soft | `--vybe-muted` | primary at ~14% |
| Border | `--border` | white 9% |

No purple. Accent is rare: CTAs, active votes, now-playing emphasis.

## Typography

- **Display / headings:** Sora (geometric, slightly athletic)
- **Body / UI:** Manrope
- Scale: display → title → body → meta with clear weight steps
- Tracking on display: mild negative (−0.02em)

## Layout

- **Site container:** `max-w-6xl` + horizontal padding — every page shares one column edge
- Landing: stacked sections inside container
- Spaces: same container, card grid
- Space detail: same container, inner `max-w-2xl` for the music column (centered)

## Motion

Subtle only: card hover lift, vote press, now-playing fade. Respect `prefers-reduced-motion`.

## Anti-references

Discarded: generic purple SaaS glow, dashboard chrome, Spotify clone density, neon cyber grids.
