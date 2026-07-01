## 2025-02-23 - Limited Concurrency for Client-Side PDF Processing
**Learning:** Naive Promise.all() across all pages for canvas rendering and embedJpg() causes Out-of-Memory (OOM) errors on large PDFs. Sequential processing is too slow.
**Action:** Always use a limited concurrency approach (chunking batches of 3-5 pages) before sequentially appending results to preserve order.
