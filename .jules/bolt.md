## 2024-05-18 - Parallelizing PDF.js rendering with chunking
**Learning:** Parallelizing canvas rendering using `Promise.all()` in PDF-lib/pdfjs-dist can cause out-of-memory errors on large PDFs if not chunked.
**Action:** When parallelizing canvas rendering on the client side, use a chunked batch approach (e.g., batch size 3) to constrain concurrency before sequential processing.
