## 2024-05-24 - Canvas Rendering Trade-off
**Learning:** Sequential PDF canvas rendering underutilizes resources, but unbounded parallel rendering via Promise.all easily triggers Out-of-Memory (OOM) crashes on large documents.
**Action:** Always batch canvas rendering in small chunks (e.g., 3-5 pages) using Promise.all to achieve a balance between speed and memory stability.
