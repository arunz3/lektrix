## 2025-05-18 - FileUpload Drag and Drop Accessibility
**Learning:** Using `className="hidden"` on file inputs inside drag-and-drop zones removes them from the accessibility tree, making keyboard navigation difficult.
**Action:** Use `className="sr-only"` on the input to keep it screen-reader accessible and add `focus-within` styles to the parent `<label>` to ensure visible focus during keyboard navigation.
