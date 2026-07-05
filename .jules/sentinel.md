## 2025-07-05 - Mitigate OOM/DoS during Mass File Uploads
**Vulnerability:** Unbounded `URL.createObjectURL` allocation during mass file uploads.
**Learning:** `URL.createObjectURL` is synchronous and unbounded file object allocation can cause client-side DoS or Out-of-Memory (OOM) before any validation happens.
**Prevention:** Enforce array slicing constraints on incoming file arrays *before* iterating over them and allocating object URLs.
