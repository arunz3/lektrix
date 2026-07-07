## 2024-05-18 - Hidden text breaks a11y on mobile
**Learning:** When using Tailwind utility classes like hidden sm:inline to hide text on mobile devices, parent interactive elements like buttons become icon-only, violating accessibility standards by losing their accessible name.
**Action:** Always add an aria-label to buttons with conditionally hidden text to ensure they remain screen-reader accessible on all device sizes.
