## 2026-05-25 - Fix Hardcoded Web3Forms Access Key
**Vulnerability:** A Web3Forms access key was hardcoded in `src/App.jsx` as `WEB3FORMS_ACCESS_KEY`.
**Learning:** This exposes the secret to anyone accessing the frontend repository, leading to potential misuse. Hardcoding secrets in source files violates basic security guidelines.
**Prevention:** API keys and secrets should always be stored securely using environment variables (e.g. `import.meta.env.VITE_*` in Vite applications) and not committed directly to source control.
