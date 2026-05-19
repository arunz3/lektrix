## 2025-02-28 - Parallelizing PDF-Lib Operations
**Learning:** `pdf-lib` parsing operations (like `PDFDocument.load()`) and I/O tasks (`arrayBuffer()`) can be expensive when run sequentially in a loop.
**Action:** Use `Promise.all()` to parallelize these independent operations for multiple files/pages *before* processing the results. Then, iterate sequentially over the resolved promises to preserve document order when adding pages.
