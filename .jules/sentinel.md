## 2024-05-24 - Hardcoded Web3Forms API Key with Demo Logic
**Vulnerability:** Hardcoded API key `WEB3FORMS_ACCESS_KEY` exposed in `src/App.jsx`.
**Learning:** A hardcoded "demo" API key fallback pattern led to an actual API key being hardcoded and committed into the frontend bundle.
**Prevention:** Always use `import.meta.env.VITE_*` and check for truthiness (`if (!VITE_API_KEY)`) to handle demo mode fallbacks without committing hardcoded strings.
