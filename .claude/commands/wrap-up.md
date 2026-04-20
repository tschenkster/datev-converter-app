End-of-session wrap-up. Run all 8 steps below in order.

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

## Step 3: Deploy to Vercel

- This project auto-deploys from GitHub on push to `main`. The push in Step 2 already triggered deployment.
- Say "Deploy: auto-deploys on push — no action needed" and move on.

## Step 4: Update Tracker (if useful)

- Read `_tracker.md` and review what was done this session (from the commits and git log).
- **Move completed items** from "Next" to "Done" with today's date.
- **Add new items** discovered during the session to "Next" or "Ideas".
- **Reprioritize "Next"** if the session changed what matters most.
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
- Apply the **recurrence test**: "Will a future session need this fact?" If no, don't write.
- **Never write:**
  - One-time fixes already applied (config typos, resolved migrations)
  - Info that lives in files future sessions will read anyway (AGENTS.md, CLAUDE.md, _tracker.md)
  - Task status or backlog items (those go in _tracker.md)
- **Clean up:** If any existing memories have been resolved by structural fixes (code changes, template updates), delete them.
- If nothing passes the recurrence test, say "Memory: reviewed session - no new learnings to persist" and move on.

## Step 8: Update CLAUDE.md (if useful)

- Read `CLAUDE.md` at the project root.
- **Only update** if:
  - The "Current phase" status line changed
  - New naming conventions or rules were established
  - New domain concepts need documenting
  - Architecture structure changed
- Do NOT duplicate information that already lives in AGENTS.md, _tracker.md, or Memory.
- **Skip** for most sessions. Say "CLAUDE.md: no update needed" and move on.

## Summary

After all steps, give a brief summary:
- What was committed and pushed per touched repo (and whether it was deployed to Vercel)
- Which files were updated (Tracker, PRD, AGENTS.md, Memory, CLAUDE.md) and why, or that they were skipped
