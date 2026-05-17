## 2026-05-17 - [Hardcoded Web3Forms API Key]
**Vulnerability:** Found a hardcoded `WEB3FORMS_ACCESS_KEY` in `src/App.jsx`.
**Learning:** Hardcoded API keys present a critical vulnerability, especially in frontend apps where source code is visible in the browser, allowing attackers to abuse the key.
**Prevention:** Always use environment variables (e.g., `import.meta.env`) to supply sensitive keys at build time or use a backend proxy. Keep source code free of secrets.
