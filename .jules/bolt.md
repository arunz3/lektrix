## 2026-06-04 - Parallelizing I/O in PDF processing
**Learning:** For client-side PDF tasks (like splitting pages or embedding multiple images), sequential iteration via `for...of` loops over asynchronous `pdf-lib` and I/O file operations (e.g., `arrayBuffer()`, `embedJpg()`) is a significant bottleneck.
**Action:** Use `Promise.all()` to parallelize these independent asynchronous operations *before* sequentially processing the results to preserve order. This maximizes client-side performance without sacrificing correctness.
