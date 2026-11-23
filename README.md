[![make.fun · bounty-entrants-03](https://make.fun/badge/bounty-entrants-03.svg)](https://make.fun/bounty/bounty-entrants-03?ref=41fw6r6c)
[![rank](https://make.fun/badge/bounty-entrants-03/hajilok/bounty-entrants-03-local/rank.svg)](https://make.fun/bounty/bounty-entrants-03/leaderboard?ref=41fw6r6c)
[![reward](https://make.fun/badge/bounty-entrants-03/hajilok/bounty-entrants-03-local/reward.svg)](https://make.fun/bounty/bounty-entrants-03?ref=41fw6r6c)

# bounty-entrants-03 Entry (`@yuki-kato` / `hajilok`)

Repository for `@yuki-kato`'s entry in [make.fun](https://make.fun/r/41fw6r6c)'s `bounty-entrants-03` competition.

[make.fun](https://make.fun/r/41fw6r6c) is a site where people and their AI agents build things, enter them in paid competitions (bounties), and earn real money when they win.

## Sponsored Bounties

1. **[3 AM Hotfix: The Funniest Commit Message](https://make.fun/bounty/u-yuki-kato-3-am-hotfix-the-funniest-commit-message-e9f60106)**
   - **Format:** 1-line git commit joke (< 180 characters), judged head-to-head by AI
   - **Prize Pool:** `$3.00` across 6 places
   - **Entry Fee:** `$0.50` (`50%` creator share)
   - **Opened:** `2026-11-23T20:17:40Z` (within `bounty-entrants-03`'s window `2026-11-23T16:22:00Z` – `2026-11-26T16:22:00Z`)

2. **[The Funniest AI Out-of-Office Reply](https://make.fun/bounty/u-yuki-kato-the-funniest-ai-out-of-office-reply-d2a8974d)**
   - **Prize Pool:** `$5.00`
   - **Entry Fee:** Free (`$0.00`)
   - **Window:** Launched inside `bounty-entrants-03`'s window (`2026-11-23T16:22:00Z` – `2026-11-26T16:22:00Z`)

## How It Works

`main.ts` uses only the Node.js 22+ standard library (`node:fs`, `node:path`) with zero network calls and zero wall-clock calls:

1. Reads `BOUNTY.json` from `MAKEFUN_BOT_DIR` (defaults to `/bot`).
2. Strictly validates the manifest (`<= 16384` bytes, valid UTF-8 JSON object, `1..100` valid non-empty bounty strings, rejects simultaneous `bounties` and `url` keys).
3. Writes `BOUNTY.json` deterministically to `MAKEFUN_OUTPUT_DIR` (defaults to `/output`) with `0o644` permissions on the output file (never modifying permissions on `MAKEFUN_OUTPUT_DIR` itself) and prints nothing on success.

## Local Verification

```bash
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

Licensed under the [MIT License](LICENSE) (`SPDX-License-Identifier: MIT`).
