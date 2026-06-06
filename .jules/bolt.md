## 2024-05-29 - Parallelizing I/O and Embedding in pdf-lib
**Learning:** Sequential processing of images and PDFs (like reading `arrayBuffer` and calling `embedJpg`/`embedPng` in a loop) is a significant bottleneck in client-side processing. Independent asynchronous operations are not utilizing the browser's concurrency.
**Action:** Use `Promise.all()` to parallelize independent asynchronous `pdf-lib` and I/O file operations (e.g., `arrayBuffer()`, `embedJpg()`) before sequentially processing the results to preserve the original order.
