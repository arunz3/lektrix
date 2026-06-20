## 2024-06-20 - Prevent OOM on Large PDFs
**Learning:** To prevent Out-of-Memory (OOM) errors on large PDFs, parallel canvas rendering must use a limited concurrency approach (e.g., chunking batches of 3-5 pages) before sequentially processing the results to preserve order.
**Action:** Use chunked Promise.all execution when processing PDF pages with pdfjsLib and pdf-lib.