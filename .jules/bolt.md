## 2024-06-10 - Parallelize Asynchronous PDF-Lib Operations
**Learning:** Client-side PDF processing often involves independent, asynchronous operations (like pdf-lib's `embedJpg`, `fetch()`, and `page.render()`) inside sequential loops to preserve order. This creates a significant performance bottleneck by running these I/O heavy operations one at a time.
**Action:** Use `Promise.all()` to parallelize the independent rendering and I/O file operations before sequentially processing the results into the final PDF to ensure correct page ordering.
