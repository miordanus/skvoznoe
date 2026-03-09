what is broken
- Production is wired to branch `claude/skvoznoe-landing-page-P7f5y` (shown in Vercel), which is not your intended stable branch flow.
- Deployment behavior is relying on dashboard-only settings; no repo-level routing config exists, so route handling is fragile.

what to recreate
- Recreate Vercel project import from `claude/skvoznoe-landing-page-P7f5y`.
- Set Production Branch to `main` (or your actual long-lived branch), not `claude/skvoznoe-landing-page-P7f5y`.
- Keep app root at repository root.

exact values to paste into Vercel
- repo: claude/skvoznoe-landing-page-P7f5y
- production branch: main
- root directory: ./
- framework preset: Other
- build command: (leave empty)
- output directory: (leave empty)
- install command: (leave empty)

spa rewrites
- needed (to prevent 404 on any direct route)

exact files to change
- add `vercel.json` at repo root with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
