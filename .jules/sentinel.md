## 2025-02-18 - Hardcoded API Key in Client Code
**Vulnerability:** A Web3Forms access key was hardcoded directly in `src/App.jsx`.
**Learning:** API keys must never be hardcoded in the source code, especially in client-side applications where they are exposed to the browser.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_*`) to manage sensitive keys and check for their presence to handle demo or fallback logic safely.
