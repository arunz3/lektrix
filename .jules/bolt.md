## 2023-10-25 - Canvas Rendering OOM Prevention
**Learning:** Parallelizing `page.render()` for all pages simultaneously causes Out-of-Memory (OOM) errors on large PDFs due to high memory consumption per canvas.
**Action:** Use chunked concurrency (e.g. batches of 5 pages) to parallelize rendering while bounding memory, then process the results sequentially to preserve document page order.