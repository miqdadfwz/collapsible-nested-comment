# Collapsable Nested Comments

This project implements a simple nested comment system. Users can write comments with rich text formatting, reply to existing comments, and collapse/expand comment threads.

[Live Demo](https://collapsible-nested-comments.netlify.app/)

## Tech Stack

- React 19
- TypeScript
- Vite for bundling
- Mantine UI for the component library
- TipTap for rich text editing
- Zustand for state management
- TanStack Router for type-safe routes
- Vitest & Playwright for testing

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm (v10)

### Getting Started

Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd comment-app
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

This will run the app on http://localhost:3000

If you're building for prod:

```bash
pnpm build
pnpm preview
```

## Running Tests

We have both unit and E2E tests:

```bash
# For unit tests
pnpm test

# For E2E tests (make sure to install browsers first time)
pnpm exec playwright install --with-deps
pnpm test:e2e

# To watch the E2E tests run
pnpm test:e2e
```

## Project Structure

We're using a [feature sliced design architecture](https://feature-sliced.github.io/documentation/):

- `src/app` - Core app and store managment
- `src/entities` - Data models (User, Comment, and Post)
- `src/features` - Main functionality broken down by feature
- `src/pages` - Route components
- `src/shared` - Common components and utilities


## Development Workflow

To keep code clean:

```bash
# Run linting
pnpm lint
```

We've set up GitHub Actions to run tests automatically on PRs and merges to main.
