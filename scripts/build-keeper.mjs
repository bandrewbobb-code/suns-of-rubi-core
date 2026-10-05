#!/usr/bin/env node
/**
 * build-keeper.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Keeper class package:
 *   • src/features/keeper/         – 12 core class features
 *   • src/features/keeper/paths/   – 3 Faction Paths
 *   • src/features/keeper/auras/   – 7 Keeper Auras
 *   • src/classes/keeper.json      – Keeper class document
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

/** Standard feat scaffold for Keeper features, paths, and auras */
function createFeat({
  id,
  name,
  img = "icons/weapons/swords/sword-holy-glowing-yellow.webp",
  description,
  subtype = "",
  requirements = "Keeper 1",
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
/*  1.  CORE CLASS FEATURES  →  src/features/keeper/                  */
/* ================================================================== */

console.log("\n▸ Keeper Core Class Features");

// 1. Nanocasting (Level 1)
write("src/features/keeper/nanocasting.json", createFeat({
  id: "KepNanocasting01",
  name: "Nanocasting",
  img: "icons/magic/symbols/runes-star-pentagon-orange.webp",
  requirements: "Keeper 1",
  description:
    "<p>At 1st level, your internal bio-conduits and ideological attunement grant you half-caster progression in combat nanoprograms, scaling from Tier 1 up to Tier 5 programs.</p>" +
    "<h3>Charisma Nanocasting</h3>" +
    "<p><strong>Charisma</strong> is your nanocasting ability for Keeper nanoprograms, channeling your personal conviction and resonant force.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Charisma modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Charisma modifier</li>" +
    "</ul>" +
    "<h3>Programs Known</h3>" +
    "<p>You know <strong>5 nanoprograms</strong> of your choice from the Keeper Operating System at 1st level, and learn additional programs as shown on the Keeper table.</p>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your maximum Nanopool points equal <strong>(Keeper level &times; 2) + your Charisma modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
    "<h3>High-Tier Apex Restriction</h3>" +
    "<p>Executing a nanoprogram of <strong>4th-tier or 5th-tier</strong> places intense strain on your neural network. You can execute a 4th-tier program once per Long Rest, and a 5th-tier program once per Long Rest.</p>" +
    "<h3>Somatic Free Hand</h3>" +
    "<p>Executing nanoprograms requires you to have at least <strong>one hand free</strong> to project bio-frequencies or interface with your focus.</p>",
}));

// 2. Weapon Mastery (Level 1)
write("src/features/keeper/weapon-mastery.json", createFeat({
  id: "KepWpnMastery001",
  name: "Weapon Mastery",
  img: "icons/weapons/swords/sword-broad-crystal-blue.webp",
  requirements: "Keeper 1",
  description:
    "<p>Your martial training with sourceblades and heavy weapons grants you access to the mastery properties of <strong>two weapons</strong> of your choice with which you are proficient.</p>" +
    "<p>Whenever you finish a <strong>Long Rest</strong>, you can practice combat katas and swap your chosen weapon masteries.</p>",
}));

// 3. Fighting Style (Level 2)
write("src/features/keeper/fighting-style.json", createFeat({
  id: "KepFightStyle001",
  name: "Fighting Style",
  img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
  requirements: "Keeper 2",
  description:
    "<p>At 2nd level, you adopt a particular style of fighting as your specialty. Choose one Fighting Style feat from Chapter 6 (such as Defense, Dueling, Great Weapon Fighting, Two-Weapon Fighting, Blind Fighting, or Interception).</p>",
}));

// 4. Path of the Source (Level 2)
write("src/features/keeper/path-of-the-source.json", createFeat({
  id: "KepPathSource001",
  name: "Path of the Source",
  img: "icons/magic/light/beam-rays-yellow-blue.webp",
  requirements: "Keeper 2",
  description:
    "<p>At 2nd level, you irrevocably swear yourself to a faction doctrine and neural frequency known as your <strong>Path of the Source</strong>. Choose one of the following paths: <strong>The Faithful</strong>, <strong>The Chosen</strong>, or <strong>The Watcher</strong>.</p>" +
    "<h3>Channel the Source</h3>" +
    "<p>Your path grants you the ability to channel raw cosmic bio-frequencies to fuel supernatural effects. You can use your Channel the Source a number of times equal to your <strong>Proficiency Bonus</strong> (`@scale.keeper.channel-uses`).</p>" +
    "<p>You regain <strong>one expended use</strong> when you finish a <strong>Short Rest</strong>, and you regain <strong>all expended uses</strong> when you finish a <strong>Long Rest</strong>.</p>",
  uses: {
    value: "@prof",
    max: "@prof",
    per: "lr",
    recovery: "",
    prompt: false,
  },
}));

// 5. Source-Empowered Strikes (Level 2)
write("src/features/keeper/source-empowered-strikes.json", createFeat({
  id: "KepEmpoweredSt01",
  name: "Source-Empowered Strikes",
  img: "icons/skills/melee/strike-blade-slashing-orange.webp",
  requirements: "Keeper 2",
  description:
    "<p>Starting at 2nd level, when you hit a creature with a melee weapon attack, you can channel internal Nanopool energy directly into the blow.</p>" +
    "<p>Once per turn, you can expend <strong>Nanopool points</strong> to deal an extra <strong>1d8 damage per point spent</strong>. The maximum points you can expend on a single strike scales with your Keeper level, as shown in the Resonance Strikes column of the Keeper table (capped at <strong>2d8 at 2nd level, 3d8 at 5th, 4d8 at 9th, 5d8 at 13th, and 6d8 at 17th level</strong>, `@scale.keeper.resonance-strikes`).</p>" +
    "<p>The extra damage is either of your weapon's normal damage type or matches your <strong>Source Affinity</strong> damage type (Force, Necrotic, Psychic, or Ion).</p>",
  activities: {
    dnd5eactEmpower: {
      _id: "dnd5eactEmpower",
      type: "damage",
      name: "Source-Empowered Smite",
      img: "",
      activation: { type: "special", value: null, condition: "Once per turn on melee weapon hit; expend Nanopool points" },
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
            bonus: "@scale.keeper.resonance-strikes",
            types: ["force"],
            custom: { enabled: true, formula: "@scale.keeper.resonance-strikes" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 6. Keeper Aura (Level 3)
write("src/features/keeper/keeper-aura.json", createFeat({
  id: "KepKeeperAura001",
  name: "Keeper Aura",
  img: "icons/magic/defensive/shield-barrier-glowing-triangle-yellow.webp",
  requirements: "Keeper 3",
  description:
    "<p>Starting at 3rd level, your bio-frequency harmonics project an invisible field of authority and protection surrounding you in a <strong>15-foot radius</strong>. This aura expands to a <strong>30-foot radius at 17th level</strong> (`@scale.keeper.aura-radius`).</p>" +
    "<p>You learn <strong>1 Keeper Aura</strong> of your choice at 3rd level, a second aura at 10th level, and a third aura at 18th level (`@scale.keeper.auras-known`). All selected auras are active simultaneously whenever you are conscious.</p>",
}));

// 7. Extra Attack (Level 5)
write("src/features/keeper/extra-attack.json", createFeat({
  id: "KepExtraAttack01",
  name: "Extra Attack",
  img: "icons/skills/melee/strike-weapons-crossed-yellow.webp",
  requirements: "Keeper 5",
  description:
    "<p>Beginning at 5th level, you can attack <strong>twice, instead of once</strong>, whenever you take the <strong>Attack</strong> action on your turn.</p>",
}));

// 8. System Purity (Level 6)
write("src/features/keeper/system-purity.json", createFeat({
  id: "KepSystemPurity1",
  name: "System Purity",
  img: "icons/magic/defensive/shield-barrier-glowing-gold.webp",
  requirements: "Keeper 6",
  description:
    "<p>By 6th level, the biocircuitry coursing through your veins purges invasive organisms and synthetic corruptions.</p>" +
    "<p>You are completely <strong>immune to poison damage, the Poisoned condition, and all forms of biological and synthetic disease</strong>.</p>",
}));

// 9. Envoy (Level 10)
write("src/features/keeper/envoy.json", createFeat({
  id: "KepEnvoy00000001",
  name: "Envoy",
  img: "icons/skills/social/diplomacy-handshake-yellow.webp",
  requirements: "Keeper 10",
  description:
    "<p>At 10th level, you represent the highest authority of your ideological faction, unlocking social privileges across the galaxy based on your <strong>Path of the Source</strong>:</p>" +
    "<ul>" +
    "<li><strong>Faithful (Sanctuary)</strong>: By conducting a 10-minute consecration ritual, you establish a 60-foot secure perimeter. The Perception DC to detect approaching hostiles is reduced by 5, occupants are immune to extreme cold, heat, and radiation, and you can demand free rest and basic medical supplies from civil order groups and monasteries.</li>" +
    "<li><strong>Chosen (Black Market Fealty)</strong>: You have <strong>Advantage on Charisma checks</strong> made to demand safe transit, negotiate terms, or gain admittance to black-market auctions and private syndicate conclaves among cartels, smugglers, and corrupt planetary authorities.</li>" +
    "<li><strong>Watcher (Archival Infiltration)</strong>: By interfacing with any network console for 10 minutes, you access surveillance feeds and public survey archives dating back up to 100 years. Automated defense turrets and patrol AIs automatically evaluate you as an authorized observer.</li>" +
    "</ul>",
}));

// 10. Improved Source-Empowered Strikes (Level 11)
write("src/features/keeper/improved-source-empowered-strikes.json", createFeat({
  id: "KepImpEmpowrSt01",
  name: "Improved Source-Empowered Strikes",
  img: "icons/weapons/swords/sword-flanged-gold.webp",
  requirements: "Keeper 11",
  description:
    "<p>At 11th level, radiant energy hums permanently through your weapons. Whenever you hit a creature with a melee weapon, the attack deals an extra <strong>1d8 damage</strong> of the weapon's damage type or your Source Affinity damage type.</p>",
  activities: {
    dnd5eactImpEmpow: {
      _id: "dnd5eactImpEmpow",
      type: "damage",
      name: "Continuous Strike Empowerment",
      img: "",
      activation: { type: "special", value: null, condition: "On every melee weapon hit" },
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
            denomination: 8,
            bonus: "",
            types: ["force"],
            custom: { enabled: false, formula: "" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 11. Source-Sustained Vessel (Level 13)
write("src/features/keeper/source-sustained-vessel.json", createFeat({
  id: "KepSustainedV001",
  name: "Source-Sustained Vessel",
  img: "icons/magic/life/heart-glow-yellow.webp",
  requirements: "Keeper 13",
  description:
    "<p>By 13th level, your physical form is nourished directly by the internal biocircuits of the Source:</p>" +
    "<ul>" +
    "<li>You no longer require <strong>food or water</strong> to survive.</li>" +
    "<li>You can survive without air in hard vacuum, underwater, or within toxic atmospheres for a number of hours equal to your <strong>Charisma modifier</strong> (minimum 1 hour).</li>" +
    "<li>You are <strong>immune to biological and supernatural aging</strong>, and cannot be aged magically.</li>" +
    "<li>You require only <strong>4 hours of restful meditation</strong> to gain the full benefits of a Long Rest.</li>" +
    "</ul>",
}));

// 12. Cleansing Touch (Level 14)
write("src/features/keeper/cleansing-touch.json", createFeat({
  id: "KepCleanseTouch1",
  name: "Cleansing Touch",
  img: "icons/magic/life/cross-beam-green.webp",
  requirements: "Keeper 14",
  description:
    "<p>Starting at 14th level, you can purge hostile biocircuits and physical ailments. As an <strong>Action</strong>, you expend <strong>1 use of Channel the Source</strong> to touch yourself or one willing creature.</p>" +
    "<p>You immediately end one active nanoprogram, spell effect, or debilitating condition (such as Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned) affecting the target.</p>",
  activities: {
    dnd5eactCleanse: {
      _id: "dnd5eactCleanse",
      type: "utility",
      name: "Execute Cleansing Touch",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 1 use of Channel the Source" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { units: "touch", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "willing", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

/* ================================================================== */
/*  2.  FACTION PATHS  →  src/features/keeper/paths/                  */
/* ================================================================== */

console.log("\n▸ Keeper Faction Paths");
const PATH_DIR = "src/features/keeper/paths";

function createPath({ id, name, description, activities = {} }) {
  return createFeat({
    id,
    name,
    img: "icons/magic/light/beam-rays-yellow-blue.webp",
    description,
    subtype: "path",
    requirements: "Keeper 2",
    activities,
  });
}

// 1. Path of the Faithful
write(`${PATH_DIR}/path-of-the-faithful.json`, createPath({
  id: "PathFaithful0001",
  name: "Path of the Faithful",
  description:
    "<p>You swear fealty to the benevolent, order-affirming harmonics of the Source, fighting as an armored protector of civil society.</p>" +
    "<h3>Source Affinity</h3>" +
    "<p>Your Source Affinity damage type is <strong>Force</strong>.</p>" +
    "<h3>Diagnostic Empathy</h3>" +
    "<p>You gain proficiency in <strong>Insight or Medicine</strong> (your choice). By touching a creature for 1 minute, you discern its emotional state, if it is charmed or coerced, and whether it suffers from diseases or toxins. By touching a synthetic machine, you identify its programmed function and active malfunctions.</p>" +
    "<h3>Channel the Source: Righteous Wrath</h3>" +
    "<ul>" +
    "<li><strong>Smite (Bonus Action)</strong>: When you hit a creature with a melee weapon attack, expend 1 Channel use. The target takes extra Force damage equal to your <strong>Keeper level + your Charisma modifier</strong> (minimum +1), and <strong>loses its Reaction</strong> until the start of its next turn.</li>" +
    "<li><strong>Sustain (Bonus Action)</strong>: Touch an ally within reach and expend 1 Channel use. The ally regains hit points equal to your <strong>Keeper level + your Charisma modifier</strong> (minimum +1) and neutralizes one active poison or disease.</li>" +
    "</ul>",
  activities: {
    dnd5eactSmiteFth: {
      _id: "dnd5eactSmiteFth",
      type: "damage",
      name: "Righteous Wrath: Smite",
      img: "",
      activation: { type: "bonus", value: 1, condition: "On melee weapon hit; spend 1 Channel use" },
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
            bonus: "@classes.keeper.levels + @abilities.cha.mod",
            types: ["force"],
            custom: { enabled: true, formula: "@classes.keeper.levels + @abilities.cha.mod" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactSustain: {
      _id: "dnd5eactSustain",
      type: "heal",
      name: "Righteous Wrath: Sustain",
      img: "",
      activation: { type: "bonus", value: 1, condition: "Spend 1 Channel use" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { units: "touch", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      healing: {
        number: null,
        denomination: null,
        bonus: "@classes.keeper.levels + @abilities.cha.mod",
        types: ["healing"],
        custom: { enabled: true, formula: "@classes.keeper.levels + @abilities.cha.mod" },
        scaling: { mode: "", number: null, formula: "" },
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
  },
}));

// 2. Path of the Chosen
write(`${PATH_DIR}/path-of-the-chosen.json`, createPath({
  id: "PathChosen000001",
  name: "Path of the Chosen",
  description:
    "<p>You embrace the raw, unfiltered hunger of Novictum and the darker frequencies of the Source, commanding fear and absolute supremacy.</p>" +
    "<h3>Source Affinity</h3>" +
    "<p>Your Source Affinity damage type is <strong>Necrotic</strong>.</p>" +
    "<h3>Scent of Ambition</h3>" +
    "<p>You gain proficiency in <strong>Deception or Intimidation</strong> (your choice). By speaking with a creature for 1 minute, you can make a contested Charisma check to reveal its secret ambitions, physical vulnerabilities, or personal bribe price. You gain Advantage on checks to intimidate or extort that target for 24 hours.</p>" +
    "<h3>Channel the Source: Unhallowed Wrath</h3>" +
    "<ul>" +
    "<li><strong>Novictum Drain (Action)</strong>: Expend 1 Channel use to target a creature within 60 feet. The target must make a <strong>Constitution saving throw</strong> against your Program Save DC. On a failure, it takes <strong>1d8 + Keeper level + Charisma modifier Necrotic damage</strong> (or half as much on a success), and you gain <strong>Temporary Hit Points equal to the damage dealt</strong>.</li>" +
    "<li><strong>Spiteful Transfusion (Reaction)</strong>: When an ally within 60 feet drops to 0 hit points, spend 1 Channel use. You suffer unpreventable Necrotic damage equal to <strong>2 &times; your Keeper level</strong>. Your ally drops to 1 hit point instead and gains <strong>Temporary Hit Points equal to the damage you suffered</strong>.</li>" +
    "</ul>",
  activities: {
    dnd5eactNovictum: {
      _id: "dnd5eactNovictum",
      type: "save",
      name: "Novictum Drain",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 1 Channel use" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["con"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: {
        critical: { bonus: "" },
        includeBase: false,
        parts: [
          {
            number: 1,
            denomination: 8,
            bonus: "@classes.keeper.levels + @abilities.cha.mod",
            types: ["necrotic"],
            custom: { enabled: true, formula: "1d8 + @classes.keeper.levels + @abilities.cha.mod" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactTransfuse: {
      _id: "dnd5eactTransfuse",
      type: "utility",
      name: "Spiteful Transfusion",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When an ally within 60 ft drops to 0 HP; spend 1 Channel use" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
  },
}));

// 3. Path of the Watcher
write(`${PATH_DIR}/path-of-the-watcher.json`, createPath({
  id: "PathWatcher00001",
  name: "Path of the Watcher",
  description:
    "<p>You align with the cold, objective equilibrium of archival intelligence, acting as an impartial observer and enforcer of cosmic balance.</p>" +
    "<h3>Source Affinity</h3>" +
    "<p>Your Source Affinity damage type is <strong>Psychic or Ion</strong> (chosen when you select this path).</p>" +
    "<h3>Impartial Guardian</h3>" +
    "<p>You gain proficiency in <strong>Investigation or Lore</strong> (your choice).</p>" +
    "<ul>" +
    "<li><strong>Digital Sentinel</strong>: You can interface with terminals and local networks without triggering alarm triggers or audit trails, though you cannot alter or erase data while unauthenticated.</li>" +
    "<li><strong>Biometric Polygraph</strong>: You have <strong>Advantage on Wisdom (Insight) checks</strong> made to determine if a creature is speaking a deliberate falsehood.</li>" +
    "</ul>" +
    "<h3>Channel the Source: Spectator's Wrath</h3>" +
    "<ul>" +
    "<li><strong>Stasis Wave (Action)</strong>: Expend 1 Channel use to broadcast a 30-foot cone of temporal deceleration. Each creature in the area must make a <strong>Wisdom saving throw</strong> against your Program Save DC. On a failed save, a creature is <strong>Incapacitated and has its speed reduced to 0</strong> until the end of its next turn. This effect ends early if the target takes damage.</li>" +
    "<li><strong>Null Damping (Reaction)</strong>: As a Reaction when a creature within 30 feet casts a nanoprogram or spell, spend 1 Channel use. The target must make a <strong>Constitution saving throw</strong> against your Program Save DC. On a failure, the nanoprogram fails and its action and Nanopool are wasted. The creature has Advantage on this save if the program's tier exceeds your Max Power Level.</li>" +
    "</ul>",
  activities: {
    dnd5eactStasisWav: {
      _id: "dnd5eactStasisWav",
      type: "save",
      name: "Stasis Wave",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 1 Channel use" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "1", contiguous: false, type: "cone", size: "30", width: "", height: "", units: "ft" },
        affects: { count: "", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["wis"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactNullDamp: {
      _id: "dnd5eactNullDamp",
      type: "save",
      name: "Null Damping",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a creature within 30 ft casts a nanoprogram; spend 1 Channel use" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "the caster" },
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
      sort: 1,
    },
  },
}));

/* ================================================================== */
/*  3.  KEEPER AURAS  →  src/features/keeper/auras/                   */
/* ================================================================== */

console.log("\n▸ Keeper Auras");
const AURA_DIR = "src/features/keeper/auras";

function createAura({ id, name, description, activities = {} }) {
  return createFeat({
    id,
    name: `Aura: ${name}`,
    img: "icons/magic/defensive/shield-barrier-glowing-triangle-yellow.webp",
    description,
    subtype: "aura",
    requirements: "Keeper 3",
    activities,
  });
}

// 1. Aura of Conquest
write(`${AURA_DIR}/aura-of-conquest.json`, createAura({
  id: "AuraConquest0001",
  name: "Aura of Conquest",
  description:
    "<p>You project an aura of suffocating terror out to your aura radius.</p>" +
    "<p>Whenever an enemy creature that is <strong>Frightened</strong> starts its turn in your aura, it suffers <strong>4 Slowed levels</strong> (its speed is reduced by 20 feet) and takes psychic damage equal to <strong>half your Keeper level</strong> (rounded down).</p>",
}));

// 2. Aura of Conviction
write(`${AURA_DIR}/aura-of-conviction.json`, createAura({
  id: "AuraConviction01",
  name: "Aura of Conviction",
  description:
    "<p>Unshakeable resolve resonates through your field. You and friendly creatures within your aura have <strong>Advantage on saving throws against being Charmed and Frightened</strong>.</p>",
}));

// 3. Aura of Hatred
write(`${AURA_DIR}/aura-of-hatred.json`, createAura({
  id: "AuraOfHatred0001",
  name: "Aura of Hatred",
  description:
    "<p>Malicious bio-frequencies empower physical aggression. You and friendly creatures within your aura add your <strong>Charisma modifier (minimum +1)</strong> to the first melee weapon damage roll each creature makes on each of its turns.</p>",
}));

// 4. Aura of Presence
write(`${AURA_DIR}/aura-of-presence.json`, createAura({
  id: "AuraOfPresence01",
  name: "Aura of Presence",
  description:
    "<p>Your commanding presence fortifies the mind and body. Whenever you or a friendly creature in your aura makes a saving throw, the creature gains a bonus to the saving throw equal to your <strong>Charisma modifier</strong> (minimum of +1).</p>",
}));

// 5. Aura of Protection
write(`${AURA_DIR}/aura-of-protection.json`, createAura({
  id: "AuraOfProtect001",
  name: "Aura of Protection",
  description:
    "<p>Your shielding extends across your allies. As a <strong>Reaction</strong> whenever a creature within your aura takes damage, you can absorb the harm entirely. The triggering damage is transferred to you instead, and this damage cannot be reduced or mitigated by any means.</p>",
  activities: {
    dnd5eactAuraAbsorb: {
      _id: "dnd5eactAuraAbsorb",
      type: "utility",
      name: "Absorb Ally Damage",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a creature in your aura takes damage" },
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

// 6. Aura of Vigor
write(`${AURA_DIR}/aura-of-vigor.json`, createAura({
  id: "AuraOfVigor00001",
  name: "Aura of Vigor",
  description:
    "<p>Living harmonics revitalize your squad. Friendly creatures that start their turn within your aura gain <strong>Temporary Hit Points equal to your Charisma modifier</strong> (minimum 1).</p>",
}));

// 7. Aura of Warding
write(`${AURA_DIR}/aura-of-warding.json`, createAura({
  id: "AuraOfWarding001",
  name: "Aura of Warding",
  description:
    "<p>Electromagnetic interference fields screen hostile nanite clouds. You and friendly creatures within your aura have <strong>resistance to damage from nanoprograms and spells</strong>.</p>",
}));

/* ================================================================== */
/*  4.  KEEPER CLASS DOCUMENT  →  src/classes/keeper.json             */
/* ================================================================== */

console.log("\n▸ Keeper Class Document");

write("src/classes/keeper.json", {
  _id: "KeeperClass00001",
  name: "Keeper",
  type: "class",
  img: "icons/weapons/swords/sword-holy-glowing-yellow.webp",
  system: {
    description: {
      value:
        "<p>A paladin of the bio-synthetic era, ideological champion, and master of Source frequencies. The Keeper projects protective harmonic auras, channels supernatural faction wrath, and smites heretical hostiles with devastating Source-empowered strikes.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "keeper",
    levels: 1,
    hd: { denomination: 10, spent: 0, additional: "" },
    primaryAbility: { value: ["str", "cha"], all: false },
    spellcasting: { progression: "half", ability: "cha" },
    advancement: [
      /* ── Hit Points (d10) ── */
      {
        _id: "advKepHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: CON, CHA ── */
      {
        _id: "advKepSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:con", "saves:cha"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: lgt, med, hvy, shl ── */
      {
        _id: "advKepArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt", "armor:med", "armor:hvy", "armor:shl"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },
      /* ── Weapon Proficiencies: sim, mar, sourceweapon, vibroweapon ── */
      {
        _id: "advKepWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:mar", "weapons:sourceweapon", "weapons:vibroweapon"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 2 ── */
      {
        _id: "advKepSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 2,
              pool: [
                "skills:acr",
                "skills:ath",
                "skills:dec",
                "skills:ins",
                "skills:itm",
                "skills:lor",
                "skills:prc",
                "skills:per",
                "skills:pil",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Resonance Strikes ── */
      {
        _id: "advKepScResonnc1",
        type: "ScaleValue",
        configuration: {
          identifier: "resonance-strikes",
          type: "dice",
          scale: {
            2:  { number: 2, faces: 8 },
            5:  { number: 3, faces: 8 },
            9:  { number: 4, faces: 8 },
            13: { number: 5, faces: 8 },
            17: { number: 6, faces: 8 },
          },
        },
        value: {},
        level: 2,
        title: "Resonance Strikes",
      },

      /* ── ScaleValue: Auras Known ── */
      {
        _id: "advKepScAurasKn1",
        type: "ScaleValue",
        configuration: {
          identifier: "auras-known",
          type: "number",
          scale: {
            3:  { value: 1 },
            10: { value: 2 },
            18: { value: 3 },
          },
        },
        value: {},
        level: 3,
        title: "Auras Known",
      },

      /* ── ScaleValue: Aura Radius ── */
      {
        _id: "advKepScAuraRad1",
        type: "ScaleValue",
        configuration: {
          identifier: "aura-radius",
          type: "distance",
          scale: {
            3:  { value: 15 },
            17: { value: 30 },
          },
        },
        value: {},
        level: 3,
        title: "Aura Radius",
      },

      /* ── ScaleValue: Channel Uses ── */
      {
        _id: "advKepScChannel1",
        type: "ScaleValue",
        configuration: {
          identifier: "channel-uses",
          type: "number",
          formula: "@prof",
          scale: {
            2:  { value: 2, formula: "@prof" },
            5:  { value: 3, formula: "@prof" },
            9:  { value: 4, formula: "@prof" },
            13: { value: 5, formula: "@prof" },
            17: { value: 6, formula: "@prof" },
          },
        },
        value: {},
        level: 2,
        title: "Channel Uses",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advKepScNanopl01",
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

      /* ── ItemGrant: Level 1 (Nanocasting, Weapon Mastery) ── */
      {
        _id: "advKepItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepNanocasting01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepWpnMastery001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Keeper Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Fighting Style, Path of the Source, Source-Empowered Strikes) ── */
      {
        _id: "advKepItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepFightStyle001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepPathSource001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepEmpoweredSt01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Keeper Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Keeper Creed") ── */
      {
        _id: "advKepSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Keeper Creed",
      },

      /* ── ItemGrant: Level 3 (Keeper Aura) ── */
      {
        _id: "advKepItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepKeeperAura001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Keeper Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advKepASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Extra Attack) ── */
      {
        _id: "advKepItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepExtraAttack01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Keeper Features (Level 5)",
      },

      /* ── ItemGrant: Level 6 (System Purity) ── */
      {
        _id: "advKepItmGrLvl06",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepSystemPurity1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Keeper Features (Level 6)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advKepASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 10 (Envoy) ── */
      {
        _id: "advKepItmGrLvl10",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepEnvoy00000001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 10,
        title: "Keeper Features (Level 10)",
      },

      /* ── ItemGrant: Level 11 (Improved Source-Empowered Strikes) ── */
      {
        _id: "advKepItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepImpEmpowrSt01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Keeper Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advKepASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 13 (Source-Sustained Vessel) ── */
      {
        _id: "advKepItmGrLvl13",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepSustainedV001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 13,
        title: "Keeper Features (Level 13)",
      },

      /* ── ItemGrant: Level 14 (Cleansing Touch) ── */
      {
        _id: "advKepItmGrLvl14",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.KepCleanseTouch1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Keeper Features (Level 14)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advKepASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advKepASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },
    ],
    wealth: "5d4 * 10",
    startingEquipment: [],
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!KeeperClass00001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Keeper build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
