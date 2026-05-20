## 2024-05-18 - Missing ARIA labels on icon-only buttons
**Learning:** Icon-only buttons (using Lucide React icons for removing files, rating stars, closing modals) often lack explicit `aria-label` attributes in this app, reducing screen reader accessibility.
**Action:** Always verify icon-only buttons have an `aria-label` attribute when creating or modifying them.
