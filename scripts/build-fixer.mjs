#!/usr/bin/env node
/**
 * build-fixer.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Fixer class package:
 *   • src/features/fixer/            – 20 core class features
 *   • src/features/fixer/deals/      – 21 Black Market Deals
 *   • src/classes/fixer.json         – Fixer class document
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

/** Standard feat scaffold for Fixer features and deals */
function createFeat({
  id,
  name,
  img = "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  description,
  subtype = "",
  requirements = "Fixer 1",
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
/*  1.  CORE CLASS FEATURES  →  src/features/fixer/                   */
/* ================================================================== */

console.log("\n▸ Fixer Core Class Features");

// 1. Expertise (Level 1 & 6)
write("src/features/fixer/expertise.json", createFeat({
  id: "FixExpertise0001",
  name: "Expertise",
  img: "icons/tools/scribing/magnifying-glass-brass.webp",
  requirements: "Fixer 1",
  description:
    "<p>At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and one of your tool proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>" +
    "<p>At 6th level, you can choose two more of your proficiencies (in skills or tools) to gain this benefit.</p>",
}));

// 2. Sneak Attack (Level 1)
write("src/features/fixer/sneak-attack.json", createFeat({
  id: "FixSneakAttack01",
  name: "Sneak Attack",
  img: "icons/weapons/daggers/dagger-curved-glowing-green.webp",
  requirements: "Fixer 1",
  description:
    "<p>Beginning at 1st level, you know how to exploit a target's momentary distractions. Once per turn, you can deal an extra <strong>1d6 damage</strong> to one creature you hit with an attack if you have <strong>Advantage on the attack roll</strong>. The attack must use a <strong>Finesse weapon or a Ranged weapon</strong>.</p>" +
    "<p>You don't need Advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have Disadvantage on the attack roll.</p>" +
    "<p>Additionally, you can deal Sneak Attack damage to a target that fails a Dexterity saving throw with <strong>Disadvantage</strong> against one of your nanoprograms or features.</p>" +
    "<p>The extra damage increases as you gain levels in this class, scaling to <strong>5d6</strong> at 17th level (`@scale.fixer.sneak-attack`).</p>",
  activities: {
    dnd5eactSneakAtk: {
      _id: "dnd5eactSneakAtk",
      type: "damage",
      name: "Sneak Attack Damage",
      img: "",
      activation: { type: "special", value: null, condition: "Once per turn with Finesse/Ranged weapon on Advantage or adjacent ally" },
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
            number: null,
            denomination: null,
            bonus: "@scale.fixer.sneak-attack",
            types: ["kinetic"],
            custom: { enabled: true, formula: "@scale.fixer.sneak-attack" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 3. Nanoprogramming (Level 1)
write("src/features/fixer/nanoprogramming.json", createFeat({
  id: "FixNanoProg00001",
  name: "Nanoprogramming",
  img: "icons/magic/symbols/runes-star-pentagon-cyan.webp",
  requirements: "Fixer 1",
  description:
    "<p>At 1st level, your cyberdeck and neural interfaces grant you half-caster progression in combat nanoprograms, scaling from Tier 1 up to Tier 5 programs.</p>" +
    "<h3>Intelligence Nanocasting</h3>" +
    "<p><strong>Intelligence</strong> is your nanocasting ability for Fixer nanoprograms, reflecting your hacking speed and technical optimization.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Intelligence modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Intelligence modifier</li>" +
    "</ul>" +
    "<h3>Programs Known</h3>" +
    "<p>You know <strong>4 nanoprograms</strong> of your choice from the Fixer Operating System at 1st level, and learn additional programs as shown on the class table.</p>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your maximum Nanopool points equal <strong>(Fixer level &times; 2) + your Intelligence modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>",
}));

// 4. Weapon Mastery (Level 1)
write("src/features/fixer/weapon-mastery.json", createFeat({
  id: "FixWpnMastery001",
  name: "Weapon Mastery",
  img: "icons/weapons/swords/sword-broad-crystal-blue.webp",
  requirements: "Fixer 1",
  description:
    "<p>Your specialized weapons training allows you to utilize the mastery properties of <strong>two weapons</strong> of your choice with which you are proficient.</p>" +
    "<p>Whenever you finish a <strong>Long Rest</strong>, you can practice weapon modifications and swap which weapons you have mastery over.</p>",
}));

// 5. Grid Armor (Level 2)
write("src/features/fixer/grid-armor.json", createFeat({
  id: "FixGridArmor0001",
  name: "Grid Armor",
  img: "icons/equipment/chest/vest-leather-strapped-grey.webp",
  requirements: "Fixer 2",
  description:
    "<p>Starting at 2nd level, you deploy a personal <strong>Multi-Spatial Phasing Beacon</strong> that projects digital decoy projections into reality.</p>" +
    "<h3>Active Decoys</h3>" +
    "<p>You have a maximum number of active decoys determined by your Fixer level: <strong>1 at 2nd level, 2 at 5th level, 3 at 11th level, and 4 at 17th level</strong> (`@scale.fixer.grid-decoys`). You regain all expended decoys when you finish a <strong>Short or Long Rest</strong>.</p>" +
    "<h3>Decoy Interception</h3>" +
    "<p>Whenever you are hit by an attack roll while you have at least one active decoy, roll a <strong>1d6</strong>. On a <strong>3 or higher</strong>, the attack hits one of your decoys instead of you. The decoy is instantly destroyed and vanishes into static, leaving you completely unharmed by the attack.</p>" +
    "<h3>Tactical Slipstream</h3>" +
    "<p>While you have at least one active decoy deployed, you can take the <strong>Dash or Disengage</strong> action as a <strong>Bonus Action</strong> on each of your turns.</p>" +
    "<h3>Kinetic Reconstitution</h3>" +
    "<p>Whenever you move <strong>40 feet or more</strong> during your turn, the sheer kinetic displacement immediately reconstructs <strong>1 destroyed decoy</strong> (up to your maximum).</p>",
  uses: {
    value: "@scale.fixer.grid-decoys",
    max: "@scale.fixer.grid-decoys",
    per: "sr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactDecoy: {
      _id: "dnd5eactDecoy",
      type: "utility",
      name: "Decoy Intercept Roll",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When hit by an attack roll while a decoy is active (1d6: 3+ destroys decoy, negates hit)" },
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
    dnd5eactGridDash: {
      _id: "dnd5eactGridDash",
      type: "utility",
      name: "Tactical Slipstream (Dash / Disengage)",
      img: "",
      activation: { type: "bonus", value: 1, condition: "While at least one decoy is active" },
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
      sort: 1,
    },
  },
}));

// 6. Cunning Gambits (Level 2)
write("src/features/fixer/cunning-gambits.json", createFeat({
  id: "FixCunningGamb01",
  name: "Cunning Gambits",
  img: "icons/skills/melee/strike-blade-slashing-cyan.webp",
  requirements: "Fixer 2",
  description:
    "<p>At 2nd level, you can sacrifice Sneak Attack dice to execute tactical gambits that disrupt enemy hardware and positioning:</p>" +
    "<ul>" +
    "<li><strong>Snare (Cost: 1d6)</strong>: The target must make a <strong>Strength saving throw</strong> against your Program Save DC. On a failure, its speed is <strong>halved</strong> and it has <strong>Disadvantage on Dexterity saving throws</strong> until the start of your next turn.</li>" +
    "<li><strong>Trace (Cost: 1d6)</strong>: You plant a digital beacon on the target lasting <strong>8 hours</strong>. For the duration, the target cannot benefit from being invisible or obscured against you, cannot take the Hide action against you, and you have <strong>Advantage on Intelligence (Technology) and Intelligence (Investigation) checks</strong> made to track it anywhere on the same planet.</li>" +
    "<li><strong>Steal (Cost: 1d6)</strong>: The target must make a <strong>Dexterity saving throw</strong> against your Program Save DC. On a failure, one accessible item it is holding or wearing (such as a sidearm, datapad, or keycard) drops to the ground in an unoccupied space within 5 feet of it.</li>" +
    "<li><strong>Root (Cost: 2d6)</strong>: The target must make a <strong>Strength saving throw</strong> against your Program Save DC. On a failure, it is <strong>Restrained</strong> by micro-monofilament wires until the end of its next turn.</li>" +
    "</ul>",
  activities: {
    dnd5eactGmbSnare: {
      _id: "dnd5eactGmbSnare",
      type: "save",
      name: "Gambit: Snare (1d6)",
      img: "",
      activation: { type: "special", value: null, condition: "Forgo 1d6 Sneak Attack damage" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["str"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactGmbTrace: {
      _id: "dnd5eactGmbTrace",
      type: "utility",
      name: "Gambit: Trace (1d6)",
      img: "",
      activation: { type: "special", value: null, condition: "Forgo 1d6 Sneak Attack damage" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "8", units: "hour", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
    dnd5eactGmbSteal: {
      _id: "dnd5eactGmbSteal",
      type: "save",
      name: "Gambit: Steal (1d6)",
      img: "",
      activation: { type: "special", value: null, condition: "Forgo 1d6 Sneak Attack damage" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["dex"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 2,
    },
    dnd5eactGmbRoot: {
      _id: "dnd5eactGmbRoot",
      type: "save",
      name: "Gambit: Root (2d6)",
      img: "",
      activation: { type: "special", value: null, condition: "Forgo 2d6 Sneak Attack damage" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["str"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 3,
    },
  },
}));

// 7. Black Market Deals (Level 2)
write("src/features/fixer/black-market-deals.json", createFeat({
  id: "FixBlkMktDeals01",
  name: "Black Market Deals",
  img: "icons/commodities/materials/scrap-circuit-board.webp",
  requirements: "Fixer 2",
  description:
    "<p>At 2nd level, your connections across orbital syndicates, chop-shops, and smuggler dens grant you <strong>Black Market Deals</strong> — illicit gear modifications and underworld protocols.</p>" +
    "<p>You gain <strong>two Black Market Deals</strong> of your choice from the Black Market Deals compendium. You learn additional deals as shown in the Deals Known column of the Fixer table (`@scale.fixer.deals-known`), scaling to 10 deals at 18th level.</p>" +
    "<p>Whenever you gain a level in this class, you can choose one of the deals you know and replace it with another deal for which you qualify.</p>",
}));

// 8. Bad Feeling (Level 3)
write("src/features/fixer/bad-feeling.json", createFeat({
  id: "FixBadFeeling001",
  name: "Bad Feeling",
  img: "icons/skills/awareness/sense-alertness-danger-cyan.webp",
  requirements: "Fixer 3",
  description:
    "<p>Starting at 3rd level, your survival instincts scream before the ambush is sprung. When you roll Initiative, you can immediately <strong>move up to your speed</strong> before turn order is determined and before any creature takes an action.</p>" +
    "<p>Once you use this feature, you cannot do so again until you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactBadFeeling: {
      _id: "dnd5eactBadFeeling",
      type: "utility",
      name: "Pre-Emptive Surge",
      img: "",
      activation: { type: "special", value: null, condition: "When rolling Initiative" },
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

// 9. Hack Dummy Order (Level 4)
write("src/features/fixer/hack-dummy-order.json", createFeat({
  id: "FixHackDummyOrd1",
  name: "Hack Dummy Order",
  img: "icons/containers/boxes/crate-reinforced-steel-green.webp",
  requirements: "Fixer 4",
  description:
    "<p>At 4th level, you can breach orbital cargo channels and corporate distribution hubs to route automated supply capsules directly to your vicinity.</p>" +
    "<p>You can use this feature a number of times equal to your <strong>Proficiency Bonus</strong> (`@prof`), and regain all expended uses when you finish a <strong>Long Rest</strong>.</p>" +
    "<p>By spending 10 minutes tapping an automated transceiver, a container arrives containing requested ammunition, rations, encrypted datapads, or field tech worth up to 100 credits.</p>",
  uses: {
    value: "@prof",
    max: "@prof",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactDummyOrd: {
      _id: "dnd5eactDummyOrd",
      type: "utility",
      name: "Requisition Supply Drop",
      img: "",
      activation: { type: "minute", value: 10, condition: "Spend 1 dummy order use" },
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

// 10. Extra Attack (Level 5)
write("src/features/fixer/extra-attack.json", createFeat({
  id: "FixExtraAttack01",
  name: "Extra Attack",
  img: "icons/skills/melee/strike-weapons-crossed-cyan.webp",
  requirements: "Fixer 5",
  description:
    "<p>Beginning at 5th level, you can attack <strong>twice, instead of once</strong>, whenever you take the <strong>Attack</strong> action on your turn.</p>",
}));

// 11. Run and Gun (Level 5)
write("src/features/fixer/run-and-gun.json", createFeat({
  id: "FixRunAndGun0001",
  name: "Run and Gun",
  img: "icons/weapons/guns/gun-pistol-laser-blue.webp",
  requirements: "Fixer 5",
  description:
    "<p>At 5th level, your offensive momentum never halts. Whenever you take an Action to cast a Fixer nanoprogram or take the <strong>Dash</strong> action on your turn, you can make <strong>one weapon attack as a Bonus Action</strong>.</p>",
  activities: {
    dnd5eactRunGun: {
      _id: "dnd5eactRunGun",
      type: "utility",
      name: "Run and Gun Strike",
      img: "",
      activation: { type: "bonus", value: 1, condition: "When casting a nanoprogram or Dashing with your action" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 12. Grid Armor Mk II (Level 5)
write("src/features/fixer/grid-armor-mk-ii.json", createFeat({
  id: "FixGridArmorMk21",
  name: "Grid Armor Mk II",
  img: "icons/equipment/chest/vest-leather-blue.webp",
  requirements: "Fixer 5",
  description:
    "<p>At 5th level, your Grid Armor upgrades to <strong>Mk II specifications</strong>:</p>" +
    "<ul>" +
    "<li>Your maximum active decoys increases to <strong>2</strong>.</li>" +
    "<li><strong>Vertical Traversal</strong>: While you have at least one decoy active, you can climb vertical surfaces and cross liquids without falling or sinking.</li>" +
    "<li><strong>Shunt</strong>: Whenever you take the Dash action, you instantly purge any mundane restraints, grapples, or non-magical slow effects affecting you.</li>" +
    "<li><strong>NCU Speed Optimizer</strong>: Whenever you take the Dash action while a decoy is active, your walking speed increases by an additional <strong>+15 feet</strong> for the turn.</li>" +
    "</ul>",
}));

// 13. Fixer Grid (Level 6)
write("src/features/fixer/fixer-grid.json", createFeat({
  id: "FixFixerGrid0001",
  name: "Fixer Grid: The Node",
  img: "icons/magic/symbols/triangle-glow-purple.webp",
  requirements: "Fixer 6",
  description:
    "<p>At 6th level, you construct an extradimensional subnet lounge anchored to your cyberdeck known as <strong>The Node</strong>.</p>" +
    "<ul>" +
    "<li>As an <strong>Action</strong>, you step into The Node. You can remain inside for up to <strong>2 &times; your Proficiency Bonus hours</strong> before being gently displaced to your entry point.</li>" +
    "<li>You can exit The Node at any time as a <strong>Bonus Action</strong>.</li>" +
    "<li>The Node includes a secure storage locker that can hold up to <strong>500 lbs</strong> of cargo and contraband.</li>" +
    "<li><strong>High-Bandwidth Expansion (11th Level)</strong>: You can bring a number of willing allies equal to your <strong>Intelligence modifier</strong> into The Node with you. While inside, your team completes a <strong>Short Rest in just 10 minutes</strong>.</li>" +
    "</ul>",
  activities: {
    dnd5eactEnterNode: {
      _id: "dnd5eactEnterNode",
      type: "utility",
      name: "Enter The Node",
      img: "",
      activation: { type: "action", value: 1, condition: "" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "hour", value: "4", concentration: false, override: false },
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

// 14. Evasion (Level 7)
write("src/features/fixer/evasion.json", createFeat({
  id: "FixEvasion000001",
  name: "Evasion",
  img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  requirements: "Fixer 7",
  description:
    "<p>Beginning at 7th level, your agility allows you to slip away from devastating area effects.</p>" +
    "<p>When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take <strong>no damage</strong> if you succeed on the saving throw, and only <strong>half damage</strong> if you fail.</p>",
}));

// 15. Slicer's Hotkeys (Level 7)
write("src/features/fixer/slicers-hotkeys.json", createFeat({
  id: "FixSlicersHotk01",
  name: "Slicer's Hotkeys",
  img: "icons/tools/electronics/datapad-blue.webp",
  requirements: "Fixer 7",
  description:
    "<p>By 7th level, your muscle memory and interface macros eliminate amateur errors. Whenever you make a <strong>Dexterity or Intelligence check</strong> that incorporates your Proficiency Bonus, you treat any d20 roll of <strong>9 or lower as a 10</strong>.</p>",
}));

// 16. Grid Armor Mk III (Level 11)
write("src/features/fixer/grid-armor-mk-iii.json", createFeat({
  id: "FixGridArmorMk31",
  name: "Grid Armor Mk III",
  img: "icons/equipment/chest/vest-leather-black.webp",
  requirements: "Fixer 11",
  description:
    "<p>At 11th level, your multi-spatial decoys are upgraded to <strong>Mk III specifications</strong>:</p>" +
    "<ul>" +
    "<li>Your maximum active decoys increases to <strong>3</strong>.</li>" +
    "<li>Whenever a creature targets or destroys one of your decoys with an attack or harmful effect, it suffers blinding pixelation and telemetry lag, imposing <strong>Disadvantage on its Dexterity saving throws</strong> until the end of its next turn.</li>" +
    "</ul>",
}));

// 17. Encrypted Neural Net (Level 13)
write("src/features/fixer/encrypted-neural-net.json", createFeat({
  id: "FixEncryptNet001",
  name: "Encrypted Neural Net",
  img: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
  requirements: "Fixer 13",
  description:
    "<p>At 13th level, military-grade cryptographic suites harden your mind and personal comms against all intrusion:</p>" +
    "<ul>" +
    "<li>You gain <strong>proficiency in Wisdom saving throws</strong>.</li>" +
    "<li>Your thoughts, internal comms, and biometric signals are completely <strong>immune to telepathic reading, electronic surveillance, and location tracking</strong> unless you explicitly grant administrative permission.</li>" +
    "</ul>",
}));

// 18. Grid Beacon (Level 14)
write("src/features/fixer/grid-beacon.json", createFeat({
  id: "FixGridBeacon001",
  name: "Grid Beacon",
  img: "icons/magic/symbols/rune-sigil-teleport-blue.webp",
  requirements: "Fixer 14",
  description:
    "<p>At 14th level, you can anchor an emergency quantum beacon to any terminal or location. As an <strong>Action</strong>, you designate a digital node where you are standing.</p>" +
    "<p>Subsequently, as an <strong>Action</strong> costing <strong>7 Nanopool points</strong>, you instantly teleport yourself and up to <strong>5 willing allies within 5 feet</strong> directly to the marked node, regardless of distance on the same planet.</p>" +
    "<p>This sudden transit imposes <strong>1 level of exhaustion</strong> on each teleported creature. Once you execute this emergency recall, you cannot do so again until you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactGridBeacon: {
      _id: "dnd5eactGridBeacon",
      type: "utility",
      name: "Emergency Grid Teleport",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 7 Nanopool points (1/Long Rest)" },
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
        affects: { count: "6", type: "willing", choice: false, special: "self + 5 allies within 5 ft" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 19. Grid Armor Mk IV (Level 20)
write("src/features/fixer/grid-armor-mk-iv.json", createFeat({
  id: "FixGridArmorMk41",
  name: "Grid Armor Mk IV",
  img: "icons/equipment/chest/breastplate-leather-glowing-cyan.webp",
  requirements: "Fixer 20",
  description:
    "<p>At 20th level, your dimensional shielding achieves total synchronization. While you have at least one active decoy deployed, <strong>attacks cannot have Advantage against you or your decoys</strong> under any circumstances.</p>",
}));

// 20. Ghost in the Grid (Level 20)
write("src/features/fixer/ghost-in-the-grid.json", createFeat({
  id: "FixGhostInGrid01",
  name: "Ghost in the Grid",
  img: "icons/magic/control/buff-flight-wings-runes-blue.webp",
  requirements: "Fixer 20",
  description:
    "<p>At 20th level, you transcend biological limits:</p>" +
    "<ul>" +
    "<li>Your <strong>Dexterity and Intelligence scores increase by 2</strong>, and your maximum for those scores increases to <strong>22</strong>.</li>" +
    "<li><strong>Reality Override</strong>: Once per <strong>Short or Long Rest</strong>, when you fail a d20 Test (attack roll, ability check, or saving throw), you can turn the roll into a <strong>20</strong>.</li>" +
    "</ul>",
  uses: {
    value: 1,
    max: "1",
    per: "sr",
    recovery: "",
    prompt: false,
  },
  advancement: [
    {
      _id: "advFixGhostASI01",
      type: "AbilityScoreImprovement",
      configuration: {
        points: 0,
        fixed: { str: 0, dex: 2, con: 0, int: 2, wis: 0, cha: 0 },
        cap: 22,
      },
      value: { type: "asi", dex: 2, int: 2 },
      level: 20,
      title: "Dexterity & Intelligence Increase (+2, cap 22)",
    },
  ],
  activities: {
    dnd5eactTurnTo20: {
      _id: "dnd5eactTurnTo20",
      type: "utility",
      name: "Reality Override (Turn to 20)",
      img: "",
      activation: { type: "special", value: null, condition: "When failing a d20 Test (1/Short or Long Rest)" },
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

/* ================================================================== */
/*  2.  BLACK MARKET DEALS  →  src/features/fixer/deals/              */
/* ================================================================== */

console.log("\n▸ Fixer Black Market Deals");
const DEAL_PATH = "src/features/fixer/deals";

function createDeal({ id, name, requirements = "Fixer 2", description, activities = {}, uses }) {
  return createFeat({
    id,
    name: `Deal: ${name}`,
    img: "icons/commodities/materials/scrap-circuit-board.webp",
    description,
    subtype: "deal",
    requirements,
    activities,
    uses,
  });
}

// 1. Appraiser's Eye
write(`${DEAL_PATH}/appraisers-eye.json`, createDeal({
  id: "DealAppraiser001",
  name: "Appraiser's Eye",
  requirements: "Fixer 2",
  description:
    "<p>Spending 1 minute carefully inspecting an object, datapad, or weapon reveals its true market value, whether it is counterfeit, any embedded tracking beacons or DRM restrictions, and which criminal faction or corporate syndicate would pay the highest bounty for it.</p>",
}));

// 2. Ablative Static (Req: L5, Grid Armor)
write(`${DEAL_PATH}/ablative-static.json`, createDeal({
  id: "DealAblativeSt01",
  name: "Ablative Static",
  requirements: "Fixer 5, Grid Armor",
  description:
    "<p>Whenever one of your active decoys within 30 feet is hit and destroyed by an attack, you can use your <strong>Reaction</strong> to discharge volatile static into the attacker. The attacker takes lightning/ion damage equal to your <strong>Intelligence modifier + your Proficiency Bonus</strong>.</p>",
  activities: {
    dnd5eactAblStatic: {
      _id: "dnd5eactAblStatic",
      type: "damage",
      name: "Ablative Static Retaliation",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a decoy within 30 ft is destroyed" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "the attacker" },
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
            bonus: "@abilities.int.mod + @prof",
            types: ["lightning"],
            custom: { enabled: true, formula: "@abilities.int.mod + @prof" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 3. Baffled Lining
write(`${DEAL_PATH}/baffled-lining.json`, createDeal({
  id: "DealBaffledLin01",
  name: "Baffled Lining",
  requirements: "Fixer 2",
  description:
    "<p>Your jackets and gear containers are modified with sensor-absorbent lead-alloy foam. You can conceal up to <strong>20 lbs of gear, weapons, or contraband</strong> from all electronic scanners, physical pat-downs, and chemical sniffers.</p>",
}));

// 4. Bar Brawl Opportunist
write(`${DEAL_PATH}/bar-brawl-opportunist.json`, createDeal({
  id: "DealBarBrawlOp01",
  name: "Bar Brawl Opportunist",
  requirements: "Fixer 2",
  description:
    "<p>Improvised weapons gain the <strong>Finesse</strong> property in your hands, deal <strong>1d6 kinetic damage</strong>, and qualify for your Sneak Attack.</p>" +
    "<p>When you hit a creature with an improvised weapon, you can choose to break the weapon. If you do so, the target must succeed on a <strong>Strength saving throw</strong> against your Program Save DC or be knocked <strong>Prone</strong>.</p>",
}));

// 5. Breach and Brick (Req: L5)
write(`${DEAL_PATH}/breach-and-brick.json`, createDeal({
  id: "DealBreachBrick1",
  name: "Breach and Brick",
  requirements: "Fixer 5",
  description:
    "<p>As an <strong>Action</strong> using slicer's tools or tech tools, you can permanently brick an electronic lock, access terminal, or vehicle ignition you touch. The mechanism cannot be unlocked or bypassed through digital hacking or access cards until fully overhauled by a technician over 24 hours.</p>",
}));

// 6. Dirty Ricochet
write(`${DEAL_PATH}/dirty-ricochet.json`, createDeal({
  id: "DealDirtyRicoch1",
  name: "Dirty Ricochet",
  requirements: "Fixer 2",
  description:
    "<p>Your ranged weapon attacks ignore <strong>Half Cover and Three-Quarters Cover</strong>, provided there is a solid surface (such as a metal bulkhead, concrete wall, or paving) within 10 feet of your target to ricochet the shot.</p>",
}));

// 7. Hair-Trigger Mod
write(`${DEAL_PATH}/hair-trigger-mod.json`, createDeal({
  id: "DealHairTrigger1",
  name: "Hair-Trigger Mod",
  requirements: "Fixer 2",
  description:
    "<p>You can draw or stow any number of weapons on your turn for free without using your object interaction.</p>" +
    "<p>Additionally, when Initiative is rolled, you can immediately draw a light weapon and make <strong>one weapon attack before any other creature takes a turn</strong>.</p>",
}));

// 8. Hotwired Relocator (Req: L6, Fixer Grid)
write(`${DEAL_PATH}/hotwired-relocator.json`, createDeal({
  id: "DealHotwiredRel1",
  name: "Hotwired Relocator",
  requirements: "Fixer 6, Fixer Grid",
  description:
    "<p>Whenever you move <strong>40 feet or more</strong> on your turn, you can enter or exit <strong>The Node</strong> as a <strong>Bonus Action</strong> instead of an Action.</p>" +
    "<p>Exiting The Node in this fashion instantly reconstitutes <strong>1 destroyed decoy</strong> for your Grid Armor.</p>",
}));

// 9. Kinetic Tether
write(`${DEAL_PATH}/kinetic-tether.json`, createDeal({
  id: "DealKineticTeth1",
  name: "Kinetic Tether",
  requirements: "Fixer 2",
  description:
    "<p>When you successfully execute the <strong>Snare Gambit</strong> on a creature, you can choose to either pull the target up to <strong>10 feet straight toward you</strong>, or immediately pull yourself up to <strong>10 feet straight toward the target</strong> without provoking opportunity attacks.</p>",
}));

// 10. I Know a Guy (Req: L5)
write(`${DEAL_PATH}/i-know-a-guy.json`, createDeal({
  id: "DealIKnowAGuy001",
  name: "I Know a Guy",
  requirements: "Fixer 5",
  description:
    "<p>By spending 1 hour in any populated settlement, orbital station, or corporate colony, you can establish contact with one underworld asset:</p>" +
    "<ul>" +
    "<li><strong>Forger</strong>: Supplies forged planetary visas, crew manifests, or corporate IDs within 24 hours.</li>" +
    "<li><strong>Chop-Doc</strong>: Provides black-market medical treatment, restoring hit points and neutralizing diseases/toxins for reasonable credit fees.</li>" +
    "<li><strong>Fence</strong>: Liquidates stolen goods and illicit cargo at 60% of original value with zero questions asked.</li>" +
    "</ul>",
}));

// 11. Pocket Flare
write(`${DEAL_PATH}/pocket-flare.json`, createDeal({
  id: "DealPocketFlare1",
  name: "Pocket Flare",
  requirements: "Fixer 2",
  description:
    "<p>As a <strong>Reaction</strong> when a hostile creature moves within 5 feet of you, you can trigger a blinding micro-flare in its face. The target must succeed on a <strong>Dexterity saving throw</strong> against your Program Save DC or have <strong>Disadvantage on all attack rolls</strong> until the end of its current turn.</p>" +
    "<p>You can use this feature once per <strong>Short or Long Rest</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "sr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactPktFlare: {
      _id: "dnd5eactPktFlare",
      type: "save",
      name: "Discharge Pocket Flare",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a hostile enters 5 ft (1/Short or Long Rest)" },
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
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { value: "5", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "enemy", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["dex"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 12. Sensor Blindspot (Req: L9)
write(`${DEAL_PATH}/sensor-blindspot.json`, createDeal({
  id: "DealSensorBlind1",
  name: "Sensor Blindspot",
  requirements: "Fixer 9",
  description:
    "<p>You are inaudible and completely invisible to automated turrets, security cameras, thermal sensors, and electronic motion trackers until you make an attack roll or cast a nanoprogram.</p>",
}));

// 13. Skimmer Rig
write(`${DEAL_PATH}/skimmer-rig.json`, createDeal({
  id: "DealSkimmerRig01",
  name: "Skimmer Rig",
  requirements: "Fixer 2",
  description:
    "<p>Whenever you successfully execute the <strong>Steal Gambit</strong>, your micro-grapple rig whisks the stolen item directly into one of your pockets, harness clips, or your Node storage locker without requiring a free hand.</p>",
}));

// 14. Slipstream Drift
write(`${DEAL_PATH}/slipstream-drift.json`, createDeal({
  id: "DealSlipstreamD1",
  name: "Slipstream Drift",
  requirements: "Fixer 2",
  description:
    "<p>As a <strong>Reaction</strong> whenever one of your decoys is destroyed or a melee attack misses you within 5 feet, you can immediately glide up to <strong>10 feet</strong> to an unoccupied space without provoking opportunity attacks.</p>",
  activities: {
    dnd5eactSlipDrift: {
      _id: "dnd5eactSlipDrift",
      type: "utility",
      name: "Slipstream Glide",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a decoy is destroyed or a melee attack misses within 5 ft" },
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

// 15. Spacer's Cant
write(`${DEAL_PATH}/spacers-cant.json`, createDeal({
  id: "DealSpacersCant1",
  name: "Spacer's Cant",
  requirements: "Fixer 2",
  description:
    "<p>You learn the encrypted sign language, encoded slang, and holographic tagging iconography used by black-market couriers, orbital smugglers, and syndicated slicers.</p>" +
    "<p>You can identify syndicate safehouses, black-market dead drops, active traps, and safe emergency escape routes disguised as graffiti or transit schedules.</p>",
}));

// 16. Spiked Terminal (Req: L9)
write(`${DEAL_PATH}/spiked-terminal.json`, createDeal({
  id: "DealSpikedTerm01",
  name: "Spiked Terminal",
  requirements: "Fixer 9",
  description:
    "<p>By spending 1 minute rigging an electronic console, access terminal, or power junction, you turn it into a dormant trap.</p>" +
    "<p>As a <strong>Reaction</strong> within 60 feet, you can detonate the terminal, forcing every creature within a <strong>10-foot radius</strong> to make a <strong>Dexterity saving throw</strong> against your Program Save DC. On a failure, a creature takes <strong>4d8 ion damage</strong> (or half as much on a success).</p>",
  activities: {
    dnd5eactSpikeTerm: {
      _id: "dnd5eactSpikeTerm",
      type: "save",
      name: "Detonate Spiked Terminal",
      img: "",
      activation: { type: "reaction", value: 1, condition: "Within 60 ft of rigged terminal" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "1", contiguous: false, type: "sphere", size: "10", width: "", height: "", units: "ft" },
        affects: { count: "", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["dex"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: {
        critical: { bonus: "" },
        includeBase: false,
        parts: [
          {
            number: 4,
            denomination: 8,
            bonus: "",
            types: ["lightning"],
            custom: { enabled: true, formula: "4d8" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 17. Spoofed Transponder (Req: L5)
write(`${DEAL_PATH}/spoofed-transponder.json`, createDeal({
  id: "DealSpoofedTran1",
  name: "Spoofed Transponder",
  requirements: "Fixer 5",
  description:
    "<p>Whenever you finish a Short Rest, you can fabricate false transponder codes and security credentials for yourself and up to <strong>5 companions</strong>.</p>" +
    "<p>While utilizing these credentials, your team has <strong>Advantage on Charisma (Deception) checks</strong> made to pass checkpoints, port authorities, and automated planetary scanners.</p>",
}));

// 18. Sub-Level Infiltrator (Req: L5)
write(`${DEAL_PATH}/sub-level-infiltrator.json`, createDeal({
  id: "DealSubLevelInf1",
  name: "Sub-Level Infiltrator",
  requirements: "Fixer 5",
  description:
    "<p>Navigating crawlspaces and service conduits is second nature to you:</p>" +
    "<ul>" +
    "<li>Climbing and squeezing through small spaces costs no extra movement.</li>" +
    "<li>You crawl at your full walking speed.</li>" +
    "<li>Standing up from Prone costs you only <strong>5 feet of movement</strong> instead of half your speed.</li>" +
    "</ul>",
}));

// 19. Suppression Sweep (Req: L9)
write(`${DEAL_PATH}/suppression-sweep.json`, createDeal({
  id: "DealSuppression1",
  name: "Suppression Sweep",
  requirements: "Fixer 9",
  description:
    "<p>When firing a weapon with the Burst or Auto-fire property, you can target <strong>up to two creatures</strong> within your attack's area with your <strong>Snare Gambit or Root Gambit</strong> while paying the Sneak Attack die cost only once.</p>",
}));

// 20. Voxel Flashbang (Req: L13, Grid Armor)
write(`${DEAL_PATH}/voxel-flashbang.json`, createDeal({
  id: "DealVoxelFlashb1",
  name: "Voxel Flashbang",
  requirements: "Fixer 13, Grid Armor",
  description:
    "<p>Whenever one of your active decoys is destroyed by an attack within 10 feet of the attacker, the decoy bursts into high-candela photon glare. The attacker must succeed on a <strong>Constitution saving throw</strong> against your Program Save DC or become <strong>Blinded</strong> until the start of its next turn.</p>",
  activities: {
    dnd5eactVoxelFlash: {
      _id: "dnd5eactVoxelFlash",
      type: "save",
      name: "Voxel Flashbang Burst",
      img: "",
      activation: { type: "special", value: null, condition: "When decoy destroyed within 10 ft of attacker" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { value: "10", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "the attacker" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["con"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 21. Wiretap Bug
write(`${DEAL_PATH}/wiretap-bug.json`, createDeal({
  id: "DealWiretapBug01",
  name: "Wiretap Bug",
  requirements: "Fixer 2",
  description:
    "<p>By spending 1 minute installing a microscopic tap on a communications relay, data terminal, or comms mast, you can monitor all audio conversations and unencrypted data transmissions passing through it out to a range of <strong>1 mile</strong> for the next <strong>24 hours</strong>.</p>",
}));

/* ================================================================== */
/*  3.  FIXER CLASS DOCUMENT  →  src/classes/fixer.json               */
/* ================================================================== */

console.log("\n▸ Fixer Class Document");

write("src/classes/fixer.json", {
  _id: "FixerClass000001",
  name: "Fixer",
  type: "class",
  img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  system: {
    description: {
      value:
        "<p>An underworld slicer, covert operator, and master of digital infiltration. The Fixer bends reality through multi-spatial Grid Armor decoys, executes devastating Sneak Attacks and Cunning Gambits, and manipulates the flow of illicit cargo and back-channel data across the Suns of Rubi.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "fixer",
    levels: 1,
    hd: { denomination: 8, spent: 0, additional: "" },
    primaryAbility: { value: ["dex", "int"], all: false },
    spellcasting: { progression: "half", ability: "int" },
    advancement: [
      /* ── Hit Points (d8) ── */
      {
        _id: "advFixHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: DEX, INT ── */
      {
        _id: "advFixSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:dex", "saves:int"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: lgt, med ── */
      {
        _id: "advFixArmorPrf01",
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
      /* ── Weapon Proficiencies: sim, martial-blaster, martial-vibro ── */
      {
        _id: "advFixWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:martial-blaster", "weapons:martial-vibro"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 4 ── */
      {
        _id: "advFixSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 4,
              pool: [
                "skills:acr",
                "skills:dec",
                "skills:inv",
                "skills:prc",
                "skills:pil",
                "skills:slt",
                "skills:ste",
                "skills:tec",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Sneak Attack ── */
      {
        _id: "advFixScSneak001",
        type: "ScaleValue",
        configuration: {
          identifier: "sneak-attack",
          type: "dice",
          scale: {
            1:  { number: 1, faces: 6 },
            5:  { number: 2, faces: 6 },
            9:  { number: 3, faces: 6 },
            13: { number: 4, faces: 6 },
            17: { number: 5, faces: 6 },
          },
        },
        value: {},
        level: 1,
        title: "Sneak Attack",
      },

      /* ── ScaleValue: Grid Decoys ── */
      {
        _id: "advFixScDecoys01",
        type: "ScaleValue",
        configuration: {
          identifier: "grid-decoys",
          type: "number",
          scale: {
            2:  { value: 1 },
            5:  { value: 2 },
            11: { value: 3 },
            17: { value: 4 },
          },
        },
        value: {},
        level: 2,
        title: "Grid Decoys",
      },

      /* ── ScaleValue: Deals Known ── */
      {
        _id: "advFixScDeals001",
        type: "ScaleValue",
        configuration: {
          identifier: "deals-known",
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
        title: "Deals Known",
      },

      /* ── ScaleValue: Dummy Orders ── */
      {
        _id: "advFixScDummyOrd",
        type: "ScaleValue",
        configuration: {
          identifier: "dummy-orders",
          type: "number",
          formula: "@prof",
          scale: {
            4:  { value: 2, formula: "@prof" },
            5:  { value: 3, formula: "@prof" },
            9:  { value: 4, formula: "@prof" },
            13: { value: 5, formula: "@prof" },
            17: { value: 6, formula: "@prof" },
          },
        },
        value: {},
        level: 4,
        title: "Dummy Orders",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advFixScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1:  { value: 2 },
            2:  { value: 4 },
            3:  { value: 6 },
            4:  { value: 8 },
            5:  { value: 10 },
            6:  { value: 12 },
            7:  { value: 14 },
            8:  { value: 16 },
            9:  { value: 18 },
            10: { value: 20 },
            11: { value: 22 },
            12: { value: 24 },
            13: { value: 26 },
            14: { value: 28 },
            15: { value: 30 },
            16: { value: 32 },
            17: { value: 34 },
            18: { value: 36 },
            19: { value: 38 },
            20: { value: 40 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },

      /* ── ItemGrant: Level 1 (Expertise, Sneak Attack, Nanoprogramming, Weapon Mastery) ── */
      {
        _id: "advFixItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixExpertise0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixSneakAttack01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixNanoProg00001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixWpnMastery001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Fixer Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Grid Armor, Cunning Gambits, Black Market Deals) ── */
      {
        _id: "advFixItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGridArmor0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixCunningGamb01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixBlkMktDeals01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Fixer Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Fixer Syndicate") ── */
      {
        _id: "advFixSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Fixer Syndicate",
      },

      /* ── ItemGrant: Level 3 (Bad Feeling) ── */
      {
        _id: "advFixItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixBadFeeling001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Fixer Features (Level 3)",
      },

      /* ── ItemGrant: Level 4 (Hack Dummy Order) ── */
      {
        _id: "advFixItmGrLvl04",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixHackDummyOrd1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 4,
        title: "Fixer Features (Level 4)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advFixASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Extra Attack, Run and Gun, Grid Armor Mk II) ── */
      {
        _id: "advFixItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixExtraAttack01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixRunAndGun0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGridArmorMk21",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Fixer Features (Level 5)",
      },

      /* ── ItemGrant: Level 6 (Fixer Grid: The Node) ── */
      {
        _id: "advFixItmGrLvl06",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixFixerGrid0001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Fixer Features (Level 6)",
      },

      /* ── ItemGrant: Level 7 (Evasion, Slicer's Hotkeys) ── */
      {
        _id: "advFixItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixEvasion000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixSlicersHotk01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Fixer Features (Level 7)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advFixASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 11 (Grid Armor Mk III) ── */
      {
        _id: "advFixItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGridArmorMk31",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Fixer Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advFixASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 13 (Encrypted Neural Net) ── */
      {
        _id: "advFixItmGrLvl13",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixEncryptNet001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 13,
        title: "Fixer Features (Level 13)",
      },

      /* ── ItemGrant: Level 14 (Grid Beacon) ── */
      {
        _id: "advFixItmGrLvl14",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGridBeacon001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Fixer Features (Level 14)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advFixASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advFixASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Grid Armor Mk IV, Ghost in the Grid) ── */
      {
        _id: "advFixItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGridArmorMk41",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FixGhostInGrid01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Fixer Features (Level 20)",
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
  _key: "!items!FixerClass000001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Fixer build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
