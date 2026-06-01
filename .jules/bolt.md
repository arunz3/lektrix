## 2024-05-18 - Parallelizing pdf-lib Client-Side Processing
**Learning:** Sequential await loops for `arrayBuffer()`, `PDFDocument.load()`, or embedding images (`embedJpg()`) become a massive bottleneck for multiple files.
**Action:** Always parallelize independent I/O and loading tasks using `Promise.all()`, then sequentially modify the target PDFDocument with the ordered results to ensure deterministic page order and correct generation.
