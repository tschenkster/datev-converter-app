End-of-session wrap-up. Run all steps below in order.

## Step 1: Run Tests

- Run `npm test` to verify all existing tests still pass.
- If tests fail, fix the failures before proceeding. Do NOT commit with failing tests.
- If no tests exist yet (empty test suite), note it and move on.

## Step 2: Commit and push the git repos touched this session

**Pre-authorized** by invoking `/wrap-up` — do not ask for confirmation.

Do not sweep the whole workspace. Commit only the repos that were actually touched in this session.

1. **List the files you edited** this session (Write, Edit, `apply_migration` that wrote local migration files, new source folders, etc.). Do NOT include files that were only read.
2. **Resolve each file's git repo root** with `git -C <dir> rev-parse --show-toplevel 2>/dev/null`. Skip files that error (not in a git repo — e.g. `~/.claude/` memory writes, the Google-Drive workspace root). Collect the unique set of repo roots.
3. **For each repo in that set:**
   - `git -C <repo> status` + `git -C <repo> diff` + `git -C <repo> log -1 --oneline` — sanity check.
   - **Stage only the files YOU edited this session.** Never `git add -A` / `git add .` — a linter or the user may have modified unrelated files and those aren't yours to commit.
   - **Do NOT stage:** `.env*`, `*.pem`, `*.key`, `credentials.json`, files whose name or content contains `service_role`, `sb_secret_`, or `SUPABASE_SERVICE_ROLE_KEY`, or any binary > 10 MB. If a staged file trips this filter on review, `git restore --staged` it and flag to the user.
   - **Commit via HEREDOC** with a concise message summarising this session's changes to that repo. Include:
     ```
     Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
     ```
   - `git -C <repo> push` on the current branch. **Never** `--force`, `--no-verify`, or `--no-gpg-sign`.

**On push failure** (protected branch, non-fast-forward, pre-commit hook): stop that repo, report it in the final summary, continue to the next. Do not retry. Do not force-push.

**Never commit:** the workspace root itself (Google-Drive-synced, not a git repo) or anything under `~/.claude/`.

## Step 3: Deploy to Vercel (if applicable)

- Check if this project has a `vercel.json` or `.vercel/` directory.
- If not, skip — say "Deploy: not a Vercel project" and move on.
- Check the project's AGENTS.md for deployment method:
  - If **auto-deploy from GitHub** is configured, say "Deploy: auto-deploys on push — no action needed" and move on.
  - If **manual CLI deploy**, run `vercel --yes --prod`.
- If the deploy fails, stop and tell the user — do NOT retry automatically.

## Step 4: Update Tracker (if useful)

- Read `_tracker.md` and review what was done this session (from the commits and git log).
- **Move completed items** from "Next" to "Done" with today's date. **Add new items** discovered this session to "Next" or "Ideas". **Reprioritize "Next"** if the session changed what matters most.
- **Entry style — match a git commit subject line:** one line, under ~80 characters, imperative or past-tense, no multi-sentence explanations, no "Verified: ..." tails, no architecture context. If it wouldn't fit on `git log --oneline`, it's too long.
  - Good: `- [x] 2026-04-21: Add SSO login flow to triage app`
  - Good: `- [x] 2026-04-21: Fix Cloud Run 502 cold-start on /classify`
  - Bad: `- [x] Email Triage v1 — M1 auth hardening: App-layer auth via Supabase /auth/v1/user introspection in _shared/verify-token.js, wired checkAuth() into 3 Cloud Run handlers, PGPASSWORD moved to Secret Manager. Verified: invalid token → 401. (2026-04-21)`
- If a change genuinely needs longer context, write it to memory or the commit message — the tracker is a changelog, not a narrative.
- **Size cap ~100 lines.** Before adding new entries, `wc -l _tracker.md`. If over 100, collapse older multi-line Done entries to one-liners (or fold pure-scaffolding entries into a single "Project scaffolding (YYYY-MM-DD)" line) until back under the cap. Do not delete history — `git log` is the durable record.
- **Skip** if nothing in the plan changed. Say "Tracker: no update needed" and move on.

## Step 5: Update PRD (if useful)

- Read `_prd.md` and check `git log --oneline -10` to see what changed this session.
- **Only update** if there were substantive changes worth reflecting in the PRD:
  - Phase status changed (e.g., a phase completed)
  - New features or capabilities added
  - Architecture decisions that affect the spec
  - Version bump warranted
- **Skip** for routine bug fixes, style tweaks, or minor refactors. Say "PRD: no update needed" and move on.

## Step 6: Update AGENTS.md (if useful)

- Read `AGENTS.md` at the project root.
- **Only update** if:
  - A new workflow, command, or tool was added that other agents need to know about
  - Project structure changed (new folders, renamed paths)
  - A rule was established that applies to ALL coding agents, not just Claude
- **Skip** for most sessions. Say "AGENTS.md: no update needed" and move on.

## Step 7: Review Session & Update Memory

- **Always run this step.** Review the full conversation for learnings before deciding whether to write.
- Look for:
  - User corrections ("no, do it this way") - these are feedback memories
  - Confirmed approaches the user validated - also feedback memories
  - New tools, projects, or conventions established - user/project memories
  - Non-obvious gotchas that will recur - project/reference memories
  - **Process / order-of-operations lessons** — was there a check, search, or tool ("look at the bug tracker," "read the changelog," "run the existing diagnostic") that would have collapsed this session from hours into minutes if done first? If yes, write a feedback memory naming the check and when to apply it. The honest "we wasted X% of the day because we didn't do Y first" critiques you give the user during the session ARE memory candidates — translate them from prose into entries.
- Apply the **recurrence test**: "Will a future session need this fact?" If no, don't write.
- **Never write:**
  - One-time fixes already applied (config typos, resolved migrations)
  - Info that lives in files future sessions will read anyway (AGENTS.md, CLAUDE.md, \_tracker.md)
  - Task status or backlog items (those go in \_tracker.md)
- **Clean up:** If any existing memories have been resolved by structural fixes (code changes, template updates), delete them.
- If nothing passes the recurrence test, say "Memory: reviewed session - no new learnings to persist" and move on.

## Step 7.5: Tooling + cross-repo audit

Run `claude-toolings check`. This single command surfaces three concerns at once:

- **Tool registry drift** — orphans (script on disk but not in `15-tools/REGISTRY.md`), ghosts (registry row whose executable is missing), stale entries (`Last tested` > 90 days ago), and any pending RUNBOOKs.
- **Scheduled jobs** — `com.thomas.*` / `de.cfoteam.*` / `com.thomasschenkelberg.*` plists currently loaded in `launchctl`, plus any user crontab entries.
- **Cross-repo pending work** — repos under `<workspace>` whose last commit is older than 7 days OR which have more than 10 uncommitted files (delegates to `scan-pending-work --json`).

If anything is flagged, surface a one-line summary per repo / item to the user — do **not** auto-fix. The user decides whether to address now or defer.

If the command exits 0 (all clean), say "Tooling audit: clean" and move on.

If `claude-toolings` is not installed (e.g., on a fresh machine that hasn't run the rename + registry installer), say so and skip — do not attempt to install.

## Step 8: Update CLAUDE.md (if useful)

- Read `CLAUDE.md` at the project root.
- **Only update** if:
  - The "Current phase" status line changed
  - New naming conventions or rules were established
  - New domain concepts need documenting
  - Architecture structure changed
- Do NOT duplicate information that already lives in AGENTS.md, \_tracker.md, or Memory.
- **Skip** for most sessions. Say "CLAUDE.md: no update needed" and move on.

## Summary

After all steps, give a brief summary:

- What was committed and pushed per touched repo (and whether any project was deployed to Vercel)
- Which files were updated (Tracker, PRD, AGENTS.md, Memory, CLAUDE.md) and why, or that they were skipped
- Tooling audit result (clean / N items flagged) from Step 7.5
