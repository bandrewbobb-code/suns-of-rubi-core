#!/usr/bin/env node
/**
 * build-nanotechnician.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Nano-Technician class package:
 *   • src/features/nanotechnician/            – 8 core class features
 *   • src/features/nanotechnician/tuning/     – 3 Matter Creation Tunings
 *   • src/features/nanotechnician/overclock/  – 12 Compiler Overclocks
 *   • src/classes/nano-technician.json        – Nano-Technician class document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - Unique 16-character alphanumeric _id at root and in _key
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

/** Standard feat scaffold for Nano-Technician features, tunings, and overclocks */
function createFeat({
  id,
  name,
  img = "icons/magic/symbols/circuit-board-glowing-blue.webp",
  description,
  subtype = "",
  requirements = "Nano-Technician 1",
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
/*  1.  CORE CLASS FEATURES  →  src/features/nanotechnician/          */
/* ================================================================== */

console.log("\n▸ Nano-Technician Core Class Features");

// 1. Nanoprogramming (Level 1)
write("src/features/nanotechnician/nanoprogramming.json", createFeat({
  id: "NtNanoProg000001",
  name: "Nanoprogramming",
  img: "icons/magic/symbols/runes-star-pentagon-cyan.webp",
  requirements: "Nano-Technician 1",
  description:
    "<p>At 1st level, your cutting-edge compiler and cyberdeck architecture grant you full nanocasting progression in offensive, defensive, and utility nanoprograms, scaling from Tier 1 up to Tier 9 apex routines.</p>" +
    "<h3>Intelligence Nanocasting</h3>" +
    "<p><strong>Intelligence</strong> is your nanocasting ability for Nano-Technician nanoprograms, reflecting your processing power and algorithm architecture.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Intelligence modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Intelligence modifier</li>" +
    "</ul>" +
    "<h3>Programs Known</h3>" +
    "<p>You know <strong>9 nanoprograms</strong> of your choice from the Nano-Technician Operating System at 1st level, and learn additional programs as shown on the class table.</p>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your maximum Nanopool points equal <strong>(Nano-Technician level &times; 4) + your Intelligence modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
    "<h3>Max Power Level & Apex Programs</h3>" +
    "<p>Executing nanoprograms of <strong>6th, 7th, 8th, or 9th tier</strong> requires immense processor synchronization. You can execute each program of 6th tier or higher once per <strong>Long Rest</strong>.</p>" +
    "<h3>Cyberdeck Requirement</h3>" +
    "<p>Executing nanoprograms requires you to have at least <strong>one hand free</strong> to operate an equipped cyberdeck or neural input sleeve.</p>",
}));

// 2. Humidity Extractor (Level 1)
write("src/features/nanotechnician/humidity-extractor.json", createFeat({
  id: "NtHumidExtract01",
  name: "Humidity Extractor",
  img: "icons/magic/water/water-drop-swirl-blue.webp",
  requirements: "Nano-Technician 1",
  description:
    "<p>At 1st level, you install thermal-cycling condensation coils that reclaim energy from ambient atmospheric moisture.</p>" +
    "<p>Whenever you finish a <strong>Short Rest</strong>, you regain an amount of expended Nanopool points equal to <strong>half your Nano-Technician level (rounded down) + your Intelligence modifier</strong> (minimum of 1 point).</p>" +
    "<p>Once you use this feature, you cannot do so again until you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactHumidExt: {
      _id: "dnd5eactHumidExt",
      type: "utility",
      name: "Extract Atmospheric Nanopool",
      img: "",
      activation: { type: "special", value: null, condition: "During a Short Rest (1/Long Rest)" },
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

// 3. Compiler Overclock (Level 2)
write("src/features/nanotechnician/compiler-overclock.json", createFeat({
  id: "NtCompOverclock1",
  name: "Compiler Overclock",
  img: "icons/magic/lightning/bolt-strike-blue.webp",
  requirements: "Nano-Technician 2",
  description:
    "<p>At 2nd level, your compiler kernel allows you to modify nanoprogram execution parameters in real-time by overclocking your code.</p>" +
    "<p>You learn <strong>two Compiler Overclock options</strong> of your choice from the Compiler Overclock compendium. You learn a third option at 9th level and a fourth at 17th level (`@scale.nano-technician.overclock-options`).</p>" +
    "<p>When you execute a nanoprogram, you can apply one Compiler Overclock option to it by expending additional <strong>Nanopool points</strong> as specified by that option. You can use only one Compiler Overclock option on a program when you cast it, unless that option explicitly states otherwise.</p>",
}));

// 4. Scholar (Level 2)
write("src/features/nanotechnician/scholar.json", createFeat({
  id: "NtScholar0000001",
  name: "Scholar",
  img: "icons/tools/scribing/scroll-quill-blue.webp",
  requirements: "Nano-Technician 2",
  description:
    "<p>At 2nd level, your rigorous scientific training grants you deep analytical capability.</p>" +
    "<p>Choose one skill in which you are proficient from the following: <strong>Lore, Medicine, Nature, Investigation, or Technology</strong>. Your proficiency bonus is <strong>doubled</strong> for any ability check you make using the chosen skill.</p>",
}));

// 5. Nullity Sphere (Level 2)
write("src/features/nanotechnician/nullity-sphere.json", createFeat({
  id: "NtNullitySphere1",
  name: "Nullity Sphere",
  img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
  requirements: "Nano-Technician 2",
  description:
    "<p>At 2nd level, you develop an emergency electromagnetic null-zone that deflects incoming kinetics and energy beams.</p>" +
    "<p>As a <strong>Reaction when you are hit by an attack roll</strong>, you can deploy the Nullity Sphere. Until the end of your next turn:</p>" +
    "<ul>" +
    "<li>Your speed is reduced to <strong>0</strong>.</li>" +
    "<li>You gain a bonus to your Armor Class equal to your <strong>Intelligence modifier (minimum +1)</strong>, which applies against the triggering attack.</li>" +
    "</ul>" +
    "<p>You can use this feature a number of times shown in the Nullity Sphere column of the Nano-Technician table (`@scale.nano-technician.nullity-sphere-uses`). You regain all expended uses when you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: "@scale.nano-technician.nullity-sphere-uses",
    max: "@scale.nano-technician.nullity-sphere-uses",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactNullity: {
      _id: "dnd5eactNullity",
      type: "utility",
      name: "Deploy Nullity Sphere",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When hit by an attack roll" },
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

// 6. Matter Creation Tuning (Level 3)
write("src/features/nanotechnician/matter-creation-tuning.json", createFeat({
  id: "NtMCTuning000001",
  name: "Matter Creation Tuning",
  img: "icons/commodities/materials/shard-crystal-glowing-blue.webp",
  requirements: "Nano-Technician 3",
  description:
    "<p>At 3rd level, you fine-tune your deck's core matter-creation (MC) nanite emitters to specialize your combat output. Choose one of the following tunings from the Matter Creation Tuning compendium:</p>" +
    "<ul>" +
    "<li><strong>Agonizing Blast</strong>: Add your Intelligence modifier to damage rolls of At-Will (Tier 0) nanoprograms.</li>" +
    "<li><strong>Expanded NCU Bandwidth</strong>: Add both Wisdom and Charisma modifiers to your maximum Nanopool points.</li>" +
    "<li><strong>Nano Recompiler</strong>: Gain Advantage on Constitution saving throws made to maintain Concentration on nanoprograms.</li>" +
    "</ul>",
}));

// 7. Superior Humidity Extractor (Level 5)
write("src/features/nanotechnician/superior-humidity-extractor.json", createFeat({
  id: "NtSupHumidExtr01",
  name: "Superior Humidity Extractor",
  img: "icons/magic/water/vortex-water-whirlpool-blue.webp",
  requirements: "Nano-Technician 5",
  description:
    "<p>At 5th level, your atmospheric extractor expands its condensation field to recharge your allies' biosystems.</p>" +
    "<p>Whenever you finish a Short Rest, you can choose up to <strong>3 friendly creatures within 30 feet</strong>. Each chosen creature regains an amount of expended Nanopool points equal to <strong>half your Nano-Technician level (rounded down) + your Intelligence modifier</strong> (minimum 1 point).</p>" +
    "<p>Once you use this feature, you cannot do so again until you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactSupExtract: {
      _id: "dnd5eactSupExtract",
      type: "utility",
      name: "Team Humidity Reconstitution",
      img: "",
      activation: { type: "special", value: null, condition: "During a Short Rest (1/Long Rest)" },
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
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "3", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 8. Techno-Wizard (Level 20)
write("src/features/nanotechnician/techno-wizard.json", createFeat({
  id: "NtTechnoWizard01",
  name: "Techno-Wizard",
  img: "icons/magic/symbols/rune-sigil-horned-blue.webp",
  requirements: "Nano-Technician 20",
  description:
    "<p>At 20th level, you have attained absolute mastery over the digital and physical fabric of nanite manipulation.</p>" +
    "<h3>Intelligence Increase</h3>" +
    "<p>Your <strong>Intelligence score increases by 4</strong>, and your maximum Intelligence score is now <strong>24</strong>.</p>" +
    "<h3>Signature Routine</h3>" +
    "<p>Choose one <strong>3rd-level nanoprogram</strong> that you know. You can execute that program at 3rd level <strong>without expending Nanopool points</strong> once per <strong>Short or Long Rest</strong>. If you apply Compiler Overclocks to this program, you must expend Nanopool points for the overclock as normal.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "sr",
    recovery: "",
    prompt: false,
  },
  advancement: [
    {
      _id: "advNtTechnoASI01",
      type: "AbilityScoreImprovement",
      configuration: {
        points: 0,
        fixed: { str: 0, dex: 0, con: 0, int: 4, wis: 0, cha: 0 },
        cap: 24,
      },
      value: { type: "asi", int: 4 },
      level: 20,
      title: "Intelligence Increase (+4, cap 24)",
    },
  ],
  activities: {
    dnd5eactSignRoutine: {
      _id: "dnd5eactSignRoutine",
      type: "utility",
      name: "Cast Signature Routine Free",
      img: "",
      activation: { type: "special", value: null, condition: "1/Short or Long Rest for chosen 3rd-level program" },
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
/*  2.  MATTER CREATION TUNINGS  →  src/features/nanotechnician/tuning/ */
/* ================================================================== */

console.log("\n▸ Matter Creation Tunings");
const TUNE_DIR = "src/features/nanotechnician/tuning";

function createTuning({ id, name, description, activities = {} }) {
  return createFeat({
    id,
    name,
    img: "icons/commodities/materials/shard-crystal-glowing-blue.webp",
    description,
    subtype: "tuning",
    requirements: "Nano-Technician 3",
    activities,
  });
}

// 1. Agonizing Blast
write(`${TUNE_DIR}/tuning-agonizing-blast.json`, createTuning({
  id: "TuneAgonizingBl1",
  name: "Tuning: Agonizing Blast",
  description:
    "<p>When you cast an <strong>At-Will (Tier 0) nanoprogram</strong>, add your <strong>Intelligence modifier</strong> to the damage it deals on a hit.</p>",
}));

// 2. Expanded NCU Bandwidth
write(`${TUNE_DIR}/tuning-expanded-bandwidth.json`, createTuning({
  id: "TuneExpandedNCU1",
  name: "Tuning: Expanded NCU Bandwidth",
  description:
    "<p>Your compiler architecture draws upon intuitive and sensory subroutines. You add both your <strong>Wisdom and Charisma modifiers</strong> to your maximum Nanopool points in addition to your Intelligence modifier.</p>",
}));

// 3. Nano Recompiler
write(`${TUNE_DIR}/tuning-nano-recompiler.json`, createTuning({
  id: "TuneNanoRecomp01",
  name: "Tuning: Nano Recompiler",
  description:
    "<p>Hardware-level thread monitoring ensures your code remains unbroken under fire. You have <strong>Advantage on Constitution saving throws</strong> that you make to maintain Concentration on a nanoprogram.</p>",
}));

/* ================================================================== */
/*  3.  COMPILER OVERCLOCKS  →  src/features/nanotechnician/overclock/ */
/* ================================================================== */

console.log("\n▸ Compiler Overclock Options");
const OVR_DIR = "src/features/nanotechnician/overclock";

function createOverclock({ id, name, description, activities = {} }) {
  return createFeat({
    id,
    name,
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    description,
    subtype: "overclock",
    requirements: "Nano-Technician 2",
    activities,
  });
}

// 1. Amplified Yield
write(`${OVR_DIR}/overclock-amplified-yield.json`, createOverclock({
  id: "OvrAmpYield00001",
  name: "Overclock: Amplified Yield",
  description:
    "<p>When you roll damage for a nanoprogram, you can spend <strong>1 additional Nanopool point</strong> to reroll a number of the damage dice up to your <strong>Intelligence modifier</strong> (minimum of one). You must use the new rolls.</p>" +
    "<p>You can use Amplified Yield even if you have already used a different Compiler Overclock option during the casting of the program.</p>",
}));

// 2. Careful Program
write(`${OVR_DIR}/overclock-careful-program.json`, createOverclock({
  id: "OvrCarefulProg01",
  name: "Overclock: Careful Program",
  description:
    "<p>When you execute a nanoprogram that forces other creatures to make a saving throw, you can spend <strong>1 additional Nanopool point</strong> to protect some of those creatures from the program's full force.</p>" +
    "<p>Choose a number of creatures up to your <strong>Intelligence modifier</strong> (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the program.</p>",
}));

// 3. Distant Program
write(`${OVR_DIR}/overclock-distant-program.json`, createOverclock({
  id: "OvrDistantProg01",
  name: "Overclock: Distant Program",
  description:
    "<p>When you execute a nanoprogram that has a range of 5 feet or greater, you can spend <strong>1 additional Nanopool point</strong> to <strong>double the range</strong> of the program.</p>" +
    "<p>When you cast a program that has a range of Touch, you can spend 1 additional Nanopool point to make the range of the program <strong>30 feet</strong>.</p>",
}));

// 4. Extended Program
write(`${OVR_DIR}/overclock-extended-program.json`, createOverclock({
  id: "OvrExtendProg001",
  name: "Overclock: Extended Program",
  description:
    "<p>When you execute a nanoprogram that has a duration of 1 minute or longer, you can spend <strong>1 additional Nanopool point</strong> to <strong>double its duration</strong>, to a maximum duration of 24 hours.</p>",
}));

// 5. Heightened Program
write(`${OVR_DIR}/overclock-heightened-program.json`, createOverclock({
  id: "OvrHeightenProg1",
  name: "Overclock: Heightened Program",
  description:
    "<p>When you execute a nanoprogram that forces a creature to make a saving throw to resist its effects, you can spend <strong>3 additional Nanopool points</strong> to give one target of the program <strong>Disadvantage on its first saving throw</strong> made against the program.</p>",
}));

// 6. Lingering Program
write(`${OVR_DIR}/overclock-lingering-program.json`, createOverclock({
  id: "OvrLingerProg001",
  name: "Overclock: Lingering Program",
  description:
    "<p>When you execute a nanoprogram that requires Concentration, you can spend <strong>3 additional Nanopool points</strong>. If you lose Concentration on the program, the program does not end immediately; its effects persist until the <strong>end of your next turn</strong>.</p>",
}));

// 7. Pinpoint Program
write(`${OVR_DIR}/overclock-pinpoint-program.json`, createOverclock({
  id: "OvrPinpointProg1",
  name: "Overclock: Pinpoint Program",
  description:
    "<p>When you execute a nanoprogram that targets an area and forces a saving throw, you can spend <strong>1 additional Nanopool point</strong> to collapse the area into a focused projectile. Make a ranged program attack roll against one creature within the program's normal range.</p>" +
    "<p>On a hit, the target suffers the effects as if it had failed its saving throw against the program.</p>",
}));

// 8. Quickened Compilation
write(`${OVR_DIR}/overclock-quickened-compilation.json`, createOverclock({
  id: "OvrQuickenComp01",
  name: "Overclock: Quickened Compilation",
  description:
    "<p>When you execute a nanoprogram that has an execution time of 1 Action, you can spend <strong>2 additional Nanopool points</strong> to change the casting time to <strong>1 Bonus Action</strong> for this execution.</p>",
}));

// 9. Refocused Program
write(`${OVR_DIR}/overclock-refocused-program.json`, createOverclock({
  id: "OvrRefocusProg01",
  name: "Overclock: Refocused Program",
  description:
    "<p>As a <strong>Reaction when you take damage and are forced to make a Constitution saving throw to maintain Concentration</strong>, you can spend <strong>2 Nanopool points</strong> to automatically succeed on the saving throw.</p>" +
    "<p>You can use Refocused Program even if you have already applied another Compiler Overclock option to the active program.</p>",
  activities: {
    dnd5eactRefocus: {
      _id: "dnd5eactRefocus",
      type: "utility",
      name: "Automatic Concentration Success",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When forced to make Concentration save; spend 2 NP" },
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

// 10. Resonance Piercing
write(`${OVR_DIR}/overclock-resonance-piercing.json`, createOverclock({
  id: "OvrResonPierce01",
  name: "Overclock: Resonance Piercing",
  description:
    "<p>When you execute a nanoprogram that deals damage, you can spend <strong>2 additional Nanopool points</strong>. For this casting, the nanoprogram completely <strong>ignores any damage resistances</strong> possessed by the targets.</p>",
}));

// 11. Seeking Program
write(`${OVR_DIR}/overclock-seeking-program.json`, createOverclock({
  id: "OvrSeekProgram01",
  name: "Overclock: Seeking Program",
  description:
    "<p>When you make a program attack roll and miss, you can spend <strong>2 Nanopool points</strong> to reroll the d20. You must use the new roll.</p>" +
    "<p>You can use Seeking Program even if you have already used a different Compiler Overclock option during the casting of the program.</p>",
}));

// 12. Twinned Program
write(`${OVR_DIR}/overclock-twinned-program.json`, createOverclock({
  id: "OvrTwinProgram01",
  name: "Overclock: Twinned Program",
  description:
    "<p>When you execute a nanoprogram that targets only one creature and doesn't have a range of Self, you can spend a number of additional Nanopool points equal to the <strong>program's tier (1 Nanopool point if the program is an At-Will Tier 0 program)</strong> to target a second creature in range with the same execution.</p>",
}));

/* ================================================================== */
/*  4.  NANO-TECHNICIAN CLASS DOCUMENT  →  src/classes/nano-technician.json */
/* ================================================================== */

console.log("\n▸ Nano-Technician Class Document");

write("src/classes/nano-technician.json", {
  _id: "NanoTechClass001",
  name: "Nano-Technician",
  type: "class",
  img: "icons/magic/symbols/circuit-board-glowing-blue.webp",
  system: {
    description: {
      value:
        "<p>The premier master of matter compilation and runtime code modification. The Nano-Technician commands the fundamental building blocks of the physical world through cutting-edge cyberdecks, overclocking nanoprograms on the fly and weaving impenetrable electromagnetic nullity spheres.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "nano-technician",
    levels: 1,
    hd: { denomination: 6, spent: 0, additional: "" },
    primaryAbility: { value: ["int"], all: false },
    spellcasting: { progression: "full", ability: "int" },
    advancement: [
      /* ── Hit Points (d6) ── */
      {
        _id: "advNtHitPoints01",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: INT, CON ── */
      {
        _id: "advNtSavesPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:int", "saves:con"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: none ── */
      {
        _id: "advNtArmorPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },
      /* ── Weapon Proficiencies: pistol, simple-sourceweapon, simple-vibro ── */
      {
        _id: "advNtWeaponPr001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:pistol", "weapons:simple-sourceweapon", "weapons:simple-vibro"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Tool Proficiencies: choice of 1 ── */
      {
        _id: "advNtToolPrf0001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: [
                "tools:slicers-tools",
                "tools:cybertech-tools",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Tool Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 2 ── */
      {
        _id: "advNtSkillPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 2,
              pool: [
                "skills:tec",
                "skills:pil",
                "skills:lor",
                "skills:inv",
                "skills:prc",
                "skills:ins",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advNtScNanopl001",
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

      /* ── ScaleValue: Overclock Options ── */
      {
        _id: "advNtScOvercl001",
        type: "ScaleValue",
        configuration: {
          identifier: "overclock-options",
          type: "number",
          scale: {
            2:  { value: 2 },
            3:  { value: 2 },
            4:  { value: 2 },
            5:  { value: 2 },
            6:  { value: 2 },
            7:  { value: 2 },
            8:  { value: 2 },
            9:  { value: 3 },
            10: { value: 3 },
            11: { value: 3 },
            12: { value: 3 },
            13: { value: 3 },
            14: { value: 3 },
            15: { value: 3 },
            16: { value: 3 },
            17: { value: 4 },
            18: { value: 4 },
            19: { value: 4 },
            20: { value: 4 },
          },
        },
        value: {},
        level: 2,
        title: "Overclock Options",
      },

      /* ── ScaleValue: Nullity Sphere Uses ── */
      {
        _id: "advNtScNullity01",
        type: "ScaleValue",
        configuration: {
          identifier: "nullity-sphere-uses",
          type: "number",
          scale: {
            2:  { value: 2 },
            5:  { value: 3 },
            9:  { value: 4 },
            13: { value: 5 },
            17: { value: 6 },
          },
        },
        value: {},
        level: 2,
        title: "Nullity Sphere Uses",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Humidity Extractor) ── */
      {
        _id: "advNtItmGrLvl001",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtNanoProg000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtHumidExtract01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Nano-Technician Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Compiler Overclock, Scholar, Nullity Sphere) ── */
      {
        _id: "advNtItmGrLvl002",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtCompOverclock1",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtScholar0000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtNullitySphere1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Nano-Technician Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Nanotechnic Specialization") ── */
      {
        _id: "advNtSubclass001",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Nanotechnic Specialization",
      },

      /* ── ItemGrant: Level 3 (Matter Creation Tuning) ── */
      {
        _id: "advNtItmGrLvl003",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtMCTuning000001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Nano-Technician Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advNtASILvl04001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Superior Humidity Extractor) ── */
      {
        _id: "advNtItmGrLvl005",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtSupHumidExtr01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Nano-Technician Features (Level 5)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advNtASILvl08001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advNtASILvl12001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advNtASILvl16001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advNtASILvl19001",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Techno-Wizard) ── */
      {
        _id: "advNtItmGrLvl020",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.NtTechnoWizard01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Nano-Technician Features (Level 20)",
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
  _key: "!items!NanoTechClass001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Nano-Technician build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
