## 2025-07-05 - File Upload Zone Keyboard Accessibility
**Learning:** When building custom file drag-and-drop zones that wrap an `<input type="file">`, using `display: none` or Tailwind's `hidden` class completely removes the input from the accessibility tree, breaking keyboard navigation.
**Action:** Always use `sr-only` to visually hide the file input while keeping it accessible to screen readers and keyboard users, and use `focus-within` on the parent `<label>` wrapper to ensure clear visual focus indicators.
