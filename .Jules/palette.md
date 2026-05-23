## 2025-02-23 - Accessibility of icon-only buttons
**Learning:** Found a pattern where multiple functional buttons (modals, file lists, thumbnails) rely entirely on Lucide icons for their visual representation but lack text alternatives for screen reader users, breaking keyboard/screen reader accessibility.
**Action:** Ensure all icon-only buttons receive a descriptive `aria-label` attribute describing their function when implementing new UI components.
