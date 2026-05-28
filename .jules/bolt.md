## 2024-05-28 - Parallelizing PDF-Lib Operations
**Learning:** Sequential processing in client-side PDF tasks (like embedding multiple images or merging files) can be a significant bottleneck due to independent I/O and PDF-lib tasks (`arrayBuffer()`, `embedJpg()`) blocking each other in a loop.
**Action:** Use `Promise.all()` to parallelize these independent asynchronous operations first, and then sequentially process the loaded/embedded results into the document to preserve order and speed up execution.
