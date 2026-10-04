# Security

The maintained version is the latest revision of this website. There is no backend, authentication system, database, or secret required for the public calendar embed.

## Reporting a vulnerability

If the GitHub repository offers **Security → Report a vulnerability**, use that private reporting channel. Repository maintainers should enable private vulnerability reporting in GitHub settings. If it is unavailable, open an issue requesting a private contact method without publishing exploit details, credentials, or personal data. No response-time commitment or dedicated security email is currently established.

Include affected pages or build commands, reproduction steps, impact, and a suggested fix when possible.

## Maintenance practices

- Keep credentials, tokens, private calendar URLs, original archives, and working captures out of source control and publishing artifacts. The public calendar ID is intentionally public; never substitute a secret iCal URL.
- Treat supplied Markdown and raw HTML as trusted editorial input, not as untrusted user submissions. Marked does not sanitize HTML. Review contributions before rebuilding and publishing.
- Run the validation workflow for changes. Review dependency update pull requests and periodically run `npm audit`.
- Publish only `dist/`. The preview server binds to localhost and is a development tool, not a production server.
- Keep workflow permissions narrow and third-party GitHub Actions pinned. Deployment is manually triggered and uses the `github-pages` environment.

Google Calendar and external media are outside this repository's control. The calendar uses public read-only access; its sharing configuration determines which event details visitors can see.
