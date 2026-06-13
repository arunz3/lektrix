## 2024-05-24 - File Upload Out-of-Memory (OOM) DoS
**Vulnerability:** Client-side Out-of-Memory (OOM) Denial of Service (DoS) during mass file uploads. The application generated Object URLs for every uploaded file before enforcing the `maxFiles` limit, leading to memory exhaustion when hundreds of files were uploaded simultaneously.
**Learning:** Resource-intensive operations (like `URL.createObjectURL`) must be deferred until after input limits and constraints are applied to avoid processing data that will ultimately be discarded. Discarded files left un-revoked object URLs in memory.
**Prevention:** Always slice arrays or enforce limits *before* executing expensive operations or allocating memory (like creating blobs or object URLs).
