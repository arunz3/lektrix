## 2024-05-28 - Hardcoded Web3Forms API Key
**Vulnerability:** A hardcoded Web3Forms access key (`3a8827c3-38ee-46c3-9f6d-94f9ce6cb0ca`) was found in `src/App.jsx`. Additionally, a specific hardcoded fallback string (`7a83d366-beae-46b0-9b4b-488cb95b1dc0`) was used to conditionally render demo mode logic.
**Learning:** Hardcoding API keys exposes them to potential abuse. Using specific strings to trigger demo modes is fragile and can lead to unintended logic bypasses.
**Prevention:** API keys should securely be loaded through environment variables using the `import.meta.env.VITE_*` syntax in Vite. To support demo modes without fallback strings, use truthiness checks (e.g., `if (!ENV_VAR)`) to conditionally handle logic.
