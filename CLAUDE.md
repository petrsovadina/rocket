# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rocket is an AI-powered search engine with generative UI, forked from [Morphic](https://github.com/miurla/morphic). It streams React components as search results using Vercel AI SDK's RSC (React Server Components) pattern. The UI is in Czech.

## Commands

- `npm run dev` — Start dev server (Next.js with Turbo)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run start` — Start production server

No test framework is configured.

## Architecture

### Core Flow: Server Actions + Generative UI

All AI logic runs through a single server action `submit()` in `app/actions.tsx`. There are no API routes. The flow:

1. User submits query → `submit()` server action called
2. `taskManager` decides: clarify (inquire) or proceed (search)
3. If inquire → `inquire` agent generates clarification form
4. If proceed → `researcher` agent calls tools (search, retrieve, videoSearch) and streams results as React components
5. If `USE_SPECIFIC_API_FOR_WRITER=true` → `writer` agent generates final answer using a separate model
6. `querySuggestor` generates related queries
7. Chat saved to Redis via `saveChat()`

Key concept: **UIState contains React components, AIState contains serializable messages.** The `createAI()` wrapper in `app/actions.tsx` manages both. `onSetAIState` persists to Redis on completion.

### LLM Provider Priority (`lib/utils/index.ts`)

`getModel()` selects provider in this order:
1. **Groq** (`GROQ_API_KEY`) — uses OpenAI-compatible client, default model `llama-3.3-70b-versatile`
2. **Ollama** (`OLLAMA_MODEL` + `OLLAMA_BASE_URL`) — local models
3. **Google Gemini** (`GOOGLE_GENERATIVE_AI_API_KEY`) — `gemini-1.5-pro-latest`
4. **Anthropic** (`ANTHROPIC_API_KEY`) — `claude-3-5-sonnet-20240620`
5. **OpenAI** (fallback) — default `gpt-4o`

The writer agent (`lib/agents/writer.tsx`) can use a separate provider via `SPECIFIC_API_BASE/KEY/MODEL` env vars when `USE_SPECIFIC_API_FOR_WRITER=true`.

### Agents (`lib/agents/`)

- `task-manager.tsx` — Decides inquire vs proceed (uses `generateObject` with Zod schema)
- `inquire.tsx` — Generates clarification questions
- `researcher.tsx` — Main agent, calls tools and streams results
- `writer.tsx` — Generates final answer (optional, separate model)
- `query-suggestor.tsx` — Generates related queries

### Tools (`lib/agents/tools/`)

- `search.tsx` — Tavily API (or Exa) for web search
- `retrieve.tsx` — Jina Reader API for URL content extraction
- `video-search.tsx` — Serper API for video search (optional, needs `SERPER_API_KEY`)

### Authentication

Clerk (`@clerk/nextjs`) with middleware in `middleware.ts`. Public routes: `/`, `/sign-in`, `/sign-up`. All other routes are protected. Anonymous users get one free query before being prompted to sign in.

### State Management

- **AI State** (server): `createAI()` from `ai/rsc` — chat messages, chatId
- **UI State** (client): Streamed React components
- **App State**: `AppStateContext` in `lib/utils/app-state.tsx` — tracks `isGenerating`
- **Persistence**: Upstash Redis for chat history

### Key Directories

- `app/` — Next.js App Router pages and the main `actions.tsx` server action
- `lib/agents/` — AI agent implementations
- `lib/agents/tools/` — Tool implementations (search, retrieve, video)
- `lib/actions/chat.ts` — Redis chat persistence
- `lib/types/` — TypeScript types including `AIMessage`
- `lib/schema/` — Zod schemas for agent outputs
- `components/` — React components (mix of server and client)
- `components/ui/` — shadcn/ui base components

## Code Style

- No semicolons, single quotes (Prettier defaults in the project)
- Path alias: `@/*` maps to project root
- shadcn/ui for UI components with Radix primitives
- `cn()` utility from `lib/utils` for Tailwind class merging

## Environment Variables

Required: `OPENAI_API_KEY` (or another provider key), `TAVILY_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

See `.env.example` for the full list of optional provider keys and configuration.
