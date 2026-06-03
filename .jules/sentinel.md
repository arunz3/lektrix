## 2024-06-03 - Hardcoded API Key in Frontend
**Vulnerability:** Hardcoded Web3Forms Access Key (`WEB3FORMS_ACCESS_KEY`) in `src/App.jsx`.
**Learning:** The frontend source code exposed an API key which gets bundled and sent to all clients, allowing potential abuse of the Web3Forms endpoint. Demo fallback logic relied on exact matching of "dummy" strings rather than checking for missing configuration.
**Prevention:** Always load API keys securely via environment variables (e.g., `import.meta.env.VITE_*` in Vite) and use conditional checks for missing configuration (`if (!VITE_API_KEY)`) to handle demo/fallback logic, never hardcode secrets in source code.
