## 2026-05-31 - Add aria-labels to icon-only buttons
**Learning:** Identified a recurring accessibility issue where interactive UI elements in custom React components consisting only of icons (e.g., modals, file uploads, page rotation controls) lacked screen reader context.
**Action:** Ensure that any future icon-only interactive element implemented in this design system explicitly includes a descriptive `aria-label`.
