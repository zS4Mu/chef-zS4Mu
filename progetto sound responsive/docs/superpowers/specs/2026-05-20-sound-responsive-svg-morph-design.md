# Sound-Responsive SVG Morph: Zitto ↔ Parlato

## Overview

A web-based application that animates a face SVG between two states ("zitto" / silent and "parlato" / speaking) driven by real-time microphone input. The morph is a linear interpolation of SVG attributes (rect dimensions, path coordinates) controlled by an envelope follower on the audio RMS level.

## Architecture

Single-page application. No frameworks, no build step. Three modules in one `index.html`:

- **AudioLayer** — `getUserMedia` → `AudioContext` → `AnalyserNode` (FFT 1024). Computes RMS volume per frame and applies an envelope follower.
- **MorphEngine** — Stores start/end values for every animated SVG element. Computes `lerp(a, b, t)` per attribute each frame and applies it to the SVG DOM.
- **UI** — Renders the SVG and a control panel with sliders. Handles the invert-colors toggle.

Data flow per `requestAnimationFrame` frame:

```
Microphone → AnalyserNode → RMS → Envelope Follower → t ∈ [0,1] → MorphEngine → SVG attributes
```

## Animated Elements

### Mouth ("bocca")

| Element | Prop | Zitto | Parlato |
|---|---|---|---|
| Sfondo rettangolo (bocca bg) | height | 152.6 | 368.3 |
| 14 denti superiori (st0) | height | 57.9 | 122.5 |
| 14 denti inferiori (st0) | y | 753.9 | 894.2 |
| 14 denti inferiori (st0) | height | 51.1 | 121.1 |

X coordinates and widths are identical in both SVGs — no animation needed.

### Pupils (left + right)

Both pupils use SVG `<path>` with relative cubic Bézier commands (`c`). The zitto left pupil originally had an `s` (smooth cubic) which has been normalized to an explicit `c`. All four paths now share identical M + 4c + Z structure, enabling coordinate-by-coordinate linear interpolation.

**Left pupil — zitto:**
```
M 852.3,395.7 c -4,9.5 -25,8 -40.4,1.5 c -15.4,-6.5 -32.5,-25.5 -28.4,-35.1 c 4,-9.5 27.7,-5.9 43.1,0.6 c 15.4,6.5 29.7,23.5 25.7,33 Z
```

**Left pupil — parlato:**
```
M 850.9,399.1 c -8,18.7 -31.5,23.3 -46.9,16.8 c -15.4,-6.5 -28.4,-35.2 -20.4,-53.9 c 8,-18.7 33.9,-20.5 49.3,-14 c 15.4,6.5 26,32.4 18,51.1 Z
```

**Right pupil — zitto:**
```
M 1066.2,397 c 3.9,9.3 24.8,7.6 40.2,1.1 c 15.4,-6.5 32.6,-25.3 28.6,-34.6 c -3.9,-9.3 -27.6,-5.6 -42.9,1 c -15.4,6.5 -29.8,23.3 -25.9,32.5 Z
```

**Right pupil — parlato:**
```
M 1067.4,399.7 c 7.8,18.4 31.2,22.7 46.6,16.1 c 15.4,-6.5 28.5,-34.8 20.7,-53.2 c -7.8,-18.4 -33.7,-19.9 -49,-13.4 c -15.4,6.5 -26.1,32 -18.3,50.4 Z
```

## Color Palette

| Class | Normal | Negative | Used on |
|---|---|---|---|
| `.rosso` | `#db1d1e` | `#24e2e1` | Sfondo bocca, forme occhi |
| `.arancione` | `#dd731c` | `#228ce3` | Denti (sup+inf), pupille, centro naso |
| `.giallo` | `#dcc11e` | `#233ee1` | Sopracciglia, contorno naso |
| (body bg) | `#ffffff` | `#000000` | Sfondo pagina |

A toggle button swaps all CSS class color values between normal and negative palettes.

## Envelope Follower

```
attackRate  = 1 - exp(-1 / (attackMs / 1000 * 60))  // per frame at 60fps
releaseRate = 1 - exp(-1 / (releaseMs / 1000 * 60))

if volume > t:
  t += attackRate * (volume - t)
else:
  t += releaseRate * (volume - t)
```

Attack, release, and noise threshold are adjustable via UI sliders.

## User Interface

- Full-page white background, SVG centered and scaled to fit viewport
- Control panel below the SVG: 3 sliders (attack, release, threshold) + invert toggle button
- Volume level indicator (simple bar)
- Auto-starts on microphone permission grant — no extra buttons
- Invert toggle: switches all 3 color classes + body background between normal/negative

## Implementation Considerations

- **No dependencies** — vanilla JS, no Flubber.js or other libraries
- Path interpolation: parse normalized path strings into numeric arrays, lerp each number, rebuild path string via `.join(',')`
- Mouth interpolation: query all rect elements by position in DOM, iterate the static array of start/end values
- Performance: single rAF loop, batch all DOM writes, avoid layout thrashing
- Browser security: `getUserMedia` requires HTTPS or localhost

## Files

- `index.html` — single file, everything inline
- `svg/zitto.svg` — source (unchanged, data extracted at build time)
- `svg/parlato.svg` — source (unchanged, data extracted at build time)
