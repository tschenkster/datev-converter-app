# Project Instructions

## Project Overview

**AI Data Transformer** — Multi-tenant SaaS for accounting data processing: trial balance imports, chart of accounts translation, report structure management, and multi-language support.

Restored from old Supabase project `ylynmzpikmkwwvmytfsg` (paused/deleted). Database restored from cluster dump dated October 6, 2025. Migration to new project complete — all code references updated.

## Architecture

**Frontend:** React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
**Backend:** Python FastAPI + Docling (PDF/document processing) + pandas
**Database:** Supabase PostgreSQL 15 (eu-west-1, Ireland)
**Edge Functions:** 21 Deno/TypeScript functions (translation, file processing, maintenance)
**Auth:** Supabase Auth with RBAC (user_accounts + user_roles + user_entity_access)

## Supabase

New project ref: `kzutwcexyafwggfkwquq` (eu-west-1). Connection string in `.env` as `SUPABASE_DB_DIRECT_URL`.

**Connection note:** Direct connection (`db.*.supabase.co`) is IPv6-only. On IPv4 networks, use the session pooler: `aws-1-eu-west-1.pooler.supabase.com:5432`.

**Auth note:** `auth.users` was NOT part of the database restore. Users must be created manually in the Supabase Authentication dashboard. After creating an auth user, update `user_accounts.supabase_user_uuid` to match the new UUID. Current user: `thomas@cfo-team.de` (UUID `0a2cbc7d-f839-4343-97f0-9593667dead8`).

### Schemas
- **public** — App logic: entities, report structures, translations, user management (16 tables)
- **data** — Raw uploads: trial_balance_uploads, raw_data_upload_file/rows (3 tables)
- **reporting** — Empty (future use)

### Key Tables
| Table | Purpose |
|-------|---------|
| `entities` | Companies/organizations |
| `entity_groups` | Entity hierarchies |
| `user_accounts` | User profiles (linked to auth.users) |
| `user_roles` | RBAC role assignments |
| `user_entity_access` | Multi-tenant access control |
| `report_structures` | Report templates (versioned) |
| `report_line_items` | Report line definitions (hierarchical) |
| `report_line_items_translations` | Multi-language report labels |
| `coa_translation_sessions` | Chart of accounts translation history |
| `system_languages` | Supported languages |
| `ui_translations` | UI text translations |
| `data.trial_balance_uploads` | File upload tracking |
| `data.raw_data_upload_file` | Raw file metadata |
| `data.raw_data_upload_file_rows` | Raw file row data |

## Security

**Never embed passwords, API keys, or tokens.** All credentials in `.env` files.

- `.env` — Frontend: `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `SUPABASE_DB_DIRECT_URL`
- `python-service/.env` — Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

RLS enabled on all 19 user tables with 67 policies. Auth uses `auth.uid()` and role-based checks.

## Running Locally

**Frontend:**
```bash
npm install --legacy-peer-deps && npm run dev
```
Note: `--legacy-peer-deps` required due to eslint-plugin-unicorn peer dep conflict.

**Python service:**
```bash
cd python-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Testing

- **Runner:** Vitest (`npm test` / `npm run test:watch`) for frontend; pytest for Python service
- **Convention:** `*.test.ts(x)` files colocated next to source files
- **Workflow:** Issue-driven — when fixing a bug, ALWAYS write a failing test that reproduces the bug first, then fix the code so the test passes
- **Agent responsibility:** The coding agent writes all tests. The user describes the problem; the agent writes the reproduction test + fix.
- **Before marking a bug fix complete:** `npm test` must pass
- **Every test must have a comment** explaining which bug/issue it was written for
- **When deleting or rewriting a feature:** delete its tests too — no orphaned tests
- **No "just in case" tests** — only test what actually broke

## Deployment

**Vercel:** https://datev-converter-2026.vercel.app
Auto-deploys from GitHub repo `tschenkster/datev-converter-2026` on push to `main`.

- Git remote `vercel-deploy` points to the deployment repo
- Original repo (`tschenkster/datev-converter-app`) is unchanged — do not push there
- Env vars set in Vercel dashboard: `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`
- `vercel.json` — SPA rewrite rules (React Router support)
- `.npmrc` — `legacy-peer-deps=true` for clean installs on Vercel

## Database Restore

Restore SQL files are in `sql/` directory. Run `restore.sh` with `SUPABASE_DB_DIRECT_URL` set in `.env`.
Auth triggers (`sql/10-auth-triggers.sql`) must be run manually via Supabase SQL Editor.

See `docs/docs_database_DATABASE-STRUCTURE_20250924_v04.md` for full schema documentation.

## Migrations

304 migration files in `supabase/migrations/` (July-September 2025). Not yet registered in `supabase_migrations.schema_migrations` — need to link project via CLI and seed migration history before running new migrations.

## Common Tasks

### Add a New Table to `public` Schema

1. Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_add_<table_name>.sql`
2. Follow naming rules: plural noun, ASCII snake_case, include `created_at`/`updated_at`
3. Add `entity_id` FK if client-scoped, RLS policy if user-facing
4. Apply migration: `npx supabase db push`

### Add a New Edge Function

1. Create file: `supabase/functions/<function-name>/index.ts`
2. Configure imports in `deno.json`
3. Deploy: `npx supabase functions deploy <function-name>`

### Restore from Cluster Dump

1. Set `SUPABASE_DB_DIRECT_URL` in `.env`
2. Run `restore.sh` (handles schema + data)
3. Manually run `sql/10-auth-triggers.sql` in Supabase SQL Editor (needs supabase_admin)
4. Create auth user in Supabase dashboard, update `user_accounts.supabase_user_uuid`

## Pending

- [ ] Run `sql/10-auth-triggers.sql` in Supabase SQL Editor (triggers on auth.users need supabase_admin)
- [ ] Deploy 21 edge functions (`npx supabase link && npx supabase functions deploy`)
- [ ] Create `python-service/.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Register 304 migrations as applied in `supabase_migrations.schema_migrations`
- [x] Update all code references from old Supabase project (`ylynmzpikmkwwvmytfsg`) to new (`kzutwcexyafwggfkwquq`)
- [x] Remove `.env` from git tracking (now `.gitignore`-only)


## Claude Memory Sync

Claude Code's hidden internal memory (`~/.claude/projects/`) is automatically synced to the `35-knowledge/claude-memory/` directory at the root of the main Claude Workspace.

**ATTENTION ALL AI AGENTS:**
- **Google Antigravity, OpenAI Codex, & Other Agents**: You MUST read `/Users/thomas/Library/CloudStorage/GoogleDrive-thomas@cfo-team.de/My Drive/Claude Workspace /35-knowledge/claude-memory/workspace_MEMORY.md` when starting tasks to gather context on established rules.
- **Claude Code**: You MUST COMPLETELY IGNORE the `35-knowledge/claude-memory/` directory. It is a mirror of your own internal memory. Rely exclusively on your native `~/.claude/projects/` memory to prevent infinite loops and memory bloat.
