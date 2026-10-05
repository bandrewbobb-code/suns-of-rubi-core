#!/usr/bin/env node
/**
 * build-bureaucrat.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Bureaucrat class package:
 *   • src/features/bureaucrat/          – 8 core class features
 *   • src/features/bureaucrat/directives/ – 22 Executive Directives
 *   • src/actors/mechanical-bodyguard.json
 *   • src/classes/bureaucrat.json
 *
 * Run:  node scripts/build-bureaucrat.mjs
 * Then: npm run build
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
  // Auto-inject _id from _key (e.g. "!items!FooBar001" → "FooBar001")
  if (obj._key && !obj._id) {
    obj._id = obj._key.split("!").pop();
  }
  // Recursively inject _id on embedded items (actors)
  if (Array.isArray(obj.items)) {
    for (const item of obj.items) {
      if (item._key && !item._id) {
        // Embedded keys are like "!actors.items!ActorId.ItemId" — _id is ItemId
        const keySuffix = item._key.split("!").pop();
        const dotIdx = keySuffix.lastIndexOf(".");
        item._id = dotIdx >= 0 ? keySuffix.slice(dotIdx + 1) : keySuffix;
      }
    }
  }
  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath}`);
}

/** Passive-feat scaffold (no activity) used by most directives. */
function passiveFeat({
  name,
  img = "icons/sundries/scrolls/scroll-bound-ruby-red.webp",
  description,
  subtype = "directive",
  requirements = "Bureaucrat 2",
  key,
  uses = { value: null, max: "", per: null, recovery: "", prompt: false },
  formula = "",
  chatFlavor = "",
}) {
  return {
    name,
    type: "feat",
    img,
    system: {
      description: { value: description },
      source: { custom: "Suns of Rubi" },
      type: { value: "class", subtype },
      requirements,
      properties: [],
      activities: {},
      activation: { type: "", value: null, condition: "" },
      duration: { value: "", units: "" },
      cover: null,
      target: { value: null, width: null, units: "", type: "", prompt: true },
      range: { value: null, long: null, units: "" },
      uses,
      consume: { type: "", target: null, amount: null, scale: false },
      ability: null,
      actionType: "",
      chatFlavor,
      critical: { threshold: null, damage: "" },
      damage: { parts: [], versatile: "" },
      formula,
      save: { ability: "", dc: null, scaling: "spell" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    _stats: { compendiumSource: null, duplicateSource: null },
    _key: `!items!${key}`,
  };
}

/* ================================================================== */
/*  1.  CORE CLASS FEATURES  →  src/features/bureaucrat/              */
/* ================================================================== */

console.log("\n▸ Core class features");

// ── Nanoprogramming (Level 1) ────────────────────────────────────
write("src/features/bureaucrat/nanoprogramming.json", {
  name: "Nanoprogramming",
  type: "feat",
  img: "icons/magic/symbols/runes-star-pentagon-blue.webp",
  system: {
    description: {
      value:
        "<p>At 1st level, your neural implant is loaded with a suite of <strong>nanoprograms</strong> — microscopic machines that execute on biological and digital substrates alike.</p>" +
        "<h3>Programs Known</h3>" +
        "<p>You know <strong>9 nanoprograms</strong> of your choice from the Bureaucrat nanoprogram list. The Nanoprograms Known column of the Bureaucrat table shows when you learn additional nanoprograms.</p>" +
        "<h3>Nanopool</h3>" +
        "<p>You have an internal reservoir of nanomachines measured in <strong>Nanopool points</strong>. Your total is shown in the Nanopool Points column of the Bureaucrat table. You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
        "<h3>Nanocasting Ability</h3>" +
        "<p><strong>Charisma</strong> is your nanocasting ability. Your nanoprograms draw on your force of personality and executive presence.</p>" +
        "<ul>" +
        "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Charisma modifier</li>" +
        "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Charisma modifier</li>" +
        "</ul>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 1",
    properties: [],
    activities: {},
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
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
  _key: "!items!NanoProgramm001",
});

// ── Baton of Authority (Level 1) ─────────────────────────────────
write("src/features/bureaucrat/baton-of-authority.json", {
  name: "Baton of Authority",
  type: "feat",
  img: "icons/weapons/staves/staff-ornate-gold.webp",
  system: {
    description: {
      value:
        "<p>Starting at 1st level, you carry a <strong>Baton of Authority</strong> — a symbol of your executive rank that channels your commanding presence.</p>" +
        "<h3>Authority Die</h3>" +
        "<p>Your Authority Die begins as a <strong>d6</strong> and increases as you gain levels (see the Bureaucrat table). You have a number of Authority Dice equal to your <strong>Charisma modifier</strong> (minimum 1).</p>" +
        "<h3>Issuing Authority</h3>" +
        "<p>As a <strong>Bonus Action</strong>, choose a willing creature within <strong>60 feet</strong> that can hear you. That creature gains one Authority Die. Once within the next 10 minutes, the creature can roll the die and add the result to one ability check, attack roll, or saving throw it makes.</p>" +
        "<p>You regain all expended Authority Dice when you finish a <strong>Long Rest</strong>.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 1",
    properties: [],
    activities: {
      dnd5eactBatonA1: {
        _id: "dnd5eactBatonA1",
        type: "utility",
        name: "Issue Authority Die",
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
        duration: {
          value: "10",
          units: "minute",
          concentration: false,
          override: false,
        },
        range: { value: "60", units: "ft", override: false },
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
            type: "ally",
            choice: false,
            special: "who can hear you",
          },
          prompt: true,
          override: false,
        },
        uses: { spent: 0, max: "", recovery: [] },
        sort: 0,
      },
    },
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: {
      value: "@abilities.cha.mod",
      max: "@abilities.cha.mod",
      per: "lr",
      recovery: "",
      prompt: false,
    },
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
  _key: "!items!BatonAuthort001",
});

// ── Mechanical Bodyguard License (Level 2) ───────────────────────
write("src/features/bureaucrat/mechanical-bodyguard-license.json", {
  name: "Mechanical Bodyguard License",
  type: "feat",
  img: "icons/creatures/magical/construct-golem-stone-blue.webp",
  system: {
    description: {
      value:
        '<p>Beginning at 2nd level, your departmental clearance authorises the assignment of a certified <strong>Mechanical Bodyguard Droid</strong> asset to your person.</p><section class="secret"><p><em>See the Mechanical Bodyguard Droid companion stat block.</em></p></section>' +
        "<h3>Combat Initiative</h3><p>The droid shares your initiative count and takes its turn immediately after yours. It can move and use its reaction independently, but on its turn it only takes the <strong>Dodge</strong> action unless you command it otherwise.</p>" +
        "<h3>Command Action</h3><p>You may use your <strong>Bonus Action</strong> to command the droid to execute one of the actions in its stat block, or to take the <strong>Help</strong> action.</p>" +
        "<h3>Rebuilding / Asset Reissue</h3><p>If the droid is destroyed, you can reconstruct it over the course of a <strong>Long Rest</strong> using slicer\u0027s tools or tech tools at zero credit cost. The rebuilt droid appears with all its hit points restored.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 2",
    properties: [],
    activities: {
      dnd5eactivity000: {
        _id: "dnd5eactivity000",
        type: "utility",
        name: "Command Bodyguard",
        img: "",
        activation: { type: "bonus", value: 1, condition: "" },
        consumption: { targets: [], scaling: { allowed: false } },
        duration: {
          units: "inst",
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
            type: "ally",
            choice: false,
            special: "the droid",
          },
          prompt: true,
          override: false,
        },
        uses: { spent: 0, max: "", recovery: [] },
        sort: 0,
      },
    },
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    crpierce: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
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
  _key: "!items!MBGLicense00001",
});

// ── Sage Advice (Level 3 & 13) ───────────────────────────────────
write("src/features/bureaucrat/sage-advice.json", {
  name: "Sage Advice",
  type: "feat",
  img: "icons/skills/social/diplomacy-handshake-yellow.webp",
  system: {
    description: {
      value:
        "<p>Beginning at 3rd level, you can spend <strong>1 minute</strong> advising up to a number of friendly creatures equal to your <strong>Charisma modifier</strong> (minimum 1) within <strong>30 feet</strong> who can hear and understand you.</p>" +
        "<p>Once within the next hour, when each advised creature makes an ability check using a <strong>skill or tool</strong> of your choice in which you are proficient, it can add your <strong>Proficiency Bonus</strong> to the roll if it is not already proficient in that skill or tool.</p>" +
        "<p>Once you use this feature, you cannot do so again until you finish a <strong>Long Rest</strong>.</p>" +
        "<hr /><h3>Seasoned Counsel (13th Level)</h3>" +
        "<p>Starting at 13th level, you regain the use of this feature when you finish a <strong>Short or Long Rest</strong>.</p>" +
        "<p>In addition, you gain <strong>Advantage</strong> on Constitution saving throws made to maintain <strong>Concentration</strong>.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 3",
    properties: [],
    activities: {
      dnd5eactSageAd1: {
        _id: "dnd5eactSageAd1",
        type: "utility",
        name: "Dispense Advice",
        img: "",
        activation: { type: "minute", value: 1, condition: "" },
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
          units: "hour",
          concentration: false,
          override: false,
        },
        range: { value: "30", units: "ft", override: false },
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
            count: "@abilities.cha.mod",
            type: "ally",
            choice: false,
            special: "who can hear and understand you",
          },
          prompt: true,
          override: false,
        },
        uses: { spent: 0, max: "", recovery: [] },
        sort: 0,
      },
    },
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: false },
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
  _key: "!items!SageAdvice00001",
});

// ── Font of Leadership (Level 5) ─────────────────────────────────
write("src/features/bureaucrat/font-of-leadership.json", {
  name: "Font of Leadership",
  type: "feat",
  img: "icons/magic/holy/chalice-glowing-gold.webp",
  system: {
    description: {
      value:
        "<p>Starting at 5th level, you regain all expended uses of <strong>Baton of Authority</strong> when you finish a <strong>Short or Long Rest</strong>.</p>" +
        "<p>In addition, you can expend <strong>2 Nanopool points</strong> (no action required) to regain one expended use of your <strong>Authority Die</strong>.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 5",
    properties: [],
    activities: {
      dnd5eactFontL1: {
        _id: "dnd5eactFontL1",
        type: "utility",
        name: "Requisition Authority Die",
        img: "",
        activation: {
          type: "special",
          value: null,
          condition: "No action required",
        },
        consumption: {
          targets: [
            {
              type: "attribute",
              target: "resources.primary.value",
              value: "2",
              scaling: { mode: "", formula: "" },
            },
          ],
          scaling: { allowed: false },
        },
        duration: {
          units: "inst",
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
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
    consume: { type: "", target: null, amount: null, scale: false },
    ability: null,
    actionType: "",
    chatFlavor:
      "Expends 2 Nanopool points to regain 1 Baton of Authority use.",
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
  _key: "!items!FontLeadersh01",
});

// ── Countercharm (Level 7) ───────────────────────────────────────
write("src/features/bureaucrat/countercharm.json", {
  name: "Countercharm",
  type: "feat",
  img: "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  system: {
    description: {
      value:
        "<p>At 7th level, when you or a creature within <strong>30 feet</strong> of you fails a saving throw against an effect that applies the <strong>Charmed</strong> or <strong>Frightened</strong> condition, you can use your <strong>Reaction</strong> to force that creature to reroll the saving throw with <strong>Advantage</strong>.</p>" +
        "<p>The creature must use the new roll.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 7",
    properties: [],
    activities: {
      dnd5eactCCharm: {
        _id: "dnd5eactCCharm",
        type: "utility",
        name: "Disrupt Mind Influence",
        img: "",
        activation: {
          type: "reaction",
          value: 1,
          condition:
            "You or a creature within 30 ft fails a save vs Charmed or Frightened",
        },
        consumption: { targets: [], scaling: { allowed: false } },
        duration: {
          units: "inst",
          concentration: false,
          override: false,
        },
        range: { value: "30", units: "ft", override: false },
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
            type: "creature",
            choice: false,
            special: "who failed the save",
          },
          prompt: true,
          override: false,
        },
        uses: { spent: 0, max: "", recovery: [] },
        sort: 0,
      },
    },
    activation: {
      type: "reaction",
      value: 1,
      condition:
        "A creature within 30 ft fails a save vs Charmed or Frightened",
    },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: 30, long: null, units: "ft" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
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
  _key: "!items!Countercharm01",
});

// ── Calm and Collected (Level 14 & 17) ───────────────────────────
write("src/features/bureaucrat/calm-and-collected.json", {
  name: "Calm and Collected",
  type: "feat",
  img: "icons/magic/control/debuff-energy-hold-blue-yellow.webp",
  system: {
    description: {
      value:
        "<p>Beginning at 14th level, when you are forced to make a <strong>saving throw</strong> caused by an effect you can see, you can add a bonus equal to your <strong>Charisma modifier</strong> to the roll.</p>" +
        "<p>You can use this feature a number of times equal to your <strong>Proficiency Bonus</strong> per <strong>Long Rest</strong>.</p>" +
        "<hr /><h3>Unshakeable Poise (17th Level)</h3>" +
        "<p>At 17th level, you gain <strong>1 additional use</strong> of this feature per Long Rest.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 14",
    properties: [],
    activities: {
      dnd5eactCalmCo: {
        _id: "dnd5eactCalmCo",
        type: "utility",
        name: "Apply Composure",
        img: "",
        activation: {
          type: "special",
          value: null,
          condition:
            "Reaction \u2014 when forced to make a saving throw against a visible effect",
        },
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
          units: "inst",
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
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: {
      value: "@prof",
      max: "@prof",
      per: "lr",
      recovery: "",
      prompt: false,
    },
    consume: { type: "", target: null, amount: null, scale: false },
    ability: null,
    actionType: "",
    chatFlavor: "Adds Charisma modifier to the saving throw.",
    critical: { threshold: null, damage: "" },
    damage: { parts: [], versatile: "" },
    formula: "@abilities.cha.mod",
    save: { ability: "", dc: null, scaling: "spell" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!CalmCollect001",
});

// ── Chairman of the Board (Level 20) ─────────────────────────────
write("src/features/bureaucrat/chairman-of-the-board.json", {
  name: "Chairman of the Board",
  type: "feat",
  img: "icons/environment/people/leader.webp",
  system: {
    description: {
      value:
        "<p>At 20th level, your authority reaches its absolute apex.</p>" +
        "<h3>Ability Score Increase</h3><p>Your <strong>Charisma</strong> score increases by <strong>4</strong>. Your maximum for that score is now <strong>24</strong>.</p>" +
        "<h3>Secret Command Words</h3><p>You unlock classified executive override codes. You always have <strong>Power Word Heal</strong> and <strong>Power Word Kill</strong> prepared, and they do not count against your number of prepared nanoprograms.</p>" +
        "<h3>Secondary Designation</h3><p>When you execute <strong>Power Word Heal</strong> or <strong>Power Word Kill</strong>, you can designate a <strong>secondary target</strong> creature within <strong>30 feet</strong> of the primary target. The secondary target suffers the identical effect of the nanoprogram.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "" },
    requirements: "Bureaucrat 20",
    properties: [],
    advancement: [
      {
        _id: "advChairCHA001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 0,
          fixed: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 4 },
          cap: 24,
        },
        value: { type: "asi", cha: 4 },
        level: 20,
        title: "Charisma Increase (+4, cap 24)",
      },
    ],
    activities: {},
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
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
  _key: "!items!ChairmanBrd001",
});

/* ================================================================== */
/*  2.  EXECUTIVE DIRECTIVES  →  src/features/bureaucrat/directives/  */
/* ================================================================== */

console.log("\n▸ Executive Directives");
const DIR_PATH = "src/features/bureaucrat/directives";

// 1. Academic Memory
write(`${DIR_PATH}/academic-memory.json`, passiveFeat({
  name: "Directive: Academic Memory",
  description:
    "<p>You possess photographic recall of <strong>corporate logs</strong>, <strong>administrative codes</strong>, and <strong>technical documents</strong> you have read within the past month. You can perfectly recite their contents from memory and have Advantage on Intelligence checks to recall information from such sources.</p>",
  key: "DirAcademicMem01",
}));

// 2. Ambassador Protocols
write(`${DIR_PATH}/ambassador-protocols.json`, passiveFeat({
  name: "Directive: Ambassador Protocols",
  description:
    "<p>Your diplomatic training expands your linguistic repertoire. You learn <strong>three additional languages</strong> of your choice.</p><p>Additionally, you have <strong>Advantage</strong> on Charisma (Persuasion) checks when interacting with <strong>diplomats</strong>, <strong>port authorities</strong>, and <strong>corporate officers</strong>.</p><p><em>This directive may be selected more than once; choose three new languages each time.</em></p>",
  key: "DirAmbassador001",
}));

// 3. Authorized Riot Bouncer (Req: L5)
write(`${DIR_PATH}/authorized-riot-bouncer.json`, passiveFeat({
  name: "Directive: Authorized Riot Bouncer",
  description:
    "<p>Your Mechanical Bodyguard\u0027s detention subroutines receive a hardware upgrade.</p><ul><li>The Bodyguard can <strong>grapple up to two targets simultaneously</strong> (one per hand/servo).</li><li>Moving a grappled creature <strong>no longer halves</strong> the Bodyguard\u0027s speed.</li></ul>",
  requirements: "Bureaucrat 5",
  key: "DirRiotBouncr01",
}));

// 4. Calculated Leverage
write(`${DIR_PATH}/calculated-leverage.json`, passiveFeat({
  name: "Directive: Calculated Leverage",
  description:
    "<p>You gain <strong>proficiency with improvised weapons</strong>. While wielded by you, improvised weapons gain the <strong>Finesse</strong> property and deal <strong>1d6 kinetic</strong> damage.</p><p>In addition, you can use your <strong>Charisma modifier</strong> instead of Strength or Dexterity for the attack and damage rolls of improvised weapons and sidearms.</p>",
  key: "DirCalcLever001",
}));

// 5. Corporate Aegis (Req: L7)
write(`${DIR_PATH}/corporate-aegis.json`, passiveFeat({
  name: "Directive: Corporate Aegis",
  description:
    "<p>When your Mechanical Bodyguard uses <strong>Intercept Threat</strong>, it gains <strong>Resistance to all damage</strong> dealt by the triggering attack.</p>",
  requirements: "Bureaucrat 7",
  key: "DirCorpAegis001",
}));

// 6. Corporate Expense Account (15% discount)
write(`${DIR_PATH}/corporate-expense-account.json`, passiveFeat({
  name: "Directive: Corporate Expense Account",
  description:
    "<p>Your high-level corporate line of credit grants you and your party a permanent <strong>15% discount</strong> on <strong>weapons</strong>, <strong>armor</strong>, <strong>tools</strong>, <strong>stims</strong>, and <strong>provisions</strong> purchased in civilized or corporate-controlled settlements.</p>",
  key: "DirCorpExpAcc01",
}));

// 7. Diplomatic Immunity (Req: L7)
write(`${DIR_PATH}/diplomatic-immunity.json`, passiveFeat({
  name: "Directive: Diplomatic Immunity",
  description:
    "<p>Your official status projects an aura of untouchable authority. Hostile creatures have <strong>Disadvantage on attack rolls</strong> against you during the <strong>first round of combat</strong>, provided you have not yet dealt damage or forced a saving throw in that encounter.</p>",
  requirements: "Bureaucrat 7",
  key: "DirDiplImmun001",
}));

// 8. Executive Advice
write(`${DIR_PATH}/executive-advice.json`, passiveFeat({
  name: "Directive: Executive Advice",
  description:
    "<p>When you use the <strong>Help</strong> action or issue an order to an ally, the first time that ally makes an ability check within the next minute, they add <strong>half your Charisma modifier</strong> (rounded down, minimum +1) to the result.</p>",
  key: "DirExecAdvic001",
}));

// 9. Executive Witness (Droid 10ft truesight)
write(`${DIR_PATH}/executive-witness.json`, passiveFeat({
  name: "Directive: Executive Witness",
  description:
    "<p>Your Mechanical Bodyguard gains <strong>10 ft. Truesight</strong> and can access local registry databases.</p><p>You have <strong>Advantage</strong> on Intelligence (Lore) and Wisdom (Insight) checks regarding <strong>organizations</strong>, <strong>bounties</strong>, or <strong>contracts</strong>.</p>",
  key: "DirExecWitns001",
}));

// 10. Hardened Mind (Req: L9)
write(`${DIR_PATH}/hardened-mind.json`, passiveFeat({
  name: "Directive: Hardened Mind",
  description:
    "<p>Your mental conditioning hardens against exotic interference.</p><ul><li><strong>Advantage</strong> on saving throws against illusions, psionics, and electronic deception.</li><li><strong>Advantage</strong> on Investigation checks against holograms.</li><li>You gain <strong>Resistance to psychic damage</strong>.</li></ul>",
  requirements: "Bureaucrat 9",
  key: "DirHardenMnd001",
}));

// 11. Lifelong Accreditation
write(`${DIR_PATH}/lifelong-accreditation.json`, passiveFeat({
  name: "Directive: Lifelong Accreditation",
  description:
    "<p>Your ongoing certification programs grant additional expertise. You gain proficiency in <strong>one skill and one tool kit</strong>, or <strong>two tool kits</strong> of your choice.</p><p><em>This directive may be selected more than once.</em></p>",
  key: "DirLifeAccrd001",
}));

// 12. Mandatory Red Tape (Req: L5, 4 NP, 30ft AoE)
write(`${DIR_PATH}/mandatory-red-tape.json`, {
  name: "Directive: Mandatory Red Tape",
  type: "feat",
  img: "icons/sundries/scrolls/scroll-bound-ruby-red.webp",
  system: {
    description: {
      value:
        "<p><em>Action \u2014 4 Nanopool points.</em></p><p>You project a bureaucratic compliance field in a <strong>30-foot radius</strong>. Each hostile creature in the area must make a <strong>Wisdom saving throw</strong> against your <strong>Program Save DC</strong>.</p><p>On a failure, the creature <strong>loses its Reaction</strong> and has its <strong>Initiative reduced by 10</strong> (minimum 1) until the start of your next turn.</p>",
    },
    source: { custom: "Suns of Rubi" },
    type: { value: "class", subtype: "directive" },
    requirements: "Bureaucrat 5",
    properties: [],
    activities: {
      dnd5eactSavMRT: {
        _id: "dnd5eactSavMRT",
        type: "save",
        name: "Mandatory Red Tape",
        img: "",
        activation: {
          type: "action",
          value: 1,
          condition: "4 Nanopool points",
        },
        consumption: { targets: [], scaling: { allowed: false } },
        duration: {
          units: "inst",
          concentration: false,
          override: false,
        },
        range: { override: false },
        target: {
          template: {
            count: "1",
            contiguous: false,
            type: "sphere",
            size: "30",
            width: "",
            height: "",
            units: "ft",
          },
          affects: {
            count: "",
            type: "enemy",
            choice: false,
            special: "",
          },
          prompt: true,
          override: false,
        },
        save: {
          ability: ["wis"],
          dc: { calculation: "spellcasting", formula: "" },
        },
        damage: {
          critical: { bonus: "" },
          includeBase: false,
          parts: [],
        },
        effects: [],
        uses: { spent: 0, max: "", recovery: [] },
        sort: 0,
      },
    },
    activation: { type: "", value: null, condition: "" },
    duration: { value: "", units: "" },
    cover: null,
    target: { value: null, width: null, units: "", type: "", prompt: true },
    range: { value: null, long: null, units: "" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: false },
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
  _key: "!items!DirMandRedTp001",
});

// 13. Master's Authority (Req: L11)
write(`${DIR_PATH}/masters-authority.json`, passiveFeat({
  name: "Directive: Master\u0027s Authority",
  description:
    "<p>Your leadership commands absolute confidence. When an ally benefits from your <strong>Executive Advice</strong>, their ability check bonus increases to your <strong>full Charisma modifier</strong> (minimum +1) instead of half.</p>",
  requirements: "Bureaucrat 11, Executive Advice",
  key: "DirMstrAuth0001",
}));

// 14. Mental Prowess
write(`${DIR_PATH}/mental-prowess.json`, passiveFeat({
  name: "Directive: Mental Prowess",
  description:
    "<p>You can use your <strong>Charisma modifier</strong> instead of Strength or Dexterity when making <strong>Athletics</strong> or <strong>Acrobatics</strong> checks to grapple a creature, escape a grapple, or slip restraints.</p>",
  key: "DirMentProw0001",
}));

// 15. Mil-Spec Accreditation (Req: L5)
write(`${DIR_PATH}/mil-spec-accreditation.json`, passiveFeat({
  name: "Directive: Mil-Spec Accreditation",
  description:
    "<p>Your Mechanical Bodyguard receives a military-grade certification upgrade, gaining proficiency in <strong>one</strong> of the following categories:</p><ul><li>Martial Melee Weapons</li><li>Light Armor</li><li>Medium Armor</li><li>Shields</li></ul><p><em>This directive may be selected more than once; choose a different category each time.</em></p>",
  requirements: "Bureaucrat 5",
  key: "DirMilSpec00001",
}));

// 16. Notum Authority Broadcast (Req: L9, free Mass Calm 1/LR)
write(`${DIR_PATH}/notum-authority-broadcast.json`, passiveFeat({
  name: "Directive: Notum Authority Broadcast",
  description:
    "<p>You can cast <strong>Mass Calm</strong> once per <strong>Long Rest</strong> without expending Nanopool points.</p>",
  requirements: "Bureaucrat 9",
  key: "DirNotumAuth001",
  uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: false },
}));

// 17. Reliable Intelligence (Req: L9, min roll 10)
write(`${DIR_PATH}/reliable-intelligence.json`, passiveFeat({
  name: "Directive: Reliable Intelligence",
  description:
    "<p>Your analytical training guarantees a baseline of competence. Whenever you make a proficient <strong>Intelligence (Lore)</strong>, <strong>Intelligence (Technology)</strong>, or <strong>Wisdom (Insight)</strong> check, you treat any d20 roll of <strong>9 or lower as a 10</strong>.</p>",
  requirements: "Bureaucrat 9",
  key: "DirRelIntel0001",
}));

// 18. Resolute Authority (Req: L5, +Cha to saves)
write(`${DIR_PATH}/resolute-authority.json`, passiveFeat({
  name: "Directive: Resolute Authority",
  description:
    "<p>Your force of personality reinforces your mental defences. You add your <strong>Charisma modifier</strong> to saving throws made to resist being <strong>Charmed</strong>, <strong>Frightened</strong>, or <strong>Stunned</strong>.</p>",
  requirements: "Bureaucrat 5",
  key: "DirResoluteA001",
}));

// 19. Running on Fumes (3 hr sleep, exhaustion adv)
write(`${DIR_PATH}/running-on-fumes.json`, passiveFeat({
  name: "Directive: Running on Fumes",
  description:
    "<p>You need only <strong>3 hours of sleep</strong> to gain the benefits of a Long Rest. If your rest is interrupted, you need only complete the <strong>remaining time</strong> rather than restarting.</p><p>You also have <strong>Advantage</strong> on saving throws against exhaustion.</p>",
  key: "DirRunFumes0001",
}));

// 20. Subliminal Compliance (2 min memory wipe)
write(`${DIR_PATH}/subliminal-compliance.json`, passiveFeat({
  name: "Directive: Subliminal Compliance",
  description:
    "<p>When a target fails a saving throw against one of your <strong>charm</strong>, <strong>stasis</strong>, or <strong>calm</strong> nanoprograms, you can alter up to the last <strong>2 minutes</strong> of the target\u0027s short-term memory. The target rationalises the gap with plausible false recollections.</p>",
  key: "DirSubCompl0001",
}));

// 21. Tech Dabbler
write(`${DIR_PATH}/tech-dabbler.json`, passiveFeat({
  name: "Directive: Tech Dabbler",
  description:
    "<p>You learn and can execute one <strong>1st-level nanoprogram</strong> from any Operating System once per <strong>Long Rest</strong> without spending Nanopool points. Charisma is your casting ability for this nanoprogram.</p><p><em>This directive may be selected more than once; choose a different nanoprogram each time.</em></p>",
  key: "DirTechDabb0001",
  uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: false },
}));

// 22. Universal Lingua-Franca
write(`${DIR_PATH}/universal-lingua-franca.json`, passiveFeat({
  name: "Directive: Universal Lingua-Franca",
  description:
    "<p>You can communicate <strong>basic intentions</strong>, <strong>threats</strong>, and <strong>commands</strong> to any creature with an Intelligence score of 4 or higher through a combination of non-verbal cues, universally understood gestures, and datapad-generated graphics.</p>",
  key: "DirUniLingua001",
}));

/* ================================================================== */
/*  3.  MECHANICAL BODYGUARD ACTOR  →  src/actors/                    */
/* ================================================================== */

console.log("\n▸ Mechanical Bodyguard actor");

write("src/actors/mechanical-bodyguard.json", {
  name: "Mechanical Bodyguard",
  type: "npc",
  img: "icons/creatures/magical/construct-golem-stone-blue.webp",
  system: {
    abilities: {
      str: { value: 14, proficient: 1 },
      dex: { value: 10, proficient: 0 },
      con: { value: 14, proficient: 1 },
      int: { value: 8, proficient: 0 },
      wis: { value: 10, proficient: 0 },
      cha: { value: 10, proficient: 0 },
    },
    attributes: {
      ac: { flat: 12, calc: "custom", formula: "12 + @prof" },
      hp: {
        value: 10,
        max: 10,
        formula: "4 + (4 * @classes.bureaucrat.levels) + @prof",
      },
      movement: {
        walk: 30,
        burrow: 0,
        climb: 0,
        fly: 0,
        swim: 0,
        units: "ft",
        hover: false,
      },
      senses: {
        darkvision: 60,
        blindsight: 0,
        tremorsense: 0,
        truesight: 0,
        units: "ft",
        special: "",
      },
      death: { success: 0, failure: 0 },
    },
    details: {
      biography: {
        value:
          "<p>A government-issued bodyguard droid assigned to licensed Bureaucrats. Armour-plated chassis, integrated stun prod, and a 150-lb secure cargo bay.</p>",
        public: "",
      },
      alignment: "Unaligned",
      cr: null,
      spellLevel: 0,
      type: {
        value: "construct",
        subtype: "Droid",
        swarm: "",
        custom: "",
      },
      source: { custom: "Suns of Rubi" },
    },
    traits: {
      size: "med",
      di: { value: ["poison", "psychic"], bypasses: [], custom: "" },
      dv: { value: ["lightning"], bypasses: [], custom: "Ion" },
      dr: { value: [], bypasses: [], custom: "" },
      ci: {
        value: ["charmed", "poisoned", "exhaustion"],
        custom: "",
      },
      languages: {
        value: [],
        custom: "Understands the languages of its operator",
      },
    },
    skills: {
      ath: {
        value: 1,
        ability: "str",
        bonuses: { check: "", passive: "" },
      },
      itm: {
        value: 1,
        ability: "cha",
        bonuses: { check: "", passive: "" },
      },
      prc: {
        value: 1,
        ability: "wis",
        bonuses: { check: "", passive: "" },
      },
    },
    bonuses: {
      mwak: { attack: "", damage: "" },
      rwak: { attack: "", damage: "" },
      msak: { attack: "", damage: "" },
      rsak: { attack: "", damage: "" },
      abilities: { check: "", save: "", skill: "" },
      spell: { dc: "" },
    },
    resources: {
      legact: { value: 0, max: 0 },
      legres: { value: 0, max: 0 },
      lair: { value: false, initiative: 0 },
    },
  },
  prototypeToken: {
    name: "Mechanical Bodyguard",
    displayName: 20,
    displayBars: 20,
    actorLink: true,
    disposition: 1,
    bar1: { attribute: "attributes.hp" },
    sight: { enabled: true, range: 60, visionMode: "darkvision" },
    depth: 1,
  },
  items: [
    /* ── Trait: Living Cover ── */
    {
      name: "Living Cover",
      type: "feat",
      img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
      system: {
        description: {
          value:
            "<p>Allies within 5 feet of the Mechanical Bodyguard have <strong>Half Cover</strong> (+2 bonus to AC and Dexterity saving throws) against attacks and effects that originate from beyond the droid.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Trait" },
        requirements: "",
        activation: { type: "", value: null, condition: "" },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
        activities: {},
      },
      effects: [],
      flags: {},
      sort: 100000,
      _key: "!actors.items!MBGuard000001.LivingCover001",
    },
    /* ── Trait: Executive Attaché ── */
    {
      name: "Executive Attach\u00e9",
      type: "feat",
      img: "icons/containers/chest/chest-reinforced-steel-green.webp",
      system: {
        description: {
          value:
            "<p>The droid is equipped with a secure <strong>150-lb storage compartment</strong> and integrated <strong>comms/recording suite</strong>.</p><p>Additionally, willing creatures adjacent to the Bodyguard may add the Bureaucrat\u0027s <strong>Authority Die</strong> to their Charisma checks.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Trait" },
        requirements: "",
        activation: { type: "", value: null, condition: "" },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
        activities: {},
      },
      effects: [],
      flags: {},
      sort: 200000,
      _key: "!actors.items!MBGuard000001.ExecAttache01",
    },
    /* ── Reaction: Intercept Threat ── */
    {
      name: "Intercept Threat",
      type: "feat",
      img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
      system: {
        description: {
          value:
            "<p><em>Reaction trigger:</em> An ally within 5 feet of the Bodyguard is hit by an attack.</p><p>The Bodyguard redirects the attack to itself, becoming the new target. The original attack roll is compared against the Bodyguard\u0027s AC to determine whether it hits.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Reaction" },
        requirements: "",
        activities: {
          dnd5eactReact01: {
            _id: "dnd5eactReact01",
            type: "utility",
            name: "Intercept Threat",
            img: "",
            activation: {
              type: "reaction",
              value: 1,
              condition: "An ally within 5 ft is hit by an attack",
            },
            consumption: {
              targets: [],
              scaling: { allowed: false },
            },
            duration: {
              units: "inst",
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
                type: "ally",
                choice: false,
                special: "",
              },
              prompt: true,
              override: false,
            },
            uses: { spent: 0, max: "", recovery: [] },
            sort: 0,
          },
        },
        activation: {
          type: "reaction",
          value: 1,
          condition: "An ally within 5 ft is hit by an attack",
        },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
      },
      effects: [],
      flags: {},
      sort: 300000,
      _key: "!actors.items!MBGuard000001.IntrcptThrt01",
    },
    /* ── Weapon: Stun Prod / Slam ── */
    {
      name: "Stun Prod / Slam",
      type: "weapon",
      img: "icons/weapons/maces/mace-round-spiked-grey.webp",
      system: {
        description: {
          value:
            "<p><em>Melee Weapon Attack.</em> The Bodyguard strikes with its integrated stun prod or chassis-reinforced fist.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "natural" },
        requirements: "",
        equipped: true,
        proficient: true,
        quantity: 1,
        weight: { value: 0, units: "lb" },
        price: { value: 0, denomination: "gp" },
        rarity: "",
        identified: true,
        ability: "str",
        actionType: "mwak",
        range: { value: 5, long: null, units: "ft" },
        damage: { parts: [], versatile: "" },
        activities: {
          dnd5eactAtk001: {
            _id: "dnd5eactAtk001",
            type: "attack",
            name: "Stun Prod / Slam",
            img: "",
            activation: { type: "action", value: 1, condition: "" },
            consumption: {
              targets: [],
              scaling: { allowed: false },
            },
            duration: {
              units: "inst",
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
                type: "creature",
                choice: false,
                special: "",
              },
              prompt: true,
              override: false,
            },
            attack: {
              ability: "str",
              bonus: "",
              critical: { threshold: null },
              flat: false,
              type: { value: "melee", classification: "weapon" },
            },
            damage: {
              critical: { bonus: "" },
              includeBase: true,
              parts: [
                {
                  number: 1,
                  denomination: 4,
                  bonus: "2 + @prof",
                  types: ["bludgeoning"],
                  custom: {
                    enabled: true,
                    formula: "1d4 + 2 + @prof",
                  },
                  scaling: { mode: "", number: null, formula: "" },
                },
              ],
            },
            uses: { spent: 0, max: "", recovery: [] },
            sort: 0,
          },
        },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
      },
      effects: [],
      flags: {},
      sort: 400000,
      _key: "!actors.items!MBGuard000001.StunProdSlam1",
    },
    /* ── Action: Detain ── */
    {
      name: "Detain",
      type: "feat",
      img: "icons/skills/melee/maneuver-chains-yellow.webp",
      system: {
        description: {
          value:
            "<p>The Bodyguard attempts to seize a creature within 5 feet. The target must succeed on a <strong>Strength</strong> or <strong>Dexterity</strong> saving throw (target\u0027s choice) against the <strong>Program Save DC</strong> or become <strong>Grappled</strong>.</p><p>While grappled in this way, the creature is also <strong>Restrained</strong> if the Bodyguard is not incapacitated. The grapple ends if the Bodyguard is incapacitated or the target is moved outside its reach.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Action" },
        requirements: "",
        activities: {
          dnd5eactSave01: {
            _id: "dnd5eactSave01",
            type: "save",
            name: "Detain",
            img: "",
            activation: { type: "action", value: 1, condition: "" },
            consumption: {
              targets: [],
              scaling: { allowed: false },
            },
            duration: {
              units: "inst",
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
                type: "creature",
                choice: false,
                special: "",
              },
              prompt: true,
              override: false,
            },
            save: {
              ability: ["str", "dex"],
              dc: { calculation: "str", formula: "" },
            },
            damage: {
              critical: { bonus: "" },
              includeBase: false,
              parts: [],
            },
            effects: [],
            uses: { spent: 0, max: "", recovery: [] },
            sort: 0,
          },
        },
        activation: { type: "action", value: 1, condition: "" },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
      },
      effects: [],
      flags: {},
      sort: 500000,
      _key: "!actors.items!MBGuard000001.DetainAct001",
    },
    /* ── Action: Riot Shove ── */
    {
      name: "Riot Shove",
      type: "feat",
      img: "icons/skills/melee/strike-shield-spiked-teal.webp",
      system: {
        description: {
          value:
            "<p>The Bodyguard shoves a creature within 5 feet with its reinforced chassis. The target must succeed on a <strong>Strength</strong> saving throw against the <strong>Program Save DC</strong> or be pushed <strong>5 feet</strong> away from the Bodyguard and knocked <strong>Prone</strong>.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Action" },
        requirements: "",
        activities: {
          dnd5eactSave02: {
            _id: "dnd5eactSave02",
            type: "save",
            name: "Riot Shove",
            img: "",
            activation: { type: "action", value: 1, condition: "" },
            consumption: {
              targets: [],
              scaling: { allowed: false },
            },
            duration: {
              units: "inst",
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
                type: "creature",
                choice: false,
                special: "",
              },
              prompt: true,
              override: false,
            },
            save: {
              ability: ["str"],
              dc: { calculation: "str", formula: "" },
            },
            damage: {
              critical: { bonus: "" },
              includeBase: false,
              parts: [],
            },
            effects: [],
            uses: { spent: 0, max: "", recovery: [] },
            sort: 0,
          },
        },
        activation: { type: "action", value: 1, condition: "" },
        uses: {
          value: null,
          max: "",
          per: null,
          recovery: "",
          prompt: false,
        },
      },
      effects: [],
      flags: {},
      sort: 600000,
      _key: "!actors.items!MBGuard000001.RiotShove001",
    },
  ],
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!actors!MBGuard000001",
});

/* ================================================================== */
/*  4.  BUREAUCRAT CLASS  →  src/classes/                              */
/* ================================================================== */

console.log("\n▸ Bureaucrat class");

write("src/classes/bureaucrat.json", {
  name: "Bureaucrat",
  type: "class",
  img: "icons/skills/social/diplomacy-peace-handshake.webp",
  system: {
    description: {
      value:
        "<p>A master of administrative authority, corporate leverage, and nanoprogram-augmented leadership. The Bureaucrat commands the battlefield not through brute force, but through calculated orders, regulatory overrides, and an ever-present Mechanical Bodyguard.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "bureaucrat",
    levels: 1,
    hd: { denomination: 6, spent: 0, additional: "" },
    primaryAbility: { value: ["cha"], all: false },
    spellcasting: { progression: "full", ability: "cha" },
    advancement: [
      /* ── Hit Points ── */
      {
        _id: "a1b2HitPnts0001",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: CHA, WIS ── */
      {
        _id: "c3d4SaveProf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:cha", "saves:wis"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Skills: choice of 3 ── */
      {
        _id: "e5f6SkillPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 3,
              pool: [
                "skills:per",
                "skills:dec",
                "skills:itm",
                "skills:ins",
                "skills:lor",
                "skills:tec",
                "skills:prc",
                "skills:inv",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },
      /* ── Weapons: Simple + Sidearm ── */
      {
        _id: "g7h8WeaponPr001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:sidearm"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Tools: choice of 1 ── */
      {
        _id: "i9j0ToolsPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: ["tools:slicer", "tools:datapad", "tools:gaming"],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Tool Proficiencies",
      },
      /* ── ScaleValue: Authority Die ── */
      {
        _id: "k1l2AuthDieSc01",
        type: "ScaleValue",
        configuration: {
          identifier: "authority-die",
          type: "dice",
          scale: {
            1: { number: 1, faces: 6 },
            5: { number: 1, faces: 8 },
            10: { number: 1, faces: 10 },
            15: { number: 1, faces: 12 },
          },
        },
        value: {},
        level: 1,
        title: "Authority Die",
      },
      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "n5o6NanoplPts01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1:  { value: 4 },
            2:  { value: 8 },
            3:  { value: 12 },
            4:  { value: 16 },
            5:  { value: 20 },
            6:  { value: 24 },
            7:  { value: 28 },
            8:  { value: 32 },
            9:  { value: 36 },
            10: { value: 40 },
            11: { value: 44 },
            12: { value: 48 },
            13: { value: 52 },
            14: { value: 56 },
            15: { value: 60 },
            16: { value: 64 },
            17: { value: 68 },
            18: { value: 72 },
            19: { value: 76 },
            20: { value: 80 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },
      /* ── ScaleValue: Directives Known ── */
      {
        _id: "p7q8DirKnown001",
        type: "ScaleValue",
        configuration: {
          identifier: "directives-known",
          type: "number",
          scale: {
            2:  { value: 2 },
            3:  { value: 3 },
            4:  { value: 3 },
            5:  { value: 5 },
            6:  { value: 5 },
            7:  { value: 6 },
            8:  { value: 6 },
            9:  { value: 7 },
            10: { value: 7 },
            11: { value: 7 },
            12: { value: 8 },
            13: { value: 8 },
            14: { value: 8 },
            15: { value: 9 },
            16: { value: 9 },
            17: { value: 9 },
            18: { value: 10 },
            19: { value: 10 },
            20: { value: 10 },
          },
        },
        value: {},
        level: 2,
        title: "Directives Known",
      },
      /* ── ItemGrant: Level 1 (Nanoprogramming + Baton) ── */
      {
        _id: "A1B2ItmGrLv0101",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NanoProgramm001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.BatonAuthort001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Bureaucrat Features",
      },
      /* ── ItemGrant: Level 2 (MBG License + Executive Directives) ── */
      {
        _id: "C3D4ItmGrLv0201",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MBGLicense00001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ExecDirectiv001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Bureaucrat Features",
      },
      /* ── Subclass: Level 3 ── */
      {
        _id: "y5z6Subclass001",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Executive Doctrine",
      },
      /* ── ItemGrant: Level 3 (Sage Advice) ── */
      {
        _id: "E5F6ItmGrLv0301",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SageAdvice00001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Bureaucrat Features",
      },
      /* ── ASI: Level 4 ── */
      {
        _id: "o5p6ASILvl04001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },
      /* ── ItemGrant: Level 5 (Font of Leadership) ── */
      {
        _id: "G7H8ItmGrLv0501",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FontLeadersh01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Bureaucrat Features",
      },
      /* ── ItemGrant: Level 7 (Countercharm) ── */
      {
        _id: "I9J0ItmGrLv0701",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.Countercharm01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Bureaucrat Features",
      },
      /* ── ASI: Level 8 ── */
      {
        _id: "q7r8ASILvl08001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },
      /* ── ASI: Level 12 ── */
      {
        _id: "s9t0ASILvl12001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },
      /* ── ItemGrant: Level 14 (Calm and Collected) ── */
      {
        _id: "K1L2ItmGrLv1401",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.CalmCollect001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Bureaucrat Features",
      },
      /* ── ASI: Level 16 ── */
      {
        _id: "u1v2ASILvl16001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },
      /* ── ASI: Level 19 ── */
      {
        _id: "w3x4ASILvl19001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },
      /* ── ItemGrant: Level 20 (Chairman of the Board) ── */
      {
        _id: "M3N4ItmGrLv2001",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ChairmanBrd001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Bureaucrat Features",
      },
    ],
    wealth: "4d4 * 10",
    startingEquipment: [],
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!BureaucratCls01",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Bureaucrat build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
