## 2025-05-15 - Secure ID Generation in Frontend File Uploads
**Vulnerability:** Weak, predictable random ID generation using `Math.random().toString(36)` was found in the `FileUpload` component.
**Learning:** This approach uses an insecure random number generator that can produce predictable values, potentially leading to ID collisions and cross-file data exposure or manipulation, especially in systems handling sensitive PDF documents.
**Prevention:** Always use cryptographically secure random number generators for unique identifiers. In frontend contexts, prefer `crypto.randomUUID()` with a fallback to `window.crypto` for robust cross-browser and environment compatibility.
