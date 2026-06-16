## 2025-05-16 - Prevent Client-Side DoS via OOM in File Uploads
**Vulnerability:** Object URLs were being generated for all uploaded files before the array was sliced to `maxFiles` limits.
**Learning:** Mapping over an unconstrained array of user-uploaded files and synchronously invoking `URL.createObjectURL()` leaks memory (object URLs for discarded files are never revoked) and can cause the browser tab to crash (Out-Of-Memory/DoS) if a user drops thousands of files.
**Prevention:** Always slice arrays of file inputs to their constraint limits *before* processing them and explicitly generating expensive references like object URLs.
