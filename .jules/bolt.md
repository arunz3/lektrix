## 2026-05-31 - Parallelize I/O and pdf-lib Operations
**Learning:** Sequentially awaiting file reading (`arrayBuffer()`) and `pdf-lib` parsing/embedding (`PDFDocument.load()`, `embedJpg()`) inside `for` loops creates an unnecessary performance bottleneck for multi-file tools like Merge and ImageToPDF.
**Action:** Always use `Promise.all()` to parallelize these independent asynchronous operations first, and then sequentially iterate over the resolved results to maintain the necessary order (e.g., adding pages).
