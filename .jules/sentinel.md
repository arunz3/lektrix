## 2025-06-15 - Add Input Length Limits to Prevent Payload DoS
**Vulnerability:** Missing input length limits on the Contact/Feedback form fields.
**Learning:** Open-ended input fields without constraints can allow users or bots to submit massive payloads (Denial of Service risk) which might crash the client browser when handling state, cause server issues on third-party APIs (Web3Forms), or result in unintended data truncation/storage costs on the backend.
**Prevention:** Always add `maxLength` properties to user-facing text inputs (`<input>`, `<textarea>`) to enforce reasonable constraints and protect both client and server from excessively large payloads.
