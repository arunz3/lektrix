## 2025-05-18 - Prevent OOM on mass file drop by early slicing
**Learning:** Mapping over large file arrays (e.g. from drag-and-drop) to generate `URL.createObjectURL` *before* slicing them to `maxFiles` limits causes massive memory leaks, client-side DoS, and out-of-memory (OOM) errors because object URLs for thousands of files are generated even if only a few are actually retained by the app state.
**Action:** Always slice file arrays to constraint limits (e.g., `maxFiles`) *before* executing `URL.createObjectURL` or any heavy processing on the items.
