## 2024-05-18 - Added `aria-label` and `title` to Icon-only Buttons
**Learning:** Found multiple instances of buttons using only Lucide icons (e.g., `X`, `RotateCcw`, `Moon`/`Sun`) without accessible names or tooltips. This pattern hurts screen reader accessibility and makes the UI less discoverable for users who might not recognize the icon immediately.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes for accessibility and `title` attributes for on-hover visual tooltips.
