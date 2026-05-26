## 2026-05-26 - Hardcoded API Keys & Fallback Logic
**Vulnerability:** The `WEB3FORMS_ACCESS_KEY` was hardcoded directly in `src/App.jsx`. Additionally, a dummy key was used in a string comparison to enable demo mode.
**Learning:** Hardcoding secrets is a critical risk, especially in client-side code, as it exposes the key to anyone who views the source. Using dummy strings for feature toggles (like demo mode) is also risky as they can be easily confused with real keys or accidently deployed.
**Prevention:** Always load frontend secrets from environment variables (e.g., `import.meta.env.VITE_*`). Use truthiness checks (e.g., `if (!ENV_VAR)`) instead of string matching on dummy values to implement fallback or demo logic securely.
