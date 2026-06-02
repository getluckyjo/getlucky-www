# 🔴 CRITICAL — Repos live inside iCloud-synced Desktop (corrupts git)

**This is the single most important finding of the whole audit, and it affects ALL
your projects, not just `www`.**

## What's happening
- Your Desktop is synced to iCloud Drive:
  `~/Library/Mobile Documents/com~apple~CloudDocs/Desktop → ~/Desktop`
  (macOS "Desktop & Documents in iCloud" feature).
- All four repos (`www`, `website`, `Get Lucky Subscriptions`, `Dean Burmeister
  Pitch Site`) + assets live under this synced Desktop.
- `brctl status` showed iCloud actively syncing **inside `www/.git/objects/`** during
  the audit.

## Why it breaks git
iCloud evicts file contents to free space, leaving "dataless" placeholder files.
Git memory-maps (`mmap`) its index, packs and objects. When git mmaps a dataless
file whose content isn't materialized, the kernel raises **SIGBUS (signal 10)** and
git dies mid-operation. During this audit that:
- crashed `git status`, `git read-tree`, and `git worktree remove` (signal 10), and
- destroyed `.git/index` mid-write, leaving a stale `index.lock`.

iCloud does not understand git's atomic-rename semantics, so it can also upload/evict
files between git's write and rename steps — silent repo corruption.

## Current status of `www` (recovered)
- Forced materialization of `.git` (plain `read()` of every object), removed the
  stale `index.lock`, rebuilt the index from HEAD.
- `git fsck --full` → **clean, no corruption**. The WIP commit `b9bdcf8` is intact.
- **No commits or files were lost.** But the fix is temporary — iCloud can re-evict
  and re-break this at any time.

## Unpushed local-only branches (at risk until pushed)
- `feat/wip-store-sync-cron` ← today's in-progress work (store/sync/cron + Indwe/Ads)
- `cleanup/tightening-pass` ← this audit's changes
- `claude/distracted-haslett-02268e`
`main` is safe on origin. The above exist ONLY on this (corruption-prone) disk.

## Recommended fix (priority order)
1. **Push the unpushed branches to GitHub now** so the work survives any future
   corruption. (Remote action — needs your OK.)
2. **Move all repos out of iCloud.** Either:
   - Move them to a non-synced path like `~/dev/` or `~/code/` (best), **or**
   - In System Settings → Apple ID → iCloud → iCloud Drive → Options, turn off
     "Desktop & Documents Folders" (affects everything on Desktop), **or**
   - Keep on Desktop but exclude each project: `brctl evict` won't help; the
     reliable per-folder exclusion is to append `.nosync` to the folder name or
     move out — iCloud has no clean per-subfolder opt-out, so moving is cleanest.
3. Re-clone is NOT needed — moving preserves all local branches and working files.
   Fully materialize first (`find .git -type f | xargs cat >/dev/null`) before
   moving, to be safe.

**Until the repos are out of iCloud, every git operation risks re-corruption.**
