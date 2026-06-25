## 2024-06-25 - Parallelizing PDF Processing Safely
**Learning:** Naively parallelizing `pdf-lib` and canvas operations on all pages at once causes Out-Of-Memory (OOM) errors on large documents. Sequential processing is too slow.
**Action:** When parallelizing client-side PDF tasks, process pages in smaller chunks (e.g., batches of 3-5) using `Promise.all()` to balance speed and memory, then stitch the results sequentially to preserve order.
