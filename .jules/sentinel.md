## 2025-02-24 - Hardcoded API Key Fallbacks Provide Security Theater
**Vulnerability:** A hardcoded API key was partially mitigated by reading an environment variable, but fell back to another hardcoded dummy/demo key if the environment variable was absent, resulting in a persistent secret being exposed in source control.
**Learning:** Fallback patterns for secrets that use strings often inadvertently expose development/demo credentials or simply replace one hardcoded secret with another.
**Prevention:** Rely strictly on the presence (truthiness) of environment variables to determine functionality (e.g., `if (!VITE_API_KEY)`), completely eliminating hardcoded secret strings from the codebase.
