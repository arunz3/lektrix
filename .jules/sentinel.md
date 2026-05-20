## 2024-05-20 - Fix Hardcoded API Key for Feedback Form
**Vulnerability:** The Web3Forms access key (`WEB3FORMS_ACCESS_KEY`) was hardcoded directly in `src/App.jsx`.
**Learning:** This is a critical security vulnerability as it exposes the key in the client-side code. Furthermore, demo modes were handled by comparing the key against a dummy string instead of proper variable truthiness checks.
**Prevention:** Always load secrets via environment variables (`import.meta.env.VITE_*` in Vite). For demo or fallback modes, rely on checking if the environment variable is falsy (e.g., `if (!ENV_VAR)`) rather than hardcoding a "dummy" fallback value in source code.
