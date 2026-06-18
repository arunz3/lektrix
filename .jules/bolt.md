## 2025-06-18 - Prevent Out-of-Memory Errors by Slicing Before URL Creation
**Learning:** Calling `URL.createObjectURL` on many files at once can cause memory bloat or out-of-memory errors on the client. Creating object URLs for files that are ultimately discarded by an array `.slice` operation is a wasted resource allocation and a performance anti-pattern.
**Action:** Always slice the array of files to constraint limits (e.g. `maxFiles`) *before* executing `URL.createObjectURL` or any memory-heavy mapping on the items, especially for file uploads.
