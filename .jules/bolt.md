## 2026-10-23 - Chunked Concurrency for Canvas
**Learning:** Naively parallelizing all page renders on large PDFs causes Out-of-Memory (OOM) browser crashes due to excessive canvas memory allocation.
**Action:** Use a limited concurrency approach (chunking batches of 3-5 pages) with Promise.all() before sequentially processing results to balance performance and memory limits.
