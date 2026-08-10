# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Product decisions

- Product: 数智罗盘·AI直播复盘, a PC-only internal B2B tool embedded under 直播 after 主播.
- Visual source: `C:\Users\chang\Downloads\ScreenShot_2026-08-10_091655_551.png`; preserve its pale blue shell, white cards, blue accents, dense filters, and table language.
- First prototype scope: video list page plus a large centered upload modal, optimized for a boss/business demo.
- Use a data table, not cards. Upload uses a modal, not a drawer.
- Later workspace: three resizable columns; left and center collapsible, right fixed; transcript is central, content compass expands from a button.
- AI quick actions are called “AI快捷功能” rather than encoding a fixed count. Data-dependent questions remain visible but disabled until business data is connected.
