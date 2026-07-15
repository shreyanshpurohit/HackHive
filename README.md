# HackHive 🐝

Welcome to **HackHive**, a Hack Club node for teenage builders in Delhi. This is the code for the website.

## How it Works Under the Hood

The site is built with React, Vite, Tailwind CSS, and Framer Motion. Here’s a quick look at the cool frontend mechanics:

### 1. The Scroll Zoom Transition
When you first scroll, the HackHive logo zooms in and fades out to transition into the main content. We do this by mapping the scroll position directly to the scale and opacity:
```tsx
const { scrollY } = useScroll();
const textScale = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 25]);
const textOpacity = useTransform(scrollY, [scrollLimit * 0.3, scrollLimit * 0.8], [1, 0]);
```
- Once the scroll reaches `scrollLimit`, a direct CSS `display: none` style mapping is triggered. This completely hides the intro overlays so the browser stops rendering invisible elements and stops wasting CPU/GPU resources.

### 2. Flicker-Free Background Orbits
The solar system orbits in the background scale down and rotate dynamically.
* To prevent rendering glitches and flickering (common when nesting transforms in Chrome/Safari), we use **compositor-thread CSS keyframe animations** for the rotation instead of Framer Motion JS loops:
  ```css
  @keyframes rotate-clockwise {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  ```
* All glow and shadow effects are rendered using hardware-accelerated **radial gradients** rather than heavy SVG/CSS blur filters.

### 3. Spatial-Hash Constellations Canvas
Behind everything is a interactive particle grid (`components/Constellations.tsx`). It uses a 2D spatial-hashing grid to bucket particles into local cells, ensuring distance checks between particles run in $O(N)$ time instead of a costly $O(N^2)$ loop. This keeps it at a locked 60fps on mobile.

---

## Local Setup

Bring your own tools, clone, and run:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```
