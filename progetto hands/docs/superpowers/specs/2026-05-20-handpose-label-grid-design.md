# HandPose Label Grid — Design Doc

## Overview
Single-page web application that uses TensorFlow.js HandPose detection to render real-time hand skeleton projections on a black background, replacing standard landmark names with customizable alphanumeric grid labels.

## Architecture
- **Single file**: `index.html` with inline HTML, CSS, and JavaScript
- **No build tools**: all dependencies loaded via CDN `<script>` tags
- **Rendering**: HTML5 Canvas 2D

## Dependencies (CDN)
- `@tensorflow/tfjs-core`, `@tensorflow/tfjs-converter`, `@tensorflow/tfjs-backend-webgl`
- `@mediapipe/hands`
- `@tensorflow-models/hand-pose-detection`

## Layout
- Fullscreen black background (`#000`)
- `<canvas>` covering the entire viewport
- `<video>` element (hidden) for webcam stream input

## Flow
1. Page load → `navigator.mediaDevices.getUserMedia()` requests camera permission
2. On permission grant → start hidden video stream
3. Initialize `handPoseDetection.createDetector()` with:
   - `model`: `SupportedModels.MediaPipeHands`
   - `runtime`: `'mediapipe'`
   - `modelType`: `'full'`
4. `requestAnimationFrame` loop:
   - Call `detector.estimateHands(video)`
   - Clear canvas to black
   - For each detected hand:
     - Draw skeleton lines between connected landmarks
     - Draw alphanumeric label at each landmark position
   - Loop

## Label Configuration
Labels are defined in a configurable JS object mapping landmark names to grid strings:

```
wrist:              'A1'
thumb_cmc:          'A2'
thumb_mcp:          'B1'
thumb_ip:           'C1'
thumb_tip:          'E1'
index_finger_mcp:   'B2'
index_finger_pip:   'C2'
index_finger_dip:   'D2'
index_finger_tip:   'E2'
middle_finger_mcp:  'B3'
middle_finger_pip:  'C3'
middle_finger_dip:  'D3'
middle_finger_tip:  'E3'
ring_finger_mcp:    'B4'
ring_finger_pip:    'C4'
ring_finger_dip:    'D4'
ring_finger_tip:    'E4'
pinky_finger_mcp:   'B5'
pinky_finger_pip:   'C5'
pinky_finger_dip:   'D5'
pinky_finger_tip:   'E5'
```

Users can modify these values directly in the source.

## Grid Mapping (visual)

```
        Pollice Indice  Medio   Anulare Mignolo
TIP     E1      E2      E3      E4      E5
DIP     -       D2      D3      D4      D5
PIP     C1      C2      C3      C4      C5
MCP     B1      B2      B3      B4      B5
BASE    A1 (wrist)  A2 (CMC pollice)
```

## Visual Style
- **Background**: `#000` (black)
- **Skeleton lines**: white (`#ffffff`), semi-transparent
- **Labels**: white (`#ffffff`), small monospace font, centered on landmark position
- **Both hands**: same color (white), no handedness differentiation

## Skeleton Connections
Standard MediaPipe hand connections (21 landmarks, ~20 connections):

- Thumb: CMC→MCP→IP→TIP
- Each finger: MCP→PIP→DIP→TIP
- Palm: wrist→each MCP, MCP→adjacent MCP

## Error Handling
- Camera permission denied → show fallback message on canvas
- Detector initialization failure → show error on canvas
- No hands detected → empty black canvas (continue looping)

## Constraints
- Requires browser with WebGL support
- Requires camera access
- Internet connection required for CDN scripts
