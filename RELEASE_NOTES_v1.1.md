# Toko v1.1 — Release Notes (DRAFT)

_Coming from v1.0.1._

This release focuses on **reliability and robustness**. The canvas resize and layout system was rewritten, the internal logging was simplified, and the library now handles bad input and missing dependencies gracefully instead of breaking. Lifecycle cleanup is thorough enough that sketches can be created and removed repeatedly without leaking listeners. All changes are in `/src` unless noted.

## Canvas & layout

- **Resizing now keeps the canvas proportional** when the window changes, and works consistently across all variants — including Q5, which wraps the canvas differently than p5.
- **Resizing actually re-renders the sketch** again, so `noLoop()` and static P2D sketches redraw at the new size instead of going stale.
- Reintroduced **full-window mode** and reworked how the sketch and parameter panel share the layout.
- Canvas setup validates its size and window inputs and fails clearly rather than producing a broken canvas.

## Reliability & error handling

- **Graceful handling of invalid input** across grids, the image loader, the quadtree, the RNG, color helpers, and pixel utilities — bad or out-of-range values are rejected with a clear message instead of crashing or silently corrupting output.
- **More reliable initialization** — random and RNG-backed functions give an explicit, actionable error when used before `toko.init()`, and duplicate initialization is prevented.
- **Missing dependencies no longer break the library** — capture, canvas save, WebGPU, and SVG/image loading degrade gracefully when the underlying library or element isn't present.
- **The image loader no longer hangs** when an asset fails to load.
- Fixed a window-resize bug and a Q5 canvas scaling issue.

## Lifecycle & cleanup

- Removing a sketch now **tears down everything the wrapper attached** — resize listeners, keyboard shortcuts, and file-drop handlers — so repeated setup/teardown is clean.
- Keyboard shortcuts for the parameter panel (**P**) and FPS counter (**F**) no longer overwrite each other.

## Color system

- New public helpers to **list all palettes and collections** (`getAllPalettes()`, `getCollections()`), plus a new page showcasing every palette (outside `/src`).
- Color functions no longer depend on p5 globals, so they work in more contexts.
- Removed a duplicate palette and stopped mutating shared default options.

## Parameter panel (Tweakpane)

- The panel now lives in a **dedicated container** and is fully skipped when disabled.
- **Smooth show/hide transition**, driven by a CSS class rather than inline styles.
- Fixed the palette and split-type controls.

## Render modes

- **More reliable render-mode initialization**, and `tokoWrapper.renderMode` now resolves to the real renderer constant so it can be passed straight into `createCanvas()` (works with p5 extensions like p5.svg).

## Logging

- Removed the custom logging system in favor of standard console output, with debug messages behind a single opt-in flag — less indirection, clearer output.

## Examples

- **New "no-wrapper" examples** (p5v1, p5v2, Q5) showing how to use the Toko library directly, without TokoWrapper.
- All examples updated for the new parameter-panel container and switched to the minified p5.capture build.

## Dependency updates (`/assets`)

- **p5.js**: 2.1.1 → **2.3.1** (adds a WebGPU build)
- **q5.js**: 3.6.0 → **4.7.0**
- **p5.capture**: → **1.6.1**
