# Neon Dodge Characters and World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight procedural visual identity with NOVA, Glitches, energy rails, and theme-specific scenery without changing the Neon Dodge core loop.

**Architecture:** Keep the existing world model and normalized coordinates. Extend `getVisualStyle()` with semantic art tokens, add a small deterministic obstacle kind field, and render shared normalized polygons/scene decorations in both WebGL and Canvas fallbacks. No external assets or new gameplay rules are introduced.

**Tech Stack:** Vanilla JavaScript modules, Canvas 2D fallback, WebGL/WebGL2, Node test runner, local Markdown/Obsidian notes.

## Global Constraints

- Preserve the current lane switch, collision bounds, difficulty profile, progression thresholds, and Poki lifecycle.
- Use only local procedural shapes; no network requests, CDN resources, fonts, analytics, or third-party runtime libraries.
- Keep the initial runtime below 8 MB and verify with `npm run check:build`.
- Preserve the logical canvas sizes 640x360, 836x470, and 1031x580.
- Keep visual variants readable on portrait, landscape, desktop, and reduced-motion contexts.
- Add tests before production code and run `npm test` plus `npm run check:build` before commit.

## Files

- Modify: `game.js` — art tokens, deterministic obstacle kinds, normalized polygon helpers, WebGL/Canvas entity and scene rendering.
- Modify: `tests/core-loop-polish.test.mjs` — regression tests for character/world tokens and unchanged collision dimensions.
- Create: `docs/superpowers/specs/2026-08-15-neon-dodge-characters-world-design.md` — approved design source.
- Modify: `D:\LEONARDO\Games\cofre-games\03 - Projetos\Neon Dodge\02 - Decisões\Evolução Neon - Especificação.md` — record implementation decision.
- Modify: `D:\LEONARDO\Games\cofre-games\03 - Projetos\Neon Dodge\04 - Validação\Validação.md` — record evidence and final bundle size.

### Task 1: Lock visual data contracts

**Files:** `game.js`, `tests/core-loop-polish.test.mjs`

- [ ] Write failing tests that require `getVisualStyle()` to expose `form`, `theme`, `playerAccent`, `obstacleAccent`, and that a world obstacle exposes a `kind` while retaining width `0.08` and height `0.16`.
- [ ] Run `node --test tests/core-loop-polish.test.mjs` and confirm failure comes from missing visual tokens/kind.
- [ ] Add semantic art tokens for all existing themes, skins, and forms; assign a deterministic `kind` during obstacle spawn without changing collision dimensions.
- [ ] Run the focused test and confirm it passes.

### Task 2: Add shared procedural shape helpers

**Files:** `game.js`, `tests/core-loop-polish.test.mjs`

- [ ] Write failing tests for normalized `getPlayerShape(form)` and `getObstacleShape(kind)` outputs, requiring at least four polygon points and stable form/kind differences.
- [ ] Run the focused test and confirm failure because the helpers are not exported.
- [ ] Implement pure helpers returning normalized point arrays; keep them independent of Canvas and WebGL contexts.
- [ ] Run the focused test and confirm it passes.

### Task 3: Render NOVA, Glitches, rails, and scenes

**Files:** `game.js`

- [ ] Add renderer-local polygon drawing for WebGL and Canvas 2D.
- [ ] Draw deterministic theme decorations behind the lanes: city blocks, crystal shards, or cosmic panels.
- [ ] Draw NOVA with a form-dependent silhouette, visor accent, and optional equipment visor while preserving its current rectangle bounds for collision.
- [ ] Draw Glitch variants from `obstacle.kind` using the same normalized obstacle width/height.
- [ ] Keep rails, center divider, and background contrast intact.
- [ ] Run the focused tests and then `npm test`.

### Task 4: Verify browser behavior and constraints

**Files:** `tests/core-loop-polish.test.mjs`, project runtime

- [ ] Run `npm test`, `npm run check:build`, and `git diff --check`.
- [ ] Inspect the local game in desktop, 390x844 portrait, and landscape; confirm NOVA, Glitches, and all three themes remain visible and the first tap still starts gameplay.
- [ ] Check browser logs for errors/warnings and confirm no external requests are introduced.
- [ ] Update the validation and decision notes with the exact test count and bundle size.

### Task 5: Publish

- [ ] Stage only `game.js`, `tests/core-loop-polish.test.mjs`, the design spec, and the two Neon Dodge vault notes listed in the Files section.
- [ ] Commit with `feat: add Neon Dodge characters and world identity`.
- [ ] Push `main` to `origin` and verify `git diff --quiet origin/main HEAD`.
