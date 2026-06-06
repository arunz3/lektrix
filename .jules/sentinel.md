## 2026-06-06 - Hardcoded API Key

**Vulnerability:** Hardcoded `WEB3FORMS_ACCESS_KEY` in `src/App.jsx`.
**Learning:** Hardcoded secrets in client-side code are exposed to users and attackers. Fallback strings should not be used.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`) and truthiness checks (`!ENV_VAR`) for fallback logic instead of dummy strings.
