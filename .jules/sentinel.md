## 2024-05-24 - Hardcoded Web3Forms API Key
**Vulnerability:** Found a hardcoded API key (`WEB3FORMS_ACCESS_KEY`) exposed directly in `src/App.jsx`.
**Learning:** Hardcoded keys are often used during development for convenience or to support demo modes (by comparing against a dummy key), but doing so exposes them in source control and client-side bundles.
**Prevention:** Always use environment variables (`import.meta.env.VITE_*` in Vite) to inject secrets securely. When supporting demo modes, use variable truthiness checks (e.g., `if (!ENV_VAR)`) instead of checking against hardcoded dummy strings.
