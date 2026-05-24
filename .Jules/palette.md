## 2025-02-23 - Missing aria-labels on Icon-only buttons
**Learning:** React Lucide icons used inside `<button>` elements without visible text lack accessible names, making them difficult for screen reader users to understand.
**Action:** Always verify that icon-only buttons (such as those for closing modals, rating stars, removing items, or rotation controls) have explicit and descriptive `aria-label` attributes to ensure they are accessible.
