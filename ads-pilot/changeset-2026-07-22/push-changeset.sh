#!/bin/bash
# push-changeset.sh — one-shot wrapper: execute PUSH-RUNBOOK.md via headless claude
# (same pattern as invoice-engine/ads-ops/run-ads-ops.sh). Driven by LaunchAgent
# com.noam.ads-push-changeset (2026-07-23 15:18 + 18:48 IL); self-disarms after
# success or attempt 2 by archiving the plist (in-memory job stays until next
# login; the .push-done sentinel blocks any residual fire).
DIR="$HOME/Claude/Avi-vardi/ads-pilot/changeset-2026-07-22"
LOG="$DIR/push-run.log"
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
CLAUDE_BIN="${ADS_CLAUDE_BIN:-$HOME/.local/bin/claude}"; [ -x "$CLAUDE_BIN" ] || CLAUDE_BIN="$(command -v claude || echo claude)"

disarm() {
  mkdir -p "$HOME/Library/LaunchAgents/_archive"
  mv "$HOME/Library/LaunchAgents/com.noam.ads-push-changeset.plist" "$HOME/Library/LaunchAgents/_archive/" 2>/dev/null
}

[ -f "$DIR/.push-done" ] && { disarm; exit 0; }
ATT=$(( $(cat "$DIR/.push-attempts" 2>/dev/null || echo 0) + 1 )); echo "$ATT" > "$DIR/.push-attempts"
cd "$DIR" || exit 1

{
  echo "===== push attempt $ATT start: $(date -u +%FT%TZ) ====="
  perl -e 'alarm shift; exec @ARGV' 2400 "$CLAUDE_BIN" -p "$(cat "$DIR/PUSH-RUNBOOK.md")" \
    --model sonnet \
    --permission-mode bypassPermissions \
    --max-budget-usd 5 \
    --output-format text
  echo "===== push attempt $ATT end: $(date -u +%FT%TZ) exit=$? ====="
} >> "$LOG" 2>&1

# Success = the runbook's Step-4 receipts landed. ponytail: receipts file IS the success signal.
if ls "$DIR"/receipts-*.json >/dev/null 2>&1; then
  touch "$DIR/.push-done"
  disarm
else
  node "$HOME/.claude/hooks/tg-notify.js" "Ads bus-fix push attempt $ATT produced no receipts (429 still, or a failure) — log: $LOG" 2>/dev/null
  [ "$ATT" -ge 2 ] && disarm
fi
