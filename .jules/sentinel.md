## 2025-02-14 - Mass file upload DoS via URL.createObjectURL
**Vulnerability:** Unbounded Object URL generation in file upload components causes browser Out-Of-Memory (OOM) crashes.
**Learning:** `URL.createObjectURL` uses significant memory. If users drop thousands of files into a dropzone that limits the eventual display to `maxFiles`, generating preview URLs for *all* files before slicing array causes catastrophic resource exhaustion on the client-side.
**Prevention:** Arrays must be sliced to constraint limits (e.g., `maxFiles`) *before* mapping to generate object URLs, properly using variables bounds handling.
