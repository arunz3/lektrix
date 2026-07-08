## 2025-02-27 - Prevent Object URL Client-Side DoS
**Vulnerability:** Client-side Out-of-Memory (DoS) triggered by generating Object URLs for an unbounded array of uploaded files before slicing to the \`maxFiles\` limit.
**Learning:** The application processed all dropped files (potentially thousands) through \`URL.createObjectURL\` synchronously before discarding the excess, leading to browser crashes.
**Prevention:** Always enforce constraints and slice array inputs to dynamic limits (handling undefined as Infinity) before processing heavy operations like Object URL generation.
