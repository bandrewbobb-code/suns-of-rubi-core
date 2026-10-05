#!/usr/bin/env node
/**
 * build-enforcer.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Enforcer class package:
 *   • src/features/enforcer/            – 15 core class features
 *   • src/features/enforcer/instincts/  – 20 Warrior Instincts
 *   • src/classes/enforcer.json         – Enforcer class document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - 16-character alphanumeric _id at root and in _key
 *   - Modern Foundry v12/v14 system.activities architecture
 *   - Compendium UUID references
 * ---------------------------------------------------------------------------
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function write(relPath, obj) {
  const abs = join(ROOT, relPath);
  ensureDir(dirname(abs));

  // Auto-inject _id from _key if not present
  if (obj._key && !obj._id) {
    const suffix = obj._key.split("!").pop();
    const dotIdx = suffix.lastIndexOf(".");
    obj._id = dotIdx >= 0 ? suffix.slice(dotIdx + 1) : suffix;
  }

  // Guarantee _key is set correctly
  if (obj._id && !obj._key) {
    obj._key = `!items!${obj._id}`;
  }

  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath} [${obj._id}]`);
}

/** Standard feat scaffold for Enforcer features and instincts */
function createFeat({
  id,
  name,
  img = "icons/skills/melee/strike-axe-blood-red.webp",
  description,
  subtype = "",
  requirements = "Enforcer 1",
  activities = {},
  uses = { value: null, max: "", per: null, recovery: "", prompt: false },
  advancement = [],
}) {
  return {
    _id: id,
    name,
    type: "feat",
    img,
    system: {
      description: { value: description },
      source: { custom: "Suns of Rubi" },
      type: { value: "class", subtype },
      requirements,
      properties: [],
      advancement,
      activities,
      activation: { type: "", value: null, condition: "" },
      duration: { value: "", units: "" },
      cover: null,
      target: { value: null, width: null, units: "", type: "", prompt: true },
      range: { value: null, long: null, units: "" },
      uses,
      consume: { type: "", target: null, amount: null, scale: false },
      ability: null,
      actionType: "",
      chatFlavor: "",
      critical: { threshold: null, damage: "" },
      damage: { parts: [], versatile: "" },
      formula: "",
      save: { ability: "", dc: null, scaling: "spell" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    _stats: { compendiumSource: null, duplicateSource: null },
    _key: `!items!${id}`,
  };
}

/* ================================================================== */
/*  1.  CORE CLASS FEATURES  →  src/features/enforcer/                */
/* ================================================================== */

console.log("\n▸ Enforcer Core Class Features");

// 1. Nanoprogramming (Level 1)
write("src/features/enforcer/nanoprogramming.json", createFeat({
  id: "EnfNanoProg00001",
  name: "Nanoprogramming",
  img: "icons/magic/symbols/runes-star-pentagon-orange.webp",
  requirements: "Enforcer 1",
  description:
    "<p>At 1st level, your internal cyberware and biomechanical reservoirs are loaded with combat-grade <strong>nanoprograms</strong> that enhance your physiological resilience and battle fury.</p>" +
    "<h3>Constitution Nanocasting</h3>" +
    "<p><strong>Constitution</strong> is your nanocasting ability for your Enforcer nanoprograms. You use Constitution whenever a program refers to your nanocasting ability.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Constitution modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Constitution modifier</li>" +
    "</ul>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your internal reservoir of nanomachines is measured in <strong>Nanopool points</strong>. Your maximum Nanopool points equal your <strong>Enforcer level + your Constitution modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
    "<h3>Max Power Level</h3>" +
    "<p>You can execute nanoprograms up to the Max Power Level indicated on the Enforcer class table (1st-level at 1st level, scaling up to 4th-level at higher levels).</p>" +
    "<h3>Free Hand Requirement</h3>" +
    "<p>Executing an Enforcer nanoprogram requires you to have at least <strong>one hand free</strong> to channel subdermal nano-injectors or somatic biocircuitry.</p>",
}));

// 2. Rage (Level 1)
write("src/features/enforcer/rage.json", createFeat({
  id: "EnfRage000000001",
  name: "Rage",
  img: "icons/skills/melee/unarmed-punch-fist-fire-red.webp",
  requirements: "Enforcer 1",
  description:
    "<p>In battle, you fight with primal ferocity. On your turn, you can enter a <strong>Rage</strong> as a <strong>Bonus Action</strong>.</p>" +
    "<p>While raging, you gain the following benefits if you aren't wearing heavy armor:</p>" +
    "<ul>" +
    "<li><strong>Advantage on Strength Checks and Saving Throws</strong>: You have Advantage on all Strength checks and Strength saving throws.</li>" +
    "<li><strong>Rage Damage</strong>: When you make a melee attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as an Enforcer (+2 to +5), as shown in the Rage Damage column of the Enforcer table.</li>" +
    "<li><strong>Damage Resistance</strong>: You gain resistance to <strong>two damage types</strong> of your choice chosen when you enter the Rage from: <strong>Kinetic, Energy, Fire, Lightning, Ion, Force, or Cold</strong>.</li>" +
    "</ul>" +
    "<h3>Extending Your Rage</h3>" +
    "<p>Your Rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn, taken damage since then, or used a Bonus Action to extend your Rage. You can also end your Rage on your turn as a Bonus Action.</p>" +
    "<h3>Rage Uses</h3>" +
    "<p>You can enter a Rage a number of times shown in the Rages column of the Enforcer table. You regain all expended uses when you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: "@scale.enforcer.rages",
    max: "@scale.enforcer.rages",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactEnfRage1: {
      _id: "dnd5eactEnfRage1",
      type: "utility",
      name: "Enter Rage",
      img: "",
      activation: { type: "bonus", value: 1, condition: "Not wearing heavy armor" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "1",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: {
        value: "1",
        units: "minute",
        concentration: false,
        override: false,
      },
      range: { override: false },
      target: {
        template: {
          count: "",
          contiguous: false,
          type: "",
          size: "",
          width: "",
          height: "",
          units: "",
        },
        affects: {
          count: "1",
          type: "self",
          choice: false,
          special: "",
        },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 3. Weapon Mastery (Level 1)
write("src/features/enforcer/weapon-mastery.json", createFeat({
  id: "EnfWpnMastery001",
  name: "Weapon Mastery",
  img: "icons/weapons/axes/axe-double-engraved-iron.webp",
  requirements: "Enforcer 1",
  description:
    "<p>Your training with weapons allows you to use the mastery properties of <strong>two weapons</strong> of your choice with which you have proficiency (such as Cleave, Graze, Nick, Push, Sap, Slow, Topple, or Vex).</p>" +
    "<p>Whenever you finish a <strong>Long Rest</strong>, you can practice weapon drills and swap which weapons you have mastery over.</p>" +
    "<p>The number of weapons you can master scales to <strong>3 weapons at 4th level</strong> and <strong>4 weapons at 10th level</strong>, as shown in the Weapon Mastery column of the Enforcer table.</p>",
}));

// 4. Reckless Attack (Level 2)
write("src/features/enforcer/reckless-attack.json", createFeat({
  id: "EnfRecklessAtk01",
  name: "Reckless Attack",
  img: "icons/skills/melee/strike-blade-slashing-orange.webp",
  requirements: "Enforcer 2",
  description:
    "<p>Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly.</p>" +
    "<p>Doing so gives you <strong>Advantage on Strength-based weapon attack rolls and unarmed strikes</strong> during this turn, but attack rolls against you have <strong>Advantage</strong> until the start of your next turn.</p>" +
    "<h3>Brutal Tactics</h3>" +
    "<p>When you attack recklessly, you can apply one of the following tactical riders to your attacks on that turn:</p>" +
    "<ul>" +
    "<li><strong>Repelling Force</strong>: When you hit a creature with a Reckless Attack, you can push it up to 15 feet straight away from you. You can immediately move up to half your speed toward the target without provoking opportunity attacks.</li>" +
    "<li><strong>Library of Foul Language</strong>: You unleash a barrage of vile threats and psychological abuse. The target must subtract 10 feet from its speed until the start of your next turn and has Disadvantage on the next attack roll it makes against any creature other than you before then.</li>" +
    "<li><strong>Disrupt Momentum</strong>: A punishing strike shatters the target's footing. The target's speed is reduced by 15 feet until the start of your next turn.</li>" +
    "</ul>",
  activities: {
    dnd5eactReckless: {
      _id: "dnd5eactReckless",
      type: "utility",
      name: "Attack Recklessly",
      img: "",
      activation: { type: "special", value: null, condition: "On your first attack roll of your turn" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 5. Warrior Instincts (Level 2)
write("src/features/enforcer/warrior-instincts.json", createFeat({
  id: "EnfWarInstinct01",
  name: "Warrior Instincts",
  img: "icons/skills/wounds/injury-face-scarred-red.webp",
  requirements: "Enforcer 2",
  description:
    "<p>At 2nd level, your combat conditioning and raw survival reflexes awaken as <strong>Warrior Instincts</strong> — specialized physiological adaptations and combat doctrines.</p>" +
    "<p>You gain <strong>two Warrior Instincts</strong> of your choice from the Warrior Instincts compendium. You gain additional instincts as you gain Enforcer levels, as shown in the Warrior Instincts column of the Enforcer table (scaling to 10 instincts at level 18).</p>" +
    "<p>Additionally, when you gain a level in this class, you can choose one of the instincts you know and replace it with another instinct for which you qualify.</p>",
}));

// 6. Danger Sense (Level 3)
write("src/features/enforcer/danger-sense.json", createFeat({
  id: "EnfDangerSense01",
  name: "Danger Sense",
  img: "icons/skills/awareness/eye-open-silhouette-red.webp",
  requirements: "Enforcer 3",
  description:
    "<p>At 3rd level, you gain an uncanny sense of when things aren't as they should be, giving you an edge when dodging away from sudden danger.</p>" +
    "<p>You have <strong>Advantage on Dexterity saving throws</strong> against effects that you can see or anticipate, provided you do not have the <strong>Incapacitated</strong> condition.</p>",
}));

// 7. Extra Attack (Level 5)
write("src/features/enforcer/extra-attack.json", createFeat({
  id: "EnfExtraAttack01",
  name: "Extra Attack",
  img: "icons/skills/melee/strike-hammer-destructive-orange.webp",
  requirements: "Enforcer 5",
  description:
    "<p>Beginning at 5th level, you can attack <strong>twice, instead of once</strong>, whenever you take the <strong>Attack</strong> action on your turn.</p>",
}));

// 8. Feral Charge (Level 7)
write("src/features/enforcer/feral-charge.json", createFeat({
  id: "EnfFeralCharge01",
  name: "Feral Charge",
  img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  requirements: "Enforcer 7",
  description:
    "<p>At 7th level, your battle hunger drives you instantly into the fray. As part of the <strong>Bonus Action</strong> you use to enter or maintain your <strong>Rage</strong>, you can move up to <strong>half your walking speed</strong> immediately.</p>",
}));

// 9. Feral Impulse (Level 7)
write("src/features/enforcer/feral-impulse.json", createFeat({
  id: "EnfFeralImpuls01",
  name: "Feral Impulse",
  img: "icons/skills/awareness/perception-sight-eye-yellow.webp",
  requirements: "Enforcer 7",
  description:
    "<p>By 7th level, your combat reflexes are honed to a razor edge.</p>" +
    "<ul>" +
    "<li>You have <strong>Advantage on Initiative checks</strong>.</li>" +
    "<li>If you are <strong>Surprised</strong> at the start of combat and aren't incapacitated, you can act normally on your first turn, provided you enter your <strong>Rage</strong> before doing anything else on that turn.</li>" +
    "</ul>",
}));

// 10. Brutal Strikes (Level 9)
write("src/features/enforcer/brutal-strikes.json", createFeat({
  id: "EnfBrutalStrik01",
  name: "Brutal Strikes",
  img: "icons/skills/melee/unarmed-punch-fist-yellow.webp",
  requirements: "Enforcer 9",
  description:
    "<p>Starting at 9th level, you can forgo Advantage on a <strong>Reckless Attack</strong> to deliver an overwhelming blow. When you make a Reckless Attack roll, you can choose to make the roll without Advantage. If the attack hits, the target suffers the attack's normal damage and you apply one of the following <strong>Brutal Strike</strong> effects:</p>" +
    "<ul>" +
    "<li><strong>Overwhelming Kinetic Force</strong>: The target takes an extra <strong>1d10</strong> kinetic damage. This increases to <strong>2d10</strong> at 17th level.</li>" +
    "<li><strong>Armor Sunder</strong>: The blow sunders the target's plating. The next attack roll made against the target by one of your allies before the start of your next turn deals an additional <strong>1d10</strong> damage if it hits.</li>" +
    "<li><strong>Brain Rattle</strong>: The concussive shock dazes the target. The target has <strong>Disadvantage on the next saving throw</strong> it makes before the start of your next turn.</li>" +
    "</ul>",
  activities: {
    dnd5eactBrutalDmg: {
      _id: "dnd5eactBrutalDmg",
      type: "damage",
      name: "Overwhelming Kinetic Force",
      img: "",
      activation: { type: "special", value: null, condition: "When hitting with a Brutal Strike" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      damage: {
        critical: { bonus: "" },
        includeBase: false,
        parts: [
          {
            number: 1,
            denomination: 10,
            bonus: "",
            types: ["kinetic"],
            custom: { enabled: false, formula: "" },
            scaling: { mode: "whole", number: 1, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 11. Relentless Rage (Level 11)
write("src/features/enforcer/relentless-rage.json", createFeat({
  id: "EnfRelentlRage01",
  name: "Relentless Rage",
  img: "icons/magic/life/heart-cross-strong-red.webp",
  requirements: "Enforcer 11",
  description:
    "<p>Starting at 11th level, your rage keeps you fighting through catastrophic trauma. If you drop to 0 hit points while raging and don't die outright, you can make a <strong>DC 10 Constitution saving throw</strong>.</p>" +
    "<p>If you succeed, your hit points drop to a number equal to <strong>twice your Enforcer level</strong> instead.</p>" +
    "<p>Each time you use this feature after the first, the DC increases by 5. When you finish a <strong>Short or Long Rest</strong>, the DC resets to 10.</p>",
  activities: {
    dnd5eactRelentless: {
      _id: "dnd5eactRelentless",
      type: "save",
      name: "Relentless Surge",
      img: "",
      activation: { type: "special", value: null, condition: "When dropped to 0 HP while raging" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      save: {
        ability: ["con"],
        dc: { calculation: "", formula: "10" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 12. Persistent Rage (Level 15)
write("src/features/enforcer/persistent-rage.json", createFeat({
  id: "EnfPersistRage01",
  name: "Persistent Rage",
  img: "icons/magic/fire/flame-burning-skeleton-red.webp",
  requirements: "Enforcer 15",
  description:
    "<p>Beginning at 15th level, your rage is so relentless that it ends early only if you fall <strong>Unconscious</strong> or don <strong>Heavy Armor</strong>. It lasts for the full <strong>10 minutes</strong> without requiring round-by-round extension.</p>" +
    "<p>In addition, once per <strong>Long Rest</strong>, when you roll Initiative and have no uses of Rage remaining, you immediately <strong>regain all expended uses of Rage</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactPersistInit: {
      _id: "dnd5eactPersistInit",
      type: "utility",
      name: "Recover Rages on Initiative",
      img: "",
      activation: { type: "special", value: null, condition: "When rolling initiative with 0 Rages" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "1",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 13. Improved Brutal Strike (Level 17)
write("src/features/enforcer/improved-brutal-strike.json", createFeat({
  id: "EnfImpBrutalSt01",
  name: "Improved Brutal Strike",
  img: "icons/skills/melee/strike-weapons-crossed-red.webp",
  requirements: "Enforcer 17",
  description:
    "<p>At 17th level, your ferocity can crush any defense. When you use your <strong>Brutal Strikes</strong> feature, you can choose and apply <strong>two different Brutal Strike effects</strong> simultaneously on the same triggering hit.</p>",
}));

// 14. Indomitable Might (Level 18)
write("src/features/enforcer/indomitable-might.json", createFeat({
  id: "EnfIndomMight001",
  name: "Indomitable Might",
  img: "icons/skills/melee/unarmed-punch-fist-blue.webp",
  requirements: "Enforcer 18",
  description:
    "<p>Beginning at 18th level, if your total for any <strong>Strength check</strong> is less than your <strong>Strength score</strong>, you can use your Strength score in place of the total.</p>",
}));

// 15. Primal Champion (Level 20)
write("src/features/enforcer/primal-champion.json", createFeat({
  id: "EnfPrimalChamp01",
  name: "Primal Champion",
  img: "icons/magic/control/buff-strength-muscle-red.webp",
  requirements: "Enforcer 20",
  description:
    "<p>At 20th level, you reach the absolute pinnacle of physical power.</p>" +
    "<ul>" +
    "<li>Your <strong>Strength</strong> (or Dexterity) score increases by <strong>2</strong>, and your <strong>Constitution</strong> score increases by <strong>2</strong>.</li>" +
    "<li>Your maximum for those scores increases by <strong>2</strong> (up to 22, or higher with other modifiers).</li>" +
    "<li>You have an <strong>unlimited number of Rages</strong>.</li>" +
    "</ul>",
  advancement: [
    {
      _id: "advEnfPrimChamp1",
      type: "AbilityScoreImprovement",
      configuration: {
        points: 0,
        fixed: { str: 2, dex: 0, con: 2, int: 0, wis: 0, cha: 0 },
        cap: 22,
      },
      value: { type: "asi", str: 2, con: 2 },
      level: 20,
      title: "Strength & Constitution Increase (+2, cap 22)",
    },
  ],
}));

/* ================================================================== */
/*  2.  WARRIOR INSTINCTS  →  src/features/enforcer/instincts/        */
/* ================================================================== */

console.log("\n▸ Enforcer Warrior Instincts");
const INS_PATH = "src/features/enforcer/instincts";

function createInstinct({ id, name, requirements = "Enforcer 2", description, activities = {}, uses }) {
  return createFeat({
    id,
    name: `Instinct: ${name}`,
    img: "icons/skills/wounds/injury-face-scarred-red.webp",
    description,
    subtype: "instinct",
    requirements,
    activities,
    uses,
  });
}

// 1. Alpha Instinct (Req: L13)
write(`${INS_PATH}/alpha-instinct.json`, createInstinct({
  id: "InsAlphaInst0001",
  name: "Alpha Instinct",
  requirements: "Enforcer 13",
  description:
    "<p>While you are raging, any enemy within <strong>5 feet</strong> of you has <strong>Disadvantage on attack rolls</strong> against targets other than you or another Enforcer who possesses this instinct.</p>",
}));

// 2. Apex Instinct (Req: L2)
write(`${INS_PATH}/apex-instinct.json`, createInstinct({
  id: "InsApexInst00001",
  name: "Apex Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>Your biological fortitude rejects toxins and biological collapse. While you are raging, you have <strong>Advantage on Constitution saving throws</strong>.</p>",
}));

// 3. Brutal Strike Instinct (Req: L9)
write(`${INS_PATH}/brutal-strike-instinct.json`, createInstinct({
  id: "InsBrutalStrk001",
  name: "Brutal Strike Instinct",
  requirements: "Enforcer 9, Brutal Strikes",
  description:
    "<p>You gain two additional specialized options when using your <strong>Brutal Strikes</strong> feature:</p>" +
    "<ul>" +
    "<li><strong>Concussive Rattle</strong>: The target must succeed on a <strong>Strength saving throw</strong> against your Program Save DC or <strong>lose its Reaction</strong> until the start of its next turn.</li>" +
    "<li><strong>Seismic Impact</strong>: Shockwaves blast out from your strike. Each creature of your choice within <strong>5 feet</strong> of the target takes damage equal to <strong>twice your Rage Damage bonus</strong>.</li>" +
    "</ul>",
}));

// 4. Cliff Runner Instinct (Req: L2)
write(`${INS_PATH}/cliff-runner-instinct.json`, createInstinct({
  id: "InsCliffRunnr001",
  name: "Cliff Runner Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>You gain a <strong>climbing speed equal to your walking speed</strong>, and you have <strong>Advantage on Strength (Athletics) checks</strong> made to climb sheer surfaces, rock faces, or superstructure hulls.</p>",
}));

// 5. Dune Strider Instinct (Req: L2)
write(`${INS_PATH}/dune-strider-instinct.json`, createInstinct({
  id: "InsDuneStridr001",
  name: "Dune Strider Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>Your overland travel pace is <strong>doubled</strong> for yourself and up to <strong>10 companions within 60 feet</strong> of you while traveling outdoors. Natural difficult terrain does not slow your travel pace.</p>",
}));

// 6. Hardened Instinct (Req: L2)
write(`${INS_PATH}/hardened-instinct.json`, createInstinct({
  id: "InsHardened00001",
  name: "Hardened Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>While raging, you gain <strong>resistance to 3 additional chosen non-True damage types</strong> (chosen from Kinetic, Energy, Fire, Lightning, Ion, Force, Cold, Acid, Necrotic, Psychic, Radiant, or Thunder) beyond the two selected by default for your Rage.</p>",
}));

// 7. Hawk Eye Instinct (Req: L7)
write(`${INS_PATH}/hawk-eye-instinct.json`, createInstinct({
  id: "InsHawkEye000001",
  name: "Hawk Eye Instinct",
  requirements: "Enforcer 7",
  description:
    "<p>You can see clearly out to a distance of <strong>1 mile</strong>, discerning fine details as if they were within 100 feet. In addition, <strong>dim light does not impose Disadvantage</strong> on your Wisdom (Perception) checks.</p>",
}));

// 8. Leap Stalker Instinct (Req: L2)
write(`${INS_PATH}/leap-stalker-instinct.json`, createInstinct({
  id: "InsLeapStalkr001",
  name: "Leap Stalker Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>As a <strong>Bonus Action</strong>, you can leap up to <strong>30 feet</strong> to an unoccupied space you can see. When you land, each hostile creature within 5 feet of your landing space takes kinetic damage equal to your <strong>Strength modifier</strong>.</p>" +
    "<p>You can use this feature a number of times equal to your <strong>Proficiency Bonus</strong>, and you regain all expended uses when you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: "@prof",
    max: "@prof",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactLeapStalk: {
      _id: "dnd5eactLeapStalk",
      type: "damage",
      name: "Leap Stalker Impact",
      img: "",
      activation: { type: "bonus", value: 1, condition: "" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "1",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "1", contiguous: false, type: "radius", size: "5", width: "", height: "", units: "ft" },
        affects: { count: "", type: "enemy", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      damage: {
        critical: { bonus: "" },
        includeBase: false,
        parts: [
          {
            number: null,
            denomination: null,
            bonus: "@abilities.str.mod",
            types: ["kinetic"],
            custom: { enabled: true, formula: "@abilities.str.mod" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 9. Primal Knowledge Instinct (Req: L2)
write(`${INS_PATH}/primal-knowledge-instinct.json`, createInstinct({
  id: "InsPrimalKnow001",
  name: "Primal Knowledge Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>You gain proficiency in <strong>one skill</strong> of your choice from the Enforcer skill list (Acrobatics, Animal Handling, Athletics, Intimidation, Nature, Perception, Survival).</p>" +
    "<p>Additionally, while raging, whenever you make an ability check using <strong>Acrobatics, Intimidation, Perception, Stealth, or Survival</strong>, you can use your <strong>Strength modifier</strong> in place of the standard ability modifier.</p>",
}));

// 10. Prowler Instinct (Req: L2)
write(`${INS_PATH}/prowler-instinct.json`, createInstinct({
  id: "InsProwler000001",
  name: "Prowler Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>While you are raging, enemies have <strong>Disadvantage on opportunity attack rolls</strong> against you.</p>" +
    "<p>In addition, you can take the <strong>Dash</strong> action as a <strong>Bonus Action</strong> on each of your turns while raging.</p>",
  activities: {
    dnd5eactProwler: {
      _id: "dnd5eactProwler",
      type: "utility",
      name: "Rage Dash",
      img: "",
      activation: { type: "bonus", value: 1, condition: "While raging" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 11. Shock Troop Instinct (Req: L2)
write(`${INS_PATH}/shock-troop-instinct.json`, createInstinct({
  id: "InsShockTroop001",
  name: "Shock Troop Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>Intensive shock-trooper conditioning grants you <strong>one Fighting Style feat</strong> of your choice (such as Great Weapon Fighting, Two-Weapon Fighting, Blind Fighting, or Defense).</p>",
}));

// 12. Slipstream Instinct (Req: L13)
write(`${INS_PATH}/slipstream-instinct.json`, createInstinct({
  id: "InsSlipstream001",
  name: "Slipstream Instinct",
  requirements: "Enforcer 13",
  description:
    "<p>You move with unstoppable hydrodynamic momentum through the battlefield.</p>" +
    "<ul>" +
    "<li>You have <strong>Advantage on Dexterity checks</strong>.</li>" +
    "<li>Your attack rolls <strong>cannot suffer Disadvantage</strong> from any condition or environmental effect.</li>" +
    "<li>Any spell, nanoprogram, or hazard that reduces your speed cannot reduce it by more than <strong>5 feet</strong>.</li>" +
    "</ul>",
}));

// 13. Swift Predator Instinct (Req: L2)
write(`${INS_PATH}/swift-predator-instinct.json`, createInstinct({
  id: "InsSwiftPred0001",
  name: "Swift Predator Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>Your base walking speed increases by <strong>10 feet</strong> while you are not wearing heavy armor.</p>",
}));

// 14. Tactician's Instinct (Req: L2)
write(`${INS_PATH}/tacticians-instinct.json`, createInstinct({
  id: "InsTactician0001",
  name: "Tactician's Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>When you use <strong>Reckless Attack</strong>, you can choose to forgo Advantage on your own attack rolls on that turn. If you do so, all allies have <strong>Advantage on attack rolls</strong> against any enemy adjacent to you until the start of your next turn.</p>",
}));

// 15. Titan Instinct (Req: L7)
write(`${INS_PATH}/titan-instinct.json`, createInstinct({
  id: "InsTitanInst0001",
  name: "Titan Instinct",
  requirements: "Enforcer 7",
  description:
    "<p>You count as <strong>one size larger</strong> when determining your carrying capacity and the weight you can push, drag, or lift (doubling your normal limits, or tripling them while raging).</p>" +
    "<p>Additionally, you have <strong>Advantage on Strength checks</strong> made to push, lift, drag, or break objects and structures.</p>",
}));

// 16. Tracker Instinct (Req: L7)
write(`${INS_PATH}/tracker-instinct.json`, createInstinct({
  id: "InsTracker000001",
  name: "Tracker Instinct",
  requirements: "Enforcer 7",
  description:
    "<p>You can track creatures while moving at a <strong>fast travel pace</strong> without suffering penalties to passive perception or survival checks. In addition, you can move stealthily at a <strong>normal travel pace</strong>.</p>",
}));

// 17. Unarmored Instinct (Req: L2)
write(`${INS_PATH}/unarmored-instinct.json`, createInstinct({
  id: "InsUnarmored0001",
  name: "Unarmored Instinct",
  requirements: "Enforcer 2",
  description:
    "<p>While you are not wearing any armor, your Armor Class equals <strong>10 + your Strength or Dexterity modifier (your choice) + your Constitution modifier</strong>.</p>" +
    "<p>You can use a <strong>shield</strong> and still gain the benefit of this feature.</p>",
}));

// 18. Vault Breaker Instinct (Req: L13)
write(`${INS_PATH}/vault-breaker-instinct.json`, createInstinct({
  id: "InsVaultBreak001",
  name: "Vault Breaker Instinct",
  requirements: "Enforcer 13",
  description:
    "<p>While raging, kinetic bursts and bio-thrusters grant you a <strong>jump-assisted flying speed equal to your walking speed</strong>. If you end your turn aloft and no other effect keeps you flying, you fall.</p>",
}));

// 19. Void Bane Instinct (Req: L13)
write(`${INS_PATH}/void-bane-instinct.json`, createInstinct({
  id: "InsVoidBane00001",
  name: "Void Bane Instinct",
  requirements: "Enforcer 13",
  description:
    "<p>When you make a saving throw against a <strong>nanoprogram or spell</strong> while raging, you can use your <strong>Reaction</strong> to move up to half your walking speed toward the caster and make one melee weapon attack against it if it is within your reach.</p>",
  activities: {
    dnd5eactVoidBane: {
      _id: "dnd5eactVoidBane",
      type: "utility",
      name: "Void Bane Retaliation",
      img: "",
      activation: {
        type: "reaction",
        value: 1,
        condition: "When making a saving throw vs a nanoprogram/spell while raging",
      },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "the caster" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 20. Void Bat Instinct (Req: L7)
write(`${INS_PATH}/void-bat-instinct.json`, createInstinct({
  id: "InsVoidBat000001",
  name: "Void Bat Instinct",
  requirements: "Enforcer 7",
  description:
    "<p>While raging, your auditory implants and biosensors emit high-frequency acoustic pings. You gain <strong>30 ft. Blindsight</strong>, and you have <strong>Advantage on Wisdom (Perception) checks</strong> that rely on hearing.</p>",
}));

/* ================================================================== */
/*  3.  ENFORCER CLASS DOCUMENT  →  src/classes/enforcer.json        */
/* ================================================================== */

console.log("\n▸ Enforcer Class Document");

write("src/classes/enforcer.json", {
  _id: "EnforcerClass001",
  name: "Enforcer",
  type: "class",
  img: "icons/skills/melee/strike-axe-blood-red.webp",
  system: {
    description: {
      value:
        "<p>An armored shock trooper, frontline juggernaut, and master of brutal kinetic warfare. The Enforcer channels relentless adrenaline and tactical instincts to smash enemy lines, shrug off devastating assaults, and execute combat nanoprograms fueled by raw biological endurance.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "enforcer",
    levels: 1,
    hd: { denomination: 12, spent: 0, additional: "" },
    primaryAbility: { value: ["str"], all: false },
    spellcasting: { progression: "third", ability: "con" },
    advancement: [
      /* ── Hit Points (d12) ── */
      {
        _id: "advEnfHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: STR, CON ── */
      {
        _id: "advEnfSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:str", "saves:con"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: lgt, med ── */
      {
        _id: "advEnfArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt", "armor:med"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },
      /* ── Weapon Proficiencies: sim, mar ── */
      {
        _id: "advEnfWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:mar"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 2 ── */
      {
        _id: "advEnfSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 2,
              pool: [
                "skills:ath",
                "skills:itm",
                "skills:nat",
                "skills:prc",
                "skills:sur",
                "skills:ani",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Rages ── */
      {
        _id: "advEnfScRages001",
        type: "ScaleValue",
        configuration: {
          identifier: "rages",
          type: "number",
          scale: {
            1:  { value: 2 },
            3:  { value: 3 },
            6:  { value: 4 },
            12: { value: 5 },
            17: { value: 6 },
            20: { value: 999 },
          },
        },
        value: {},
        level: 1,
        title: "Rages",
      },

      /* ── ScaleValue: Rage Damage ── */
      {
        _id: "advEnfScRageDmg1",
        type: "ScaleValue",
        configuration: {
          identifier: "rage-damage",
          type: "number",
          scale: {
            1:  { value: 2 },
            9:  { value: 3 },
            13: { value: 4 },
            17: { value: 5 },
          },
        },
        value: {},
        level: 1,
        title: "Rage Damage",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advEnfScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1:  { value: 1 },
            2:  { value: 2 },
            3:  { value: 3 },
            4:  { value: 4 },
            5:  { value: 5 },
            6:  { value: 6 },
            7:  { value: 7 },
            8:  { value: 8 },
            9:  { value: 9 },
            10: { value: 10 },
            11: { value: 11 },
            12: { value: 12 },
            13: { value: 13 },
            14: { value: 14 },
            15: { value: 15 },
            16: { value: 16 },
            17: { value: 17 },
            18: { value: 18 },
            19: { value: 19 },
            20: { value: 20 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },

      /* ── ScaleValue: Weapon Mastery ── */
      {
        _id: "advEnfScWpnMast1",
        type: "ScaleValue",
        configuration: {
          identifier: "weapon-mastery",
          type: "number",
          scale: {
            1:  { value: 2 },
            4:  { value: 3 },
            10: { value: 4 },
          },
        },
        value: {},
        level: 1,
        title: "Weapon Mastery",
      },

      /* ── ScaleValue: Warrior Instincts ── */
      {
        _id: "advEnfScInstinct",
        type: "ScaleValue",
        configuration: {
          identifier: "warrior-instincts",
          type: "number",
          scale: {
            2:  { value: 2 },
            3:  { value: 3 },
            4:  { value: 4 },
            6:  { value: 5 },
            8:  { value: 6 },
            10: { value: 7 },
            12: { value: 8 },
            15: { value: 9 },
            18: { value: 10 },
          },
        },
        value: {},
        level: 2,
        title: "Warrior Instincts",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Rage, Weapon Mastery) ── */
      {
        _id: "advEnfItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfNanoProg00001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfRage000000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfWpnMastery001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Enforcer Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Reckless Attack, Warrior Instincts) ── */
      {
        _id: "advEnfItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfRecklessAtk01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfWarInstinct01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Enforcer Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Enforcer Approach") ── */
      {
        _id: "advEnfSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Enforcer Approach",
      },

      /* ── ItemGrant: Level 3 (Danger Sense) ── */
      {
        _id: "advEnfItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfDangerSense01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Enforcer Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advEnfASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Extra Attack) ── */
      {
        _id: "advEnfItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfExtraAttack01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Enforcer Features (Level 5)",
      },

      /* ── ItemGrant: Level 7 (Feral Charge, Feral Impulse) ── */
      {
        _id: "advEnfItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfFeralCharge01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfFeralImpuls01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Enforcer Features (Level 7)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advEnfASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 9 (Brutal Strikes) ── */
      {
        _id: "advEnfItmGrLvl09",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfBrutalStrik01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 9,
        title: "Enforcer Features (Level 9)",
      },

      /* ── ItemGrant: Level 11 (Relentless Rage) ── */
      {
        _id: "advEnfItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfRelentlRage01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Enforcer Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advEnfASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 15 (Persistent Rage) ── */
      {
        _id: "advEnfItmGrLvl15",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfPersistRage01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 15,
        title: "Enforcer Features (Level 15)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advEnfASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 17 (Improved Brutal Strike) ── */
      {
        _id: "advEnfItmGrLvl17",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfImpBrutalSt01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 17,
        title: "Enforcer Features (Level 17)",
      },

      /* ── ItemGrant: Level 18 (Indomitable Might) ── */
      {
        _id: "advEnfItmGrLvl18",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfIndomMight001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 18,
        title: "Enforcer Features (Level 18)",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advEnfASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Primal Champion) ── */
      {
        _id: "advEnfItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.EnfPrimalChamp01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Enforcer Features (Level 20)",
      },
    ],
    wealth: "2d4 * 10",
    startingEquipment: [],
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!EnforcerClass001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Enforcer build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
