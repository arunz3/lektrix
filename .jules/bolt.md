## 2024-06-02 - Parallelized PDF File I/O and Parsing
**Learning:** Sequential file processing (like `arrayBuffer()` and PDF parsing) inside a `for...of` loop can block execution in client-side PDF tasks, leading to slower performance when handling multiple files.
**Action:** When performing independent file operations before creating a PDF, use `Promise.all` to execute the reads and parsing in parallel. Only apply sequential loops when the order of appending pages is strictly necessary to preserve structure.
