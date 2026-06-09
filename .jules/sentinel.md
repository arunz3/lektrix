## 2026-06-09 - Remove hardcoded API key
**Vulnerability:** A hardcoded Web3Forms API key was found in src/App.jsx.
**Learning:** Hardcoded API keys in frontend code can be extracted and abused by attackers.
**Prevention:** Always use environment variables for API keys and secrets, even in frontend applications.
