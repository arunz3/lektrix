## 2025-02-18 - FileUpload Dropzone Keyboard Accessibility
**Learning:** Using `className="hidden"` on file inputs completely removes them from the accessibility tree, making them un-focusable via keyboard navigation. Additionally, when using a custom `<label>` wrapper as a dropzone area, the visual focus indicator is lost if not explicitly added.
**Action:** Always use `sr-only` instead of `hidden` for interactive inputs inside custom UI wrappers, and apply `focus-within:ring-2 focus-within:outline-none focus-within:ring-accent` to the parent container to restore clear keyboard focus visibility.

## 2025-02-18 - Conditionally Hidden Button Text
**Learning:** Buttons with conditionally hidden text (e.g. `hidden sm:inline`) become completely inaccessible to screen readers on smaller viewport sizes where the text is hidden and only the icon is visible.
**Action:** Whenever using `hidden sm:inline` or similar responsive text-hiding techniques inside an interactive element, always provide a fallback `aria-label` on the parent container.
