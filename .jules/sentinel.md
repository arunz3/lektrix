## 2024-05-24 - Hardcoded Web3Forms API Key
**Vulnerability:** The `WEB3FORMS_ACCESS_KEY` was hardcoded directly into `src/App.jsx` along with a placeholder demo key check.
**Learning:** This happens frequently when developers are creating quick forms or demos and forget to transition to environment variables before committing. Also, using a dummy string for demo mode instead of a truthiness check makes it more likely for the real key to be checked in later.
**Prevention:** Always use `import.meta.env.VITE_*` for frontend API keys. Implement demo modes using truthiness checks on the environment variable (`if (!ENV_VAR)`) instead of checking for a specific hardcoded dummy string.
