## 2024-05-15 - Chunked Parallel PDF Compression
**Learning:** Parallelizing PDF operations with Promise.all() speeds up operations, but parallelizing all pages at once can cause Out-Of-Memory (OOM) errors on large documents during Canvas rendering.
**Action:** Use chunked Promise.all() (e.g., batches of 3-5 pages) for expensive operations to balance performance and memory usage, then process sequentially to preserve page order.
