# Pulse Room 🌐

> **A personalized, voice-driven world awareness dashboard.**  
> Monitor live global events (earthquakes, wildfires, severe storms, ecological migrations, and sports expeditions) on an interactive 3D globe, replay the last 24 hours of telemetry, and converse with an AI voice agent (**Nova**) that answers aloud using real-time planetary data.

---

## ✨ Features

- **Interactive 3D Event Globe:** Orthographic sphere projection with topic-coded and severity-scaled marker pins, graticule grid, radar sweep, and manual drag rotation.
- **24-Hour Replay Time Scrubber:** Client-side time scrubbing (1h to 24h) over cached telemetry with zero unnecessary refetches.
- **Conversational AI Voice Agent (Nova):**
  - Tap-to-talk audio orb with responsive waveform visualizer.
  - Bidirectional voice with automatic browser speech synthesis and recognition.
  - Spoken answers kept under 20 seconds for voice clarity.
  - Real-time live transcript line always visible.
- **Fail-Soft Architecture:** Every external source (USGS, NASA EONET, World Monitor) is protected by fallback snapshots. The app **never displays an error wall**—instead showing a subtle *"showing last known data"* badge.
- **Zero-Network Demo Mode:** Out of the box, `VITE_DEMO_MODE=true` guarantees the app runs completely offline with **zero API keys and zero network connectivity**.
- **Autonomous Insights:** Automatically computes what changed in the last 24h (seismic spikes, wildfire thermal signatures, cyclonic storm tracks).
- **Accessible (WCAG 2.2 AA):** High contrast, full keyboard navigation, screen reader live regions (`aria-live="polite"`), and non-mouse list alternatives.

---

## 🛠 Tech Stack

- **UI Framework:** React 19 / 18 + TypeScript 5.7 (strict)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS + Design Tokens (Inter font, dark telemetry theme `#05080F`)
- **Server State & Ingestion:** TanStack Query v5 + `Promise.allSettled`
- **Client State:** Zustand
- **Validation:** Zod (runtime validation on all boundaries)
- **Icons:** Lucide React
- **Testing:** Vitest

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm ci

# 2. Run security check on environment variables
npm run check-env

# 3. Start development server (opens at http://localhost:5173)
npm run dev

# 4. Run automated test suite
npm run test

# 5. Production build
npm run build
```

---

## 📁 Repository Structure

```
pulse-room/
  ├── .github/workflows/    # CI quality gate, scheduled news fetch, lighthouse
  ├── docs/                 # Architecture, Runbook, ADRs, Update Log
  ├── public/data/          # Committed fallback snapshot.json and news.json
  ├── scripts/              # check-env.ts, build-snapshot.ts
  ├── src/
  │   ├── app/              # Application providers and entry point
  │   ├── components/       # PRESENTATIONAL ONLY (Atomic Design)
  │   │   ├── atoms/        # Button, Chip, Dot, Badge, Skeleton, Slider
  │   │   ├── molecules/    # TopicChip, StatTile, InsightCard, AreaRow, TickerItem
  │   │   ├── organisms/    # GlobeStage, VoiceDock, StoryCard, TopBar, BriefCard, Ticker
  │   │   └── templates/    # DashboardLayout
  │   ├── features/         # Domain logic and data fetching
  │   │   ├── events/       # Adapters (USGS, EONET, Snapshot), useEvents
  │   │   ├── insights/     # Pure insight computation rules
  │   │   ├── news/         # Topic registry, news feeds
  │   │   └── voice/        # Browser voice engine, useVoiceSession
  │   ├── config/           # Zod validated env, flags, constants
  │   ├── lib/              # HTTP client, sanitizer, time helpers, logger
  │   └── styles/           # tokens.css, globals.css
  ├── firestore.rules       # Production Firestore security rules
  ├── .env.demo             # Committed demo environment (zero secrets)
  └── UPDATE_LOG.md         # Detailed milestone & Git activity changelog
```

---

## 📜 Documentation

- [Architecture & Design System](docs/architecture.md)
- [Operations & Runbook](docs/runbook.md)
- [Update & Git Activity Log](UPDATE_LOG.md)
- [ADR 001: Scaffolding and Demo Mode](docs/adr/001-project-scaffolding-and-demo-mode.md)
- [ADR 002: Atomic and Feature Boundaries](docs/adr/002-atomic-and-feature-sliced-boundaries.md)
