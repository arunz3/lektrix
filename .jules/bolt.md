## 2024-06-24 - PDF Compression Parallelization
**Learning:** For client-side PDF tasks, parallelizing asynchronous `pdf-lib` and I/O file operations using `Promise.all()` speeds up the processing. However, unbounded parallel canvas rendering on large PDFs can lead to Out-of-Memory (OOM) errors.
**Action:** Use a limited concurrency approach (chunking in batches) before sequentially adding the processed results to the document to preserve order and keep memory footprints stable.
