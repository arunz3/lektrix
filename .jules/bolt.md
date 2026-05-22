## 2024-05-22 - Parallelizing PDF-lib File Operations
**Learning:** Client-side PDF tasks (like merging files or embedding images) can experience performance bottlenecks due to sequential asynchronous I/O and `pdf-lib` processing in loops.
**Action:** Use `Promise.all()` to parallelize independent asynchronous file reads (e.g., `arrayBuffer()`), parsing (`PDFDocument.load()`), and embedding (`embedJpg()`), then process the results sequentially to preserve order.
