# ADR 002: Atomic Presentational Components & Feature-Sliced Logic

## Context
Codebases that intermingle data fetching inside UI components suffer from tight coupling, high test complexity, and brittle refactoring.

## Decision
1. All visual components in `src/components/` (atoms, molecules, organisms, templates) are **strictly presentational** and receive data and callbacks via props.
2. All business logic, polling, normalization, and hooks reside in `src/features/<domain>/` and export through a unified `index.ts`.
3. Inter-feature deep imports are forbidden and validated in CI via `dependency-cruiser`.

## Consequences
- Testing organisms like `StoryCard`, `VoiceDock`, and `GlobeStage` requires simple prop mocks without mocking network layers.
- New data sources can be plugged in by adding an adapter file without modifying presentational UI code.
