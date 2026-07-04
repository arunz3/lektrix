## 2025-07-04 - Fix Out-of-Memory / DoS vulnerability in file uploads
**Vulnerability:** Client-side application could be crashed or freeze if users dropped or uploaded hundreds of files because `URL.createObjectURL` was executing for every single item before slicing arrays to the `maxFiles` limit.
**Learning:** `URL.createObjectURL` must be treated carefully since it binds actual memory inside the browser and forces sync work on the main thread for image preprocessing (like previewing). Mass executions lead to Out-of-Memory / DoS.
**Prevention:** Slicing input arrays up to limits (e.g., `maxFiles`) *before* executing mapping operations that utilize potentially expensive API like `URL.createObjectURL` or parsing.
