## 2023-10-25 - Parallelize Client-side PDF I/O Tasks
**Learning:** Processing independent asynchronous PDF operations (like `arrayBuffer()`, `embedJpg()`, or `PDFDocument.load()`) sequentially in a loop causes unnecessary bottlenecks in this client-side architecture.
**Action:** Use `Promise.all()` to parallelize these independent I/O and `pdf-lib` parsing tasks before sequentially adding the results to the document to preserve order.
