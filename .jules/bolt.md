## 2024-05-25 - Parallelizing File I/O in PDF operations
**Learning:** Client-side PDF tasks that process multiple files (like Merge or Image-to-PDF) suffer from unnecessary sequential blocking when loading files via `arrayBuffer()` and parsing them via `pdf-lib`.
**Action:** Use `Promise.all()` to parallelize independent file reading and decoding operations, then sequentially process the results (like adding pages to a single document) to preserve order and significantly reduce total processing time.
