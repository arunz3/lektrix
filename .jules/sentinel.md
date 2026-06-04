## 2025-02-18 - Hardcoded Web3Forms API Key
**Vulnerability:** Hardcoded API key (WEB3FORMS_ACCESS_KEY) found in src/App.jsx.
**Learning:** The key was hardcoded directly in the frontend code to support a demo mode by checking against a dummy fallback string, which exposes the real or demo keys in version control.
**Prevention:** Frontend API keys should always be loaded from environment variables (e.g., import.meta.env.VITE_*) and fallback logic should be based on variable truthiness rather than hardcoded dummy values.
