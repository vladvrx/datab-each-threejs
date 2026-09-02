# Data B-each — Three.js

Standalone playable copy of DATAB-EACH on the original **Three.js r150** engine (`loadWebGL`). HUD covers the start screen, dialogue, and menus. There is no in-game phone and no map.

The island, shaders, cameras, NPCs, and intro boat are the recovered WebGL runtime and the same hashed GLBs. Vue plugins still boot in the background so `$dialogs`, `$quests`, and `$store` match the original game; the canvas is Three.js, not a React rewrite.

## Run

```bash
npm run dev
```

Open [http://127.0.0.1:43173/three-js](http://127.0.0.1:43173/three-js) (or `/` — both serve this build).

## Scene editor

Yes. Data B-each Studio (the Z-up island editor) still drives this build. **Start** playtests inside Studio. **Apply to game** writes island props, quests, characters, and dialogue into `reference/assets`, patches `vendor/webgl` / `vendor/vendor`, and injects `studio-bridge.js` into this page.

Point Studio at this checkout:

```bash
export DATAB_EACH_REPO=https://github.com/vladvrx/datab-each-threejs.git
export DATAB_EACH_ROOT=/path/to/this/repo
export DATAB_EACH_ORIGIN=http://127.0.0.1:43173
```

Then **Apply to game**. Custom imported GLB/FBX meshes stay in Studio playtest; Apply only ships original Cove assets.

A backup of this Three.js HUD also lives in [DATAB-EACH](https://github.com/vladvrx/DATAB-EACH) at `three-js/`.

## What boots

1. Original Vue plugins (`savestate`, `manifest`, `quests`, `dialogs`, `items`, `characters`, `router`, `preloader`, `webgl`).
2. `loadWebGL` from `vendor/webgl.3250e36a65453426.js`.
3. Vanilla HUD in `three-js/src/hud/` (start, dialogue, header, pause menu, joystick, interaction).

## Files

| Path | Role |
| --- | --- |
| `server.mjs` | Static server (port 43173) |
| `three-js/` | Boot page and HUD |
| `vendor/` | Original vendor + WebGL bundles |
| `reference/assets/` | GLBs, locales, CSS, audio |
| `direct-port/` | Site data, intro logo/cursor helpers |
