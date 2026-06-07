## 2024-03-01 - Parallelize PDF Operations
**Learning:** Sequential async operations (like arrayBuffer(), embedJpg()) in PDF processing loops can be a performance bottleneck. Parallelizing them using Promise.all() before adding pages sequentially can speed up execution significantly.
**Action:** Always check if independent async I/O or PDF-lib operations can be mapped into a Promise.all() array before sequentially mutating the PDFDocument instance.
