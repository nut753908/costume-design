[English](CLAUDE.md) | [日本語](CLAUDE.jp.md)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Settings

- Always converse in Japanese.
- Write comments in Japanese as well.
- Explain error messages in Japanese too.
- Generate documentation in Japanese too.

## Project Overview

A browser-based 3D costume design tool built with Three.js. It ships as two independent static single-page apps (no runtime state is shared between them):

- **hair-bundle** (`hair-bundle.html` → `src/hair-bundle/`) — builds a hair bundle from a cylinder using curves and control points.
- **tight-clothing** (`tight-clothing.html` → `src/tight-clothing/`) — uses cross-section planes and area extrusion to create clothing (tops, bottoms, gloves, tights, socks) that fits snugly to a body mesh.

Both are deployed as static pages to GitHub Pages (see `.github/workflows/deploy.yml`). `dist/tight-clothing.html` is copied to `404.html`, acting as the site's fallback.

`vite.config.ts` defines a multi-page build with `hair-bundle.html`/`tight-clothing.html` as separate entries, and `base: "/costume-design/"` aligns asset URLs with the GitHub Pages repository path.

## Commands

```bash
npm run dev       # start the Vite dev server
npm run build     # type-check with tsc + build with vite (outputs to dist/)
npm run preview   # preview the production build

npm run format    # biome format --write
npm run lint      # biome lint --write
npm run check     # biome check --write (format + lint + import sorting)
npm run ci        # biome ci (check only, used in CI)

npm test          # run vitest in watch mode
npm run coverage  # vitest run --coverage
```

Run a single test file: `npx vitest run test/hair-bundle/curve/curve.test.ts`
Filter tests by name: `npx vitest run -t "some test name"`

CI (`.github/workflows/ci.yml`) runs the following on Node 20.x/22.x: `npm run build`, `npm run ci`, `npm run test`.

## Architecture

### Entry points and app lifecycle

`src/hair-bundle/main.ts` and `src/tight-clothing/main.ts` are the two apps' entry points, and both follow the same structure:

1. `init()` creates the renderer, camera, controls/gizmo, lil-gui's `GUI`, and the scene, then builds the feature-specific object graph and adds it to the scene.
2. It implements its own **undo/redo stack** (arrays of JSON snapshots named `undos`/`redos`) — no library is used. `save()` pushes a JSON snapshot every time the GUI changes (`gui.onChange`/`onFinishChange`/`onOpenClose`), assembled from each domain object's own `toJSON()` and the GUI panel state (`saveGui`/`saveClosed`). Ctrl+Z / Ctrl+Shift+Z (or Ctrl+Y) pops the stack and calls `loadLastUndo()`, which discards the current Three.js group (`disposeGroup`) and rebuilds each object from the snapshot using `fromJSON()`.
3. `animate()` is the render loop passed to `createRenderer`.

Adding a new stateful object to either app requires: a `toJSON()`/`fromJSON()` pair, wiring it into the undo/redo snapshot shape, and a `setGUI(gui)` method if it has GUI controls — use the existing `Tube`/`PlaneManager`/`Area` classes as a pattern.

### `src/common/` — shared by both apps

- `renderer.ts`, `camera.ts`, `controls.ts` — set up Three.js's renderer / orthographic camera / orbit controls, and `three-viewport-gizmo`.
- `object-3d/scene.ts`, `axes-helper.ts`, `plane-helper.ts`, `arrow-helper.ts` — factories for the scene and debug helpers, each wired to an lil-gui folder.
- `gui.ts` — the GUI state persistence helpers used for undo/redo described above (`saveGui`/`saveClosed`/`loadClosed`/`deleteFolder`/`closeFolder`). The `foldersToSave` allowlist inside `saveGui` controls which top-level GUI folders are included in the undo/redo state — update it when adding a new folder that needs to be persisted.
- `utils.ts` — `disposeGroup` (recursively disposes of Three.js geometries/objects, used before rebuilding a group), `createColor` (linear sRGB color helper), `createEmptyGeometry`, `objectMap`.
- `material/` — shared material factories (line, points, toon).

Toon shading uses a custom pair of GLSL vertex/fragment shaders, embedded directly as `<script>` tags (id: `toonVertex`/`toonFragment`) inside `hair-bundle.html`/`tight-clothing.html` rather than as `.glsl` files.

### `src/hair-bundle/`

Pipeline: **control points → curve → tube geometry**.

- `control-point/` — `ControlPoint2`/`ControlPoint3` (2D/3D control points) grouped by `ControlPointGroup`. `circular.ts`/`spherical.ts` provide coordinate transforms, and `math.ts` holds supporting geometric calculations.
- `curve/` — `Curve2`/`Curve3`, built from control points via `CurveGroup`. `sample-curve-2.ts`/`sample-curve-3.ts` provide preset `Curve2`/`Curve3` constants (circles, gentle slopes, constants) used as default parameter values by `tube/`.
- `tube/` — `TubeBaseGeometry` → `TubeGeometry` → `Tube` (the top-level stateful object with `toJSON`/`fromJSON`/`setGUI`) → `TubeGroup` (the renderable `THREE.Group`, built by `createTubeGroup`).

### `src/tight-clothing/`

Pipeline: **body mesh → centerline → cross-section plane → intersection → area → extrude**.

- `body/` — loads the body mesh (`body-group.ts`) from `public/models/body1-22.glb` and precomputed n-gon face data (`public/models/body1-22-n-polygon-{indices,positions}.txt`, regenerated from Blender's `body/save-n-polygon-data.py` — a standalone Blender script not included in the TS build). `body-geometry.ts` attaches this n-gon data to the loaded `BufferGeometry`.
- `centerline/` — derives edge loops/edges/vertices/points from the body's n-gon data (`edge*.ts`, `vertices.ts`, `points.ts`), and builds the centerline that guides plane placement (`centerline.ts`).
- `plane/` — cross-section planes: `Plane`/`VerticalPlane`/`FreePlane`, managed by `PlaneManager` (the stateful, GUI-bound, JSON-serializable object equivalent to hair-bundle's `Tube`). Plane changes trigger the `_addCrossSection`/`_removeCrossSection`/`_updateCrossSection` callbacks wired in `main.ts`.
- `intersection/` — computes where a plane intersects the body mesh: `edge-intersection.ts`/`vertex-intersection.ts` → `intersection.ts` → `intersection-loop.ts`/`intersection-loops.ts` (filtered by `intersection-loop-picker.ts`).
- `area/` — `Area` (stateful, GUI-bound, JSON-serializable, equivalent to `Tube`/`PlaneManager`) holds the cross-section area. `cut.ts`/`extrude.ts`/`find.ts` implement the geometric calculations for the clothing shape, and `AreaGroup` is the renderable output.

`main.ts` connects `PlaneManager` and `Area` by binding `Area`'s cross-section-handling methods to `PlaneManager`'s `_addCrossSection`/`_removeCrossSection`/`_updateCrossSection` hooks — this is the boundary (connection point) between the plane subsystem and the area subsystem.

### Path aliases

Imports use absolute `src/...`-style paths (e.g. `import { createCamera } from "src/common/camera"`). This is enabled by `vite-tsconfig-paths` reading `baseUrl: "./"` from `tsconfig.json`. Use this style rather than relative paths (`../../`).

### Tests

Vitest runs in the happy-dom environment, and `test/` mirrors the structure of `src/` 1:1 (e.g. `src/hair-bundle/curve/curve.ts` → `test/hair-bundle/curve/curve.test.ts`). `mockReset: true` is set globally.

## Documentation

Feature guides and tutorials live in `doc/hair-bundle/` and `doc/tight-clothing/` (English, plus a Japanese `.jp.md` version). They are linked from `README.md`/`README.jp.md`. When changing user-facing behavior described there, update both language versions together.
