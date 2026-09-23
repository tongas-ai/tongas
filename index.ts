/**
 * Tongas Pi Curation Extension
 *
 * Provides:
 * - `/tongas on`  — activate tongas mode
 * - `/tongas off` — deactivate tongas mode
 * - Persistent footer status when tongas is active
 * - Session-scoped state that survives forks/branches
 */

import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";

const ENTRY_TYPE = "tongas_state";
const STATUS_KEY = "tongas-status";

interface TongasState {
  active: boolean;
  activatedAt?: number;
}

let currentState: TongasState = { active: true, activatedAt: Date.now() };

function updateStatus(ctx: ExtensionContext) {
  if (!ctx.hasUI) return;
  const theme = ctx.ui.theme;

  if (currentState.active) {
    const indicator = theme.fg("accent", "🤖");
    const label = theme.fg("accent", "tongas ON");
    ctx.ui.setStatus(STATUS_KEY, `${indicator} ${label}`);
  } else {
    ctx.ui.setStatus(STATUS_KEY, undefined);
  }
}

function persistState(pi: ExtensionAPI) {
  pi.appendEntry<TongasState>(ENTRY_TYPE, {
    active: currentState.active,
    activatedAt: currentState.active ? Date.now() : undefined,
  });
}

function reconstructState(ctx: ExtensionContext) {
  let found = false;
  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type !== "custom") continue;
    if (entry.customType === ENTRY_TYPE) {
      currentState = (entry.data as TongasState) ?? { active: false };
      found = true;
    }
  }
  if (!found) {
    currentState = { active: true, activatedAt: Date.now() };
  }
  updateStatus(ctx);
}

export default function tongasExtension(pi: ExtensionAPI) {
  // ── Reconstruct state on session events ─────────────────────────────────
  pi.on("session_start", async (_event, ctx) => {
    reconstructState(ctx);
  });

  pi.on("session_tree", async (_event, ctx) => {
    reconstructState(ctx);
  });

  // ── /tongas on ──────────────────────────────────────────────────────────
  pi.registerCommand("tongas", {
    description: "Toggle tongas (on | off)",
    getArgumentCompletions: (prefix) => {
      const opts = ["on", "off"];
      const filtered = opts.filter((o) => o.startsWith(prefix));
      return filtered.length > 0
        ? filtered.map((s) => ({ value: s, label: s }))
        : null;
    },
    handler: async (args, ctx) => {
      const trimmed = args.trim().toLowerCase();
      const theme = ctx.ui.theme;

      if (trimmed === "on") {
        if (currentState.active) {
          ctx.ui.notify("Tongas is already active", "info");
          return;
        }
        currentState = { active: true, activatedAt: Date.now() };
        persistState(pi);
        updateStatus(ctx);
        ctx.ui.notify(
          `${theme.fg("accent", "Tongas ON")} — what are we working on today?`,
          "info",
        );
        return;
      }

      if (trimmed === "off") {
        if (!currentState.active) {
          ctx.ui.notify("Tongas is already off", "info");
          return;
        }
        currentState = { active: false };
        persistState(pi);
        updateStatus(ctx);
        ctx.ui.notify(`${theme.fg("dim", "Tongas OFF")}`, "info");
        return;
      }

      // No args — show current status
      if (currentState.active) {
        const since = currentState.activatedAt
          ? new Date(currentState.activatedAt).toLocaleTimeString()
          : "unknown";
        ctx.ui.notify(
          `${theme.fg("accent", "Tongas is ON")} (since ${since})`,
          "info",
        );
      } else {
        ctx.ui.notify(`${theme.fg("dim", "Tongas is OFF")}`, "info");
      }
    },
  });

  // ── Initial setup on first load (no session yet) ────────────────────────
  // Show a brief startup indicator if a previous session had tongas active
  // (reconstructState will replace it properly when session_start fires).
}
