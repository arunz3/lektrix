## 2025-06-15 - Data URI Fetch Hack
**Learning:** Using `fetch(dataURI).then(res => res.arrayBuffer())` is actually faster than parsing base64 via JS `atob()`. It delegates the heavy lifting of base64 decoding to the browser's native C/C++ layer, running it off the main thread.
**Action:** Do not remove `fetch()` base64 decoding. Instead, optimize performance by parallelizing canvas rendering with a chunking strategy to prevent OOM.
