import fs from "fs";
import path from "path";

const TEMPLATES_DIR = "templates";
const STYLES_DIR = "styles";
const MODULES_DIR = path.join("src", "modules");

[TEMPLATES_DIR, STYLES_DIR, MODULES_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// =========================================================================
// 1. GENERATE templates/hud-notum.hbs
// =========================================================================
const templateContent = `<div class="suns-notum-hud">
  <!-- Nanopool Status Card -->
  <div class="notum-card notum-nanopool">
    <div class="notum-card-header">
      <div class="notum-card-title">
        <i class="fas fa-atom"></i>
        <span>NANOPOOL</span>
      </div>
      <button type="button" class="notum-np-cycle" title="Nanopool Cycle / Full Recharge">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>
    <div class="notum-meter-container">
      <div class="meter-bar nanopool-bar" style="width: {{nanopool.pct}}%;"></div>
    </div>
    <div class="notum-card-readout">
      <input type="number" class="notum-np-current" value="{{nanopool.value}}" min="0" max="{{nanopool.max}}" />
      <span class="readout-divider">/</span>
      <span class="notum-np-max">{{nanopool.max}} NP</span>
    </div>
  </div>

  <!-- NCU Buffer Status Card -->
  <div class="notum-card notum-ncu {{#if ncu.isOverflow}}ncu-overflow{{/if}}">
    <div class="notum-card-header">
      <div class="notum-card-title">
        <i class="fas fa-microchip"></i>
        <span>NCU BUFFER</span>
      </div>
      {{#if ncu.isOverflow}}
      <span class="ncu-overflow-badge" title="NCU Bandwidth Exceeded!">
        <i class="fas fa-exclamation-triangle"></i> OVERFLOW
      </span>
      {{else}}
      <span class="ncu-avail-badge">
        {{ncu.available}} FREE
      </span>
      {{/if}}
    </div>
    <div class="notum-meter-container">
      <div class="meter-bar ncu-bar {{#if ncu.isOverflow}}bar-overflow{{/if}}" style="width: {{ncu.pct}}%;"></div>
    </div>
    <div class="notum-card-readout">
      <span class="notum-ncu-used">{{ncu.used}}</span>
      <span class="readout-divider">/</span>
      <span class="notum-ncu-max">{{ncu.max}} NCU</span>
    </div>
  </div>
</div>
`;

fs.writeFileSync(path.join(TEMPLATES_DIR, "hud-notum.hbs"), templateContent, "utf8");
console.log("Created: templates/hud-notum.hbs");

// =========================================================================
// 2. GENERATE styles/notum-hud.css
// =========================================================================
const cssContent = `.suns-notum-hud {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin: 6px 0 10px 0;
  padding: 8px;
  background: #0b1118;
  border: 1px solid #1f2f45;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  font-family: var(--dnd5e-font-roboto, "Roboto", sans-serif);
  box-sizing: border-box;
}

.suns-notum-hud .notum-card {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(15, 23, 35, 0.8);
  border: 1px solid #1a2736;
  border-radius: 3px;
  padding: 6px 8px;
  position: relative;
}

.suns-notum-hud .notum-card.ncu-overflow {
  border-color: #ff1744;
  background: rgba(40, 10, 15, 0.6);
}

.suns-notum-hud .notum-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.suns-notum-hud .notum-nanopool .notum-card-title {
  color: #00e5ff;
  display: flex;
  align-items: center;
  gap: 5px;
}

.suns-notum-hud .notum-ncu .notum-card-title {
  color: #d500f9;
  display: flex;
  align-items: center;
  gap: 5px;
}

.suns-notum-hud .notum-np-cycle {
  background: transparent;
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: #00e5ff;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suns-notum-hud .notum-np-cycle:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00e5ff;
  box-shadow: 0 0 6px #00e5ff;
}

.suns-notum-hud .ncu-avail-badge {
  font-size: 10px;
  color: #8c9ba5;
  background: rgba(30, 45, 65, 0.7);
  padding: 1px 5px;
  border-radius: 2px;
}

.suns-notum-hud .ncu-overflow-badge {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  background: #ff1744;
  padding: 1px 5px;
  border-radius: 2px;
  animation: pulse-alert 1.5s infinite;
}

@keyframes pulse-alert {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.suns-notum-hud .notum-meter-container {
  width: 100%;
  height: 6px;
  background: #06090e;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid #121c29;
}

.suns-notum-hud .meter-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.suns-notum-hud .nanopool-bar {
  background: linear-gradient(90deg, #00b0ff, #00e5ff);
  box-shadow: 0 0 6px rgba(0, 229, 255, 0.6);
}

.suns-notum-hud .ncu-bar {
  background: linear-gradient(90deg, #aa00ff, #d500f9);
  box-shadow: 0 0 6px rgba(213, 0, 249, 0.6);
}

.suns-notum-hud .ncu-bar.bar-overflow {
  background: linear-gradient(90deg, #ff1744, #ff5252);
  box-shadow: 0 0 6px rgba(255, 23, 68, 0.8);
}

.suns-notum-hud .notum-card-readout {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #cfd8dc;
}

.suns-notum-hud .notum-np-current {
  width: 42px;
  height: 18px;
  padding: 0 2px;
  text-align: right;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #1f2f45;
  border-radius: 2px;
  color: #00e5ff;
  font-size: 12px;
  font-weight: bold;
}

.suns-notum-hud .notum-np-current:focus {
  border-color: #00e5ff;
  box-shadow: 0 0 4px #00e5ff;
  outline: none;
}

.suns-notum-hud .readout-divider {
  color: #546e7a;
}

.suns-notum-hud .notum-np-max,
.suns-notum-hud .notum-ncu-max {
  color: #90a4ae;
}

.suns-notum-hud .notum-ncu-used {
  color: #d500f9;
  font-weight: bold;
}

.suns-notum-hud .notum-card.ncu-overflow .notum-ncu-used {
  color: #ff1744;
}
`;

fs.writeFileSync(path.join(STYLES_DIR, "notum-hud.css"), cssContent, "utf8");
console.log("Created: styles/notum-hud.css");

// =========================================================================
// 3. GENERATE src/modules/notum-hud.mjs
// =========================================================================
const moduleContent = `/**
 * Suns of Rubi: Core - Notum HUD Subsystem
 * Tracks Nanopool and NCU bandwidth buffers for player characters.
 */
export class NotumHUD {
  static init() {
    // 1. Preload Handlebars templates
    Hooks.once("init", () => {
      loadTemplates([
        "modules/suns-of-rubi-core/templates/hud-notum.hbs"
      ]);
    });

    // 2. Prepare derived Notum values (Nanopool and NCU)
    Hooks.on("dnd5e.prepareDerivedData", (actor) => {
      if (actor.type !== "character") return;
      NotumHUD.computeNotumValues(actor);
    });

    // 3. Inject HUD into character sheet
    Hooks.on("renderActorSheet", (app, html, data) => {
      if (app.actor?.type !== "character") return;
      NotumHUD.injectHUD(app, html, data);
    });
  }

  static computeNotumValues(actor) {
    const flags = actor.flags?.["suns-of-rubi-core"] || {};

    // 1. Calculate Nanopool Max
    let autoMaxNP = 0;
    const primaryClass = actor.itemTypes?.class?.[0];
    if (primaryClass) {
      const classId = primaryClass.identifier;
      const baseNP = actor.system?.scale?.[classId]?.["nanopool-points"]?.value;
      const castModKey = primaryClass.system?.spellcasting?.ability || "int";
      const castMod = actor.system?.abilities?.[castModKey]?.mod || 0;

      if (typeof baseNP === "number") {
        autoMaxNP = Math.max(1, baseNP + castMod);
      } else {
        const classLevel = primaryClass.system?.levels || 1;
        autoMaxNP = Math.max(1, (classLevel * 2) + castMod);
      }
    } else {
      const totalLevel = actor.system?.details?.level || 1;
      autoMaxNP = Math.max(1, totalLevel * 2);
    }

    const maxNP = flags.nanopoolOverride || autoMaxNP;
    const rawCurrentNP = flags.nanopoolCurrent ?? maxNP;
    const currentNP = Math.max(0, Math.min(maxNP, rawCurrentNP));
    const npPct = maxNP > 0 ? Math.min(100, Math.max(0, Math.round((currentNP / maxNP) * 100))) : 0;

    // 2. Calculate NCU Max: Base 8 + equipped hardware/chips
    let maxNCU = 8;
    const equippedItems = actor.items?.filter(i =>
      i.type === "equipment" &&
      i.system?.equipped &&
      i.flags?.["suns-of-rubi-core"]?.ncuCapacity
    ) || [];

    for (const item of equippedItems) {
      maxNCU += Number(item.flags["suns-of-rubi-core"].ncuCapacity) || 0;
    }

    // 3. Calculate NCU Used: active buffs/feats toggled on
    let usedNCU = 0;
    const activeBuffs = actor.items?.filter(i =>
      i.flags?.["suns-of-rubi-core"]?.ncuCost &&
      i.flags?.["suns-of-rubi-core"]?.isActive
    ) || [];

    for (const buff of activeBuffs) {
      usedNCU += Number(buff.flags["suns-of-rubi-core"].ncuCost) || 0;
    }

    const availableNCU = Math.max(0, maxNCU - usedNCU);
    const ncuPct = maxNCU > 0 ? Math.min(100, Math.max(0, Math.round((usedNCU / maxNCU) * 100))) : 0;
    const isOverflow = usedNCU > maxNCU;

    // Save onto actor runtime
    actor.system.notum = {
      nanopool: {
        value: currentNP,
        max: maxNP,
        pct: npPct
      },
      ncu: {
        used: usedNCU,
        max: maxNCU,
        available: availableNCU,
        pct: ncuPct,
        isOverflow: isOverflow
      }
    };
  }

  static async injectHUD(app, html, data) {
    const actor = app.actor;
    const notum = actor?.system?.notum;
    if (!notum) return;

    const element = html instanceof HTMLElement ? html : html[0];
    if (!element) return;

    // Avoid duplicate injection
    if (element.querySelector(".suns-notum-hud")) return;

    // Render template
    const template = "modules/suns-of-rubi-core/templates/hud-notum.hbs";
    const rendered = await renderTemplate(template, {
      nanopool: notum.nanopool,
      ncu: notum.ncu
    });

    // Locate header to inject immediately after
    const target = element.querySelector(".sheet-header, header.sheet-header") || element.querySelector(".sheet-body");
    if (target) {
      target.insertAdjacentHTML("afterend", rendered);
    } else {
      element.insertAdjacentHTML("afterbegin", rendered);
    }

    const hudElement = element.querySelector(".suns-notum-hud");
    if (!hudElement) return;

    // Inline current Nanopool input
    const currentInput = hudElement.querySelector(".notum-np-current");
    if (currentInput) {
      currentInput.addEventListener("change", async (ev) => {
        const val = Math.max(0, Math.min(notum.nanopool.max, parseInt(ev.target.value, 10) || 0));
        await actor.setFlag("suns-of-rubi-core", "nanopoolCurrent", val);
      });
    }

    // Nanopool Cycle / Recharge button
    const cycleBtn = hudElement.querySelector(".notum-np-cycle");
    if (cycleBtn) {
      cycleBtn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        await actor.setFlag("suns-of-rubi-core", "nanopoolCurrent", notum.nanopool.max);
        ui.notifications?.info(\`\${actor.name}'s Nanopool fully restored.\`);
      });
    }

    // Active NCU buff toggles
    hudElement.querySelectorAll(".ncu-buff-toggle").forEach(btn => {
      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const itemId = btn.dataset.itemId;
        const item = actor.items?.get(itemId);
        if (item) {
          const currentActive = item.flags?.["suns-of-rubi-core"]?.isActive || false;
          await item.setFlag("suns-of-rubi-core", "isActive", !currentActive);
        }
      });
    });
  }
}

// Auto-initialize on module load
NotumHUD.init();
`;

fs.writeFileSync(path.join(MODULES_DIR, "notum-hud.mjs"), moduleContent, "utf8");
console.log("Created: src/modules/notum-hud.mjs");

// =========================================================================
// 4. UPDATE module.json: REGISTER esmodules AND styles
// =========================================================================
const manifestPath = "module.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

if (!manifest.esmodules) manifest.esmodules = [];
if (!manifest.esmodules.includes("src/modules/notum-hud.mjs")) {
  manifest.esmodules.push("src/modules/notum-hud.mjs");
}

if (!manifest.styles) manifest.styles = [];
if (!manifest.styles.includes("styles/notum-hud.css")) {
  manifest.styles.push("styles/notum-hud.css");
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
console.log("Updated: module.json with esmodules and styles registrations.");

console.log("Notum HUD Subsystem generation complete!");
