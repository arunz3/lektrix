## 2026-06-21 - Parallelizing Canvas Rendering with Limited Concurrency
**Learning:** For client-side PDF tasks, parallel canvas rendering (e.g., using `Promise.all` for multiple pages) can lead to Out-of-Memory (OOM) errors on large PDFs if unconstrained.
**Action:** When optimizing client-side PDF tasks, use a limited concurrency approach (e.g., chunking batches of 3-5 pages) before sequentially processing the results to preserve order and prevent OOM errors while still achieving a significant speedup.
