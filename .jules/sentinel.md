## 2024-05-24 - Hardcoded API Key Exposure
**Vulnerability:** Hardcoded Web3Forms API key (`WEB3FORMS_ACCESS_KEY`) found in frontend source code `src/App.jsx`.
**Learning:** Developers sometimes hardcode keys directly in the frontend component files to speed up development or provide a "demo" experience, coupled with hardcoded mock key comparisons.
**Prevention:** Always use environment variables (e.g. `import.meta.env.VITE_*` for Vite apps) for API keys and configuration, and rely on variable truthiness checks (e.g. `if (!ENV_VAR)`) to toggle fallback or demo modes securely.
