## 2024-05-24 - Parallelize PDF-lib independent operations
**Learning:** For tasks involving multiple independent files (like merging PDFs or converting images to a PDF), sequential `await` calls in a `for` loop create a significant performance bottleneck.
**Action:** Parallelize independent asynchronous I/O and `pdf-lib` parsing/embedding operations using `Promise.all()`. After the parallel phase is complete, process the results sequentially to maintain the correct document page order.
