# Publishing

Publish **only the contents of `dist/`**. This keeps the source ZIP, original collection, development reports, source code, installed dependencies, and working captures off the public site. Public assets and their required license notices are included.

## GitHub Pages

The repository includes two workflows:

- **Validate:** checks formatting, builds, tests content and tooling, verifies committed generated files, and runs Chromium checks for pushes and pull requests. It does not deploy.
- **Deploy GitHub Pages:** runs only when manually dispatched, validates the selected revision, and publishes `dist/` through GitHub Pages.

Once these files are committed to a GitHub repository:

1. In **Settings → Pages**, select **GitHub Actions** as the build source.
2. Ensure Actions are enabled. Configure the `github-pages` environment's permitted branches and any desired reviewer requirement.
3. In **Actions → Deploy GitHub Pages → Run workflow**, select the intended branch and run it.
4. Review the deployment URL, both language editions, image credits, and the live calendar.

No GitHub account settings or deployments are changed by local builds. This workspace may be used without Git; the workflows take effect only after it is committed and pushed to a GitHub repository. The canonical metadata currently targets `https://for-moon-man.github.io/bio/`; update the URL references in `build.mjs` and `lib/tamil.mjs` if publishing elsewhere.

The deployment workflow uses narrowly scoped permissions and an environment-bound GitHub token. It needs no personal access token or Google credentials. Actions are pinned to commit hashes, and Dependabot monitors their updates.

## Other static hosts

```sh
npm ci
npm run check
```

Upload the files inside `dist/`, preserving relative paths. The website can run under a subdirectory. No backend or server-side rendering is needed. Do not point hosting at the workspace root, even though root HTML remains available for local viewing.

## Before publishing

- Run `npm run check` and the browser checks documented in [development](DEVELOPMENT.md#testing).
- Verify the canonical URLs and any host-specific base path.
- Review the calendar from a signed-out browser. To reveal event titles, enable **Make available to public → See all event details** for the intended calendar and check individual event visibility.
- Confirm the public artifact contains only intended public assets and required notices. `LICENSE`, `THIRD_PARTY_NOTICES.md`, icon licenses, and font licenses must travel with the site.

## Calendar maintenance

Both editions use `mylswamy.annadurai.calendar@gmail.com`, agenda view, and `Asia/Kolkata`. Event edits happen in Google Calendar and require no site rebuild; Google may cache updates briefly. Titles and descriptions are not automatically translated. Enter both languages in Google for bilingual event content. Changing the calendar ID, time zone, or page layout requires rebuilding and publishing.

## Rollback

Publish `dist/` built from a previously reviewed commit, or rerun the deployment workflow on a branch containing that revision. Do not repair a deployment by editing generated files alone; make fixes in the maintained source and rebuild. Calendar content is managed separately in Google Calendar.
