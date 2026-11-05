# WalkWise Design System

Tokens and React components for the WalkWise app. Built from the
[WalkWise Brand Identity](https://www.figma.com/design/jvIi4z8aaGua1SQju1xSUu/WalkWise-Brand-Identity)
guide and the mobile screens in
[WalkWise Website and App](https://www.figma.com/design/NhfLvtixY1TVa5LXB1HPz9/WalkWise-Website-and-App).

The browsable reference is a separate, self-contained file:
`design-system/WalkWise-Design-System.html`. It isn't linked to this code, so
changes here won't show up there automatically.

## Files

| File | What's in it |
| --- | --- |
| `tokens.css` | All CSS custom properties (`--ww-*`): brand colors, scales, semantic roles, type, spacing, radius, shadow, motion, z-index |
| `base.css` | Reset, focus ring, typography role classes (`.ww-text-display` … `.ww-text-caption`) |
| `components.css` | Styles for every component (`.ww-*` classes) |
| `components/` | `Logo`, `Button`, `IconButton`, `Card`, `SearchField`, `TabBar`, `BottomSheet`, `OptionTile`/`OptionGrid`, `Toast`, `SafetyBadge`, `Footpath` |
| `index.ts` | Imports the CSS and re-exports all components |

## Usage

```tsx
import { Button, Card, SafetyBadge } from './design-system'

<Card tone="surface" elevation="sm">
  <span className="ww-text-heading">Safest route</span>
  <SafetyBadge level="safe" />
  <Button variant="primary">Start walking</Button>
</Card>
```

## Rules

- Use **semantic tokens** (`--ww-color-brand`, `--ww-color-accent`, …) in components, not raw hex.
- **Light Red is for safety**: the mascot, alerts, report and SOS actions. Navy is the default call to action.
- White on red is ~3.5:1, so only use it for large text (≥19px bold or ≥24px) and icons.
- Pair status colors with an icon or label; never rely on color alone.
- Logo: white on navy, color on white. Never recolor or re-type it (Candara is logotype-only).
- Values marked *extension* in `tokens.css` aren't in the brand guide. Confirm them with the brand owner before using them in print.
