## 2025-05-18 - Hardcoded Web3Forms API Key
**Vulnerability:** A hardcoded Web3Forms Access Key was found in `src/App.jsx`.
**Learning:** Hardcoding API keys allows any individual with access to the source code to misuse the service under the hardcoded key identity.
**Prevention:** Keys should be set through environment variables like `import.meta.env` for Vite applications and retrieved during the CI/CD pipeline or server deployment securely.
