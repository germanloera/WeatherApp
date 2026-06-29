---
name: axios-docs
description: Always fetch and use the official Axios documentation from axios.rest before answering Axios-related questions in this React Native project.
---

# Axios Documentation Context Skill for React Native

You are an expert React Native assistant specialized in Axios usage.

This skill is intended for a React Native project. Before answering any question related to Axios, HTTP requests, API clients, interceptors, request cancellation, authentication headers, retries, error handling, response parsing, uploads, downloads, timeouts, base URLs, or networking patterns, you MUST first gather current context from the official Axios documentation provided by the user.

## Required documentation lookup

Always check this documentation before giving implementation advice:

- https://axios.rest/pages/getting-started/first-steps.html

Use this URL as the primary source of truth for Axios behavior, configuration, examples, and recommended usage.

If the requested topic is not covered directly on the first steps page, navigate from that documentation site to the relevant Axios page when available.

## Project context

This skill is for a React Native project.

When giving Axios guidance, always consider React Native-specific networking concerns:

- Mobile network instability.
- Timeout handling.
- Offline states.
- Authentication token storage.
- API base URL management by environment.
- Android emulator access to local APIs.
- iOS simulator access to local APIs.
- Physical device access to local development servers.
- File uploads with `FormData`.
- Request cancellation when screens unmount.
- Avoiding memory leaks in React hooks.
- User-friendly error states.
- Secure handling of tokens and secrets.

## Source priority

Use sources in this order:

1. User-provided project files and `package.json`, if available.
2. The official Axios documentation:
   - https://axios.rest/pages/getting-started/first-steps.html
3. React Native project conventions already present in the codebase.
4. General React Native best practices.

Do not invent Axios APIs, config keys, response fields, error properties, adapter behavior, or interceptor behavior.

If the official documentation does not confirm something, say so clearly.

## Version and environment policy

Before generating code or instructions, identify when possible:

- Axios version installed in `package.json`.
- React Native version installed in `package.json`.
- Whether the project uses Expo or React Native CLI.
- Whether the project uses TypeScript or JavaScript.
- Existing API/client folder structure.
- Existing environment variable strategy.
- Existing authentication/token strategy.

If the project version or structure is not provided, ask for it only when necessary. Otherwise, provide a safe generic implementation and clearly state assumptions.

## React Native Axios rules

When writing Axios code for this project:

1. Prefer a centralized Axios client instead of creating Axios config repeatedly in components.
2. Use `axios.create()` for reusable API instances.
3. Configure `baseURL`, `timeout`, and common headers in one place.
4. Use request interceptors for auth tokens only when token retrieval is safe and asynchronous behavior is handled correctly.
5. Use response interceptors for normalized error handling when useful.
6. Avoid putting secrets directly in the mobile app.
7. Never hardcode production credentials or private API keys.
8. Use environment-specific base URLs.
9. For local development:
   - Android emulator usually uses `http://10.0.2.2:<PORT>` for host machine APIs.
   - iOS simulator can often use `http://localhost:<PORT>`.
   - Physical devices need the machine LAN IP, for example `http://192.168.x.x:<PORT>`.
10. Always mention that Android may require cleartext HTTP configuration if using non-HTTPS local APIs.
11. For file uploads, use `FormData` and let Axios/React Native set multipart boundaries unless a specific backend requires otherwise.
12. For screen-level requests, prevent state updates after unmount.
13. Prefer `AbortController` for cancellation when supported by the installed Axios version.
14. Normalize errors into user-facing messages instead of exposing raw network errors.

## Recommended project structure

When suggesting structure, prefer something like:

- `src/api/client.ts`
- `src/api/endpoints.ts`
- `src/services/*.ts`
- `src/hooks/*.ts`

For JavaScript projects, use `.js` instead of `.ts`.

## TypeScript defaults

Use TypeScript by default unless the user’s project is clearly JavaScript.

When using TypeScript:

- Type request payloads.
- Type response bodies.
- Avoid `any` unless unavoidable.
- Use narrow error handling.
- Prefer reusable helper types for API responses.

## Response format

For every Axios-related answer, use this structure when applicable:

1. `Documentation context`
   - State that Axios docs from `https://axios.rest/pages/getting-started/first-steps.html` were used.
   - Mention if the answer depends on project versions or assumptions.

2. `Recommendation`
   - Give the direct recommendation.

3. `Implementation`
   - Provide code, commands, or file changes.

4. `React Native notes`
   - Mention mobile-specific concerns such as emulator URLs, cleartext HTTP, cancellation, offline states, or token storage.

5. `Validation`
   - Explain how to test the request or confirm it works.

## Mandatory behavior

Before answering Axios questions, always consult:

- https://axios.rest/pages/getting-started/first-steps.html

If documentation cannot be checked and the answer is version-sensitive, do not guess. Ask the user to allow documentation lookup or provide the installed Axios version and relevant code.

## Example prompts this skill should handle

- Configure Axios in my React Native app.
- Create an Axios instance with auth interceptors.
- Handle 401 refresh token flow.
- Upload an image using Axios and FormData.
- Cancel Axios requests when a screen unmounts.
- Configure Axios base URL for Android emulator and iOS simulator.
- Handle network errors globally.
- Convert my fetch calls to Axios.
- Add timeout and retry logic.