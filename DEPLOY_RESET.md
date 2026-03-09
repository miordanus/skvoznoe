what is now fixed
- Runtime зафиксирован как **статический** (`index.html + scene-config.js + script.js`) без React build pipeline.
- Источник правды для координат и параллакса теперь один: `scene-config.js`.
- Неиспользуемая React-ветка `src/components/HeroScene/*` удалена, чтобы её нельзя было случайно править как runtime-код.

what to keep in Vercel
- repo: `claude/skvoznoe-landing-page-P7f5y`
- production branch: `main` (или ваш постоянный stable branch)
- root directory: `./`
- framework preset: `Other`
- build command: (empty)
- output directory: (empty)
- install command: (empty)

spa rewrites
- needed (to prevent 404 on any direct route)
- configured in `vercel.json`

where to edit scene parameters
- edit only `scene-config.js`:
  - `parallaxSpeed` for layer speed
  - `objects` for coordinates/sizes/rotation/mobile overrides
- `script.js` should not duplicate scene geometry values.
