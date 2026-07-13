# Design Brief — Froze Arctic Glaze

## Direction

Arctic Glaze — a luminous icy cryogenic savings surface where money is conceptually frozen, expressed through frosted white glass over a cool arctic sky with cyan rim highlights.

## Tone

Empathetic, calm, premium-frost: Apple Weather x Stripe x a frosted savings vault. Bright and hopeful, never clinical. Cool to the eye, warm to the person who struggles with impulse spending.

## Differentiation

Frosted-glass surfaces that visibly frost deeper as savings grow — ice thickens, condensation appears, cyan glow intensifies. Frozen wealth feels tangible and reassuring on a light, airy canvas.

## Color Palette

| Token            | OKLCH (L C H)        | Role                              |
| ---------------- | -------------------- | --------------------------------- |
| background       | 0.97 0.012 230       | Soft Arctic White #EAF1F8         |
| background-deep  | 0.93 0.018 235       | Deeper Ice #DCE7F2                |
| foreground       | 0.18 0.025 245       | Deep Arctic Ink #0A1626          |
| card             | 0.99 0.006 220 /55%  | Frosted white glass surface       |
| primary          | 0.52 0.2 258         | Deep Glacier Blue #1B4FD6         |
| accent           | 0.6 0.14 210         | Icy Cyan #2E9CCF                  |
| frost            | 0.7 0.14 200         | Frost Glow #5BC8E6               |
| muted-foreground | 0.42 0.025 245       | Cool slate (readable on light)    |
| secondary-fg     | 0.28 0.03 248        | Deep Silver Ice #1A2A45          |
| destructive      | 0.55 0.22 25         | Melt warning (warm)              |
| success          | 0.55 0.15 175        | Frozen teal                       |
| warning          | 0.7 0.16 70          | Condensation amber                |
| border           | 0.78 0.02 240 /38%   | Silver ice edge                   |

## Typography

- Display: Space Grotesk — hero headline, vault names, numerals (tracking -0.02em)
- Body: DM Sans — UI text, labels, empathetic paragraphs
- Mono: JetBrains Mono — ledger numbers, balances, tabular figures (tnum, zero)
- Scale: hero `text-5xl font-display`, h2 `text-3xl font-display`, label `text-xs uppercase tracking-wider`, body `text-base font-body`

## Elevation & Depth

Frosted-white-glass layering over arctic sky. Cards use backdrop-blur + cool inset top highlight + soft cyan rim glow. Shadows are cool (cyan/blue-tinted) not black.

## Structural Zones

| Zone    | Background         | Border                  | Notes                              |
| ------- | ------------------ | ----------------------- | ---------------------------------- |
| Sidebar | 0.93 0.018 235     | silver ice /30% right   | Cool panel, fixed                  |
| Header  | cryo-glass         | silver ice /38% bottom  | Sticky, blurred frost              |
| Content | cryo-vault-bg      | —                       | Luminous arctic ambient at top     |
| Card    | cryo-glass         | silver ice /38%         | Inset frost top, ice-facet corner |
| Modal   | cryo-glass-strong  | frost /55%              | Denser frost, deeper cool shadow   |

## Spacing & Rhythm

8px/16px geometric framework. Section gaps `gap-8`/`gap-12`, card padding `p-6`/`p-8`, micro-spacing `gap-2`/`gap-3`. Waitlist form sits 16px below hero tagline. Fully responsive.

## Component Patterns

- **CryoButton**: primary `bg-primary text-primary-fg cryo-btn-sweep`, hover lifts + cyan glow; ghost variant `cryo-glass` surface
- **CryoCard**: `cryo-glass rounded-2xl cryo-ice-facet`, optional `cryo-condensation` overlay
- **CryoInput**: `cryo-glass-input` frosted white field, focus cyan rim glow
- **CryoModal**: `cryo-glass-strong` backdrop, `animate-crystallize` entrance, `animate-ice-shatter` exit
- **CryoVaultCard**: `cryo-glass` + tier class `cryo-vault-tier-1..4` evolves with balance
- **CryoProgressBar**: gradient `--gradient-primary` fill, frost glow at leading edge
- **CryoNotification**: `cryo-glass` toast, accent left border, `animate-mist-rising` entrance
- **CryoBadgePill**: `cryo-badge-pill` mono uppercase, frosted glass, deep glacier text

## Motion

- Entrance: `fade-in` staggered (delay var), `animate-crystallize` for cards
- Hover: `cryo-edge-glow` intensifies, `cryo-btn-sweep` shine, `subtle-melting` on press
- Decorative: `aurora-glow` ambient band, `snowfall`/`particles-drifting` background, `frozen-glow-pulse` on active vaults
- Vault update: `ice-thickening` transition, `ice-grows-outward` ripple

## Vault Evolution Progression

| Tier | Balance milestone | Visual change                                   |
| ---- | ----------------- | ----------------------------------------------- |
| 1    | < 25%             | Plain frost glass, faint silver border          |
| 2    | 25–50%            | Glacier blue border tint, soft cool glow        |
| 3    | 50–75%            | Frost glow rim, cyan halo, condensation visible |
| 4    | 75–100%           | Full frozen glow, intricate frost, inner light  |

## Constraints

- Light theme (Arctic Glaze) — color-scheme: light
- OKLCH tokens only; no raw hex in components
- Money is conceptual — no real banking UI patterns
- Mobile-first; glass effects must degrade gracefully (fallback solid white bg)
- Max 3 concurrent decorative animations per viewport for performance

## Signature Detail

CryoVaultCard tier evolution on a luminous arctic canvas — frosted glass that physically deepens as savings grow, making frozen wealth feel calm and tangible.
