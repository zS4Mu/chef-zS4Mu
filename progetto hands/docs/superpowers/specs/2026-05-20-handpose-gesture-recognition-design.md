# HandPose Gesture Recognition — Design Doc

## Overview
Extend the existing HandPose Label Grid app with customizable gesture-to-letter recognition. Users register hand gestures by clicking a letter in an on-screen alphabet table, holding the gesture through a countdown, and the system then recognizes that gesture in real-time using Nearest Neighbor matching.

## Architecture
- Same single-file structure: `index.html` (all inline)
- New components added alongside existing skeleton/label rendering:
  - Alphabet table (top-right)
  - Gesture template store (in-memory)
  - Recording controller (countdown + capture)
  - Recognition engine (Nearest Neighbor)
- Templates reset on every page refresh

## States
- **Normal** — skeleton + labels rendered, recognition active, alphabet table visible
- **Recording** — triggered by clicking an unregistered letter; shows countdown overlay; pauses recognition; captures gesture on completion

## Alphabet Table
- **Position**: top-right corner of canvas
- **Layout**: grid of 26 uppercase letters (A-Z), approx 6-7 columns
- **States**:
  - `#555` (gray) — not yet registered
  - `#fff` (white) — registered template exists
  - `#00ffcc` (cyan glow) — currently being recognized

## Gesture Template
Data structure stored in-memory:
```js
{
  letter: 'A',
  right: [{ x, y }, ...],   // 21 normalized landmarks for right hand
  left: [{ x, y }, ...]     // 21 normalized landmarks for left hand
}
```

### Normalization
Each hand is normalized independently:
1. Origin = wrist (keypoint[0])
2. Subtract wrist x,y from all keypoints
3. Scale by max bounding box dimension of the hand

This makes templates invariant to hand position and distance.

## Registration Flow
1. User clicks unregistered letter in alphabet table
2. Countdown "3... 2... 1..." rendered on canvas center
3. After countdown, current landmarks of both hands are captured and normalized
4. Template stored in memory
5. Letter turns white in table

## Recognition Flow
1. Each frame: normalize current landmarks for each visible hand
2. Compare against all registered templates using Euclidean distance
3. Distance = average of per-hand distances (if both hands visible)
4. If template uses 2 hands but only 1 visible → skip
5. Find template with minimum distance
6. If distance below threshold → candidate letter found
7. Require 5 consecutive frames same letter → confirm recognition
8. Confirmed letter: glows cyan in table + on-screen notification

## Notification
- Brief overlay showing recognized letter (e.g., "A")
- Appears center-bottom of canvas
- Auto-fades after 1.5 seconds

## Existing Features (unchanged)
- Skeleton rendering with white lines
- Grid labels (A1-E5) on each landmark
- Right hand cyan (#00ccff), Left hand green (#00ff66)
- Tag "D" / "S" near wrist
- Black background, fullscreen canvas

## Stability
- No flickering: require 5 consecutive same-letter matches before displaying
- No false positives: distance threshold prevents random matches
