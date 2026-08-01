# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SemafoR steers physical KLUBA model railway semaphores (LEDs) through an Arduino + PCA9685 PWM board, using the Johnny-Five robotics platform. The repo has two independently-run programs:

- **Steering server** (`server.js` → `semaphore.js`) — a NodeJS/Express/Johnny-Five program that talks to the Arduino over serial, drives LED brightness/pulse/fade effects, and exposes an HTTP API to set semaphore signals.
- **UI** (`src/`) — a Create React App (via `react-app-rewired`) front end that renders semaphores visually and calls the steering server's HTTP API to change signals.

The UI and steering server are separate processes that must both be running; the UI is just an HTTP client of the steering server (see `semaphoreSteeringUri` in `src/common/semaphoreConfig.js`, default `http://localhost:4000`).

## Commands

Package manager is **yarn** (yarn.lock is committed; husky hooks call `yarn`), though `npm install` also works per the README.

```
node server                # start the steering server (talks to Arduino, port 4000)
yarn start                 # start the React UI (react-app-rewired, port 3000)
yarn build                 # production build of the UI
yarn test                  # run CRA/Jest tests
yarn lint                  # eslint src/**/*.{js,jsx} *.js
yarn lint-fix               # eslint with --fix
yarn lint-css               # stylelint src/**/*.scss src/*.scss
yarn lint-css-fix            # stylelint with --fix
yarn pretty-quick           # prettier on staged files
```

There is no dedicated "run a single test" script; use `yarn test` (CRA's Jest watcher) with a `-t` pattern or `--testPathPattern` as needed.

The steering server requires real hardware (Arduino connected via serial + PCA9685 boards + semaphores wired up) to actually reach the `board.on('ready', ...)` callback in `semaphore.js` — without a connected board it will not start listening. Keep this in mind when testing changes to `semaphore.js`; most of its logic can only be exercised with hardware attached.

A **pre-commit hook** (`.husky/pre-commit`) runs `pretty-quick --staged`, `lint`, and `lint-css` — code must pass these before committing.

## Architecture

### Configuration is the source of truth

`src/common/semaphoreConfig.js` is the single place that defines the physical setup and is imported by *both* programs (the steering server via the ES-module shim in `server.js`, and the UI directly):

- `boardPCA9685Addresses` — I2C addresses of each PCA9685 board in the circuit.
- `semaphoresLedConfiguration` — a function `(defineLedPin) => [...]` producing one object per physical semaphore, mapping signal-light names (`GREEN`, `ORANGE_ONE`, `RED`, `ORANGE_TWO`, `WHITE`, `BLUE`, `ORANGE`, etc.) to pins. `defineLedPin` is injected by the caller because the steering server needs real Johnny-Five `Led.RGB` instances while other contexts don't.
- `semaphoresGeneralConfiguration` — parallel array (same order/index as `semaphoresLedConfiguration`) describing each semaphore's `type` (from `semaphoreTypes.enum.js`), `number`, default `signal` (from `signals.enum.js`), and optional display `label`.

Two arrays are correlated **by array index**, not by an explicit key — order matters and must stay in sync. `src/common/predefined/` holds example alternate configs the README says can be swapped in by renaming to `semaphoreConfig.js`.

There are 10 semaphore types (`semaphoreTypes.enum.js`), each with a fixed set of physical LED chambers and a fixed subset of valid signals (`signals.enum.js`) — e.g. `Sm` (5 chambers) supports signals S1–S13/SZ/MS2/OFF, `To` (2 chambers) supports OS1–OS4/OFF, `Tm` (2 chambers) supports MS1/MS2/OFF. The valid-signal-per-type mapping is duplicated in two places that must be kept consistent:
- `src/App.js` (`semaphoresXGroup` JSX blocks + `getCorrectSemaphoresGroup` switch) — which signal buttons to show for the selected semaphore type.
- `src/semaphore.js`'s `signalDefinitionsForXSemaphore` objects — which LED-state visuals to render for each signal.
- `semaphore.js` (root, the steering server) — `setSignalXX` functions + `routingSignals` — which physical LED effect to run for each signal, per type's chamber layout.

### Steering server request flow (`semaphore.js`)

1. On `board.on('ready')`, builds real LED objects from `semaphoresLedConfiguration`, then calls `setInitialSignals()` to push each semaphore's configured default signal.
2. Exposes `GET /:semaphore/:signal` (e.g. `/Sm1/S3`), CORS-enabled. `semaphore` is `${type}${number}` (see `semaphoreRouteName`); `signal` is matched case-insensitively against `signals.enum.js`.
3. Each `setSignalXX(semaphore)` function declares which LEDs get which effect (`fadeInComplex` for a steady fade-to-on, `pulseComplex` for a blinking/pulsing effect) and which LED pins should stay on vs. be turned off, then calls `generateSignal` to dedupe redundant requests (`isSignalSet`) and stop/restart the relevant `setInterval` loops (`stopAllLoops`, tracked in the module-level `loopInstances`/`ledsStatus`/`currentSignals` arrays).
4. LED effects (`fadeIn`, `fadeOut`, `pulse`, `pulseFromOn`) are hand-rolled `setInterval` brightness ramps tuned per color via `ledsMaxBrightness` and `ledsEffectConfig` — these two objects are tightly coupled (a max-brightness change usually needs a matching effect-timing tweak) and control how closely the LED brightness mimics the real 12V-powered semaphore's look at Arduino's 5V supply.

Note `semaphore.js` uses ES module `import` syntax but is loaded through `server.js`'s `esm` package shim (`require = require('esm')(module)`), not compiled — don't add build-step-dependent syntax here.

### UI (`src/`)

- `App.js` owns top-level state: `semaphoresSignal` (current signal per configured semaphore) and `selectedSemaphore`. On mount it POSTs (GET, actually) each semaphore's default signal to the steering server. Clicking a signal button calls the steering server via `fetch` and updates local state optimistically (no response-driven state sync).
- Component tree: `App` → `ConnectedSemaphore` (one per configured physical semaphore, clickable to select it) and `Semaphore` (renders the signal-light stack for whichever semaphore/signal is currently being shown — reused both for the small "connected semaphores" preview row and the large signal-picker grid for the selected semaphore's type).
- `Semaphore.jsx` is intentionally a big lookup table (`signalDefinitionsForXSemaphore` per type) mapping each valid signal to a fixed stack of `Signal` (individual light image) + `Pole` (semaphore post graphic) + `SignalLabel` elements — this mirrors the physical chamber layout described in the README for each type.
- `signalLights.enum.js` enumerates the individual light-image states (`RED_UP_SOLID`, `GREEN_MIDDLE_BLINKING`, etc.) consumed by `Signal.jsx`.

### Adding a new semaphore type or signal

Changing what physical semaphores exist requires editing `src/common/semaphoreConfig.js` only (see README's "How to add a new semaphore definition" section for the exact array shapes). Adding a *new signal or type* to the system, however, touches all three duplicated mappings above (`App.js`, `Semaphore.jsx`, root `semaphore.js`) plus the relevant enum(s).
