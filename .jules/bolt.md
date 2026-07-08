## 2024-07-08 - Batched Parallel Processing for PDF Canvas Rendering
**Learning:** Purely parallelizing `page.render()` and `embedJpg()` with `Promise.all` across a large number of PDF pages causes client-side Out-of-Memory (OOM) errors due to excessive memory consumption by canvas objects and data URLs.
**Action:** Always process client-side PDF canvas operations in limited concurrency batches (e.g., chunks of 3-5 pages) using `Promise.all` for the chunk, then sequentially apply the results to the document to preserve order and prevent memory exhaustion.
