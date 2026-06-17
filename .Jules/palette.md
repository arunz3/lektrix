## 2024-05-14 - Buttons with partially hidden text need aria-labels on mobile
**Learning:** When using Tailwind's conditionally hidden text classes (like `hidden sm:inline`) inside buttons, the text is hidden visually and potentially from the accessibility tree on mobile sizes, making it an icon-only button without an accessible name.
**Action:** Always add an `aria-label` to the parent `<button>` or `<a>` to ensure accessibility for screen readers on mobile devices when text might be hidden.
