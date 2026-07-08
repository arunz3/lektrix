## 2024-07-08 - Accessible Custom File Dropzones
**Learning:** Using hidden on an <input type="file"> inside a custom drag-and-drop <label> removes it from the accessibility tree, preventing keyboard navigation.
**Action:** Use className="sr-only" on the input and add focus-within styles to the parent <label> to ensure visible keyboard focus.
