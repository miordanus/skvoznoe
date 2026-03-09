# skvoznoe

## Runtime

Проект работает как **статический сайт** без сборки:

- entrypoint: `index.html`
- логика: `script.js`
- конфиг сцены/параллакса: `scene-config.js`

`src/components/HeroScene/*` удалён из репозитория, чтобы не было ложного впечатления, что React-версия участвует в runtime.

## Где менять координаты и параллакс

Все параметры сцены изменяются только в одном месте: `scene-config.js`.

- скорости параллакса: `window.HERO_SCENE_CONFIG.parallaxSpeed`
- координаты/размеры/слои объектов: `window.HERO_SCENE_CONFIG.objects`

`script.js` только читает этот конфиг и рендерит сцену.

## Deploy (Vercel)

- Framework Preset: `Other`
- Build Command: empty
- Output Directory: empty
- Install Command: empty
- Runtime: static files from repo root

SPA rewrite находится в `vercel.json`.
