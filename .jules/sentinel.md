## 2025-05-15 - Hardcoded API Key for Demo Mode
**Vulnerability:** A hardcoded Web3Forms API key was present in the source code, along with logic checking for a specific "dummy" string to toggle a demo mode.
**Learning:** Hardcoding API keys even for "demo modes" or fallback logic is dangerous and can accidentally expose real secrets if the string is updated incorrectly, and the source code is public. The codebase relied on string matching against a dummy key to toggle demo features.
**Prevention:** Never hardcode secrets in source files. Use environment variables (e.g., `import.meta.env.VITE_*` in Vite). Instead of using dummy string checks for fallback/demo modes, use truthiness checks on the environment variable itself (e.g., `if (!ENV_VAR)`).
