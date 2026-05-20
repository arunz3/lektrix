## 2024-05-20 - Sequential I/O Bottlenecks in Client-Side PDF Operations
**Learning:** The codebase heavily uses `pdf-lib` for client-side operations. Using sequential `await` in loops for operations like embedding multiple images or loading PDF files creates significant I/O bottlenecks.
**Action:** Always parallelize independent asynchronous `pdf-lib` and I/O file operations (like `arrayBuffer()` and `embedJpg()`) using `Promise.all()` before applying the results sequentially to preserve the necessary order.
