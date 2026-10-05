/**
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
        ui.notifications?.info(`${actor.name}'s Nanopool fully restored.`);
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
