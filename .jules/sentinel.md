## 2025-05-14 - Fix client-side DoS memory leak in file uploads
**Vulnerability:** Generating `URL.createObjectURL` for all uploaded files before applying `maxFiles` constraints, causing unrevoked object URLs.
**Learning:** In mass file uploads, creating object URLs before filtering out excess files leads to memory leaks and Out-of-Memory (OOM) errors on the client because the excess object URLs are never saved to state and thus never revoked.
**Prevention:** Always enforce constraint limits (e.g., slicing the array) *before* performing memory-intensive operations like creating object URLs.
