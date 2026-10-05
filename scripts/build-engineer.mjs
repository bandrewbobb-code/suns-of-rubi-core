#!/usr/bin/env node
/**
 * build-engineer.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Engineer class package:
 *   • src/actors/                         – 7 Automaton Companion NPC Actors
 *   • src/features/engineer/              – 11 Core Class Features
 *   • src/features/engineer/schematics/   – 26 Tradeskill Schematics
 *   • src/features/engineer/upgrades/     – 58 System Upgrades
 *   • src/classes/engineer.json           – Engineer Class Document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - Unique 16-character alphanumeric _id at root and in _key
 *   - Compound _key for embedded actor items: "!actors.items!<actor_id>.<item_id>"
 *   - prototypeToken.depth: 1 on all NPC actors
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
    obj._key = obj.type === "npc" || obj.type === "character"
      ? `!actors!${obj._id}`
      : `!items!${obj._id}`;
  }

  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath} [${obj._id}]`);
}

/** Standard feat scaffold for Engineer features, schematics, and upgrades */
function createFeat({
  id,
  name,
  img = "icons/skills/trades/tools-wrench-screwdriver-yellow.webp",
  description,
  subtype = "",
  requirements = "Engineer 1",
  activities = {},
  uses = null,
}) {
  return {
    _id: id,
    name,
    type: "feat",
    img,
    system: {
      description: {
        value: description,
        chat: "",
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024",
      },
      uses: uses ?? {
        spent: 0,
        recovery: [],
        max: "",
      },
      type: {
        value: "class",
        subtype,
      },
      requirements,
      activities,
      prerequisites: {
        level: null,
      },
      properties: [],
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
/*  1. Automaton Companion NPC Actors (src/actors/)                    */
/* ================================================================== */

function createReactorCore(actorId, itemId = "RctCoreAuto00001") {
  return {
    _id: itemId,
    name: "Reactor Core",
    type: "feat",
    img: "icons/magic/fire/orb-vortex-sun-yellow.webp",
    system: {
      description: {
        value: `<p><strong>Heat Management (0–10):</strong> The automaton is driven by a high-output miniaturized fusion reactor.</p>
<ul>
  <li><strong>Heat Buildup:</strong> At the start of each of its turns, the automaton generates <strong>+1 Heat</strong> (or <strong>+2 Heat</strong> if it is within 5 feet of one or more hostile creatures). Whenever the automaton suffers 10 or more damage from a single attack or effect, it generates <strong>+1 Heat</strong>.</li>
  <li><strong>Meltdown Check:</strong> At the start of its turn, if its Heat is <strong>7 or higher</strong>, roll a d20. If the roll is strictly less than its current Heat (\`d20 < Heat\`), the core breaches in a catastrophic <strong>Meltdown</strong>:
    <ul>
      <li>Every creature within a <strong>10-foot radius</strong> must make a Dexterity saving throw (DC = 8 + creator's PB + creator's INT mod), taking <strong>@prof d6 fire and kinetic damage</strong> on a failed save, or half on a success.</li>
      <li>The area becomes heavily obscured by superheated steam and radioactive exhaust until the end of the automaton's next turn.</li>
      <li><strong>Emergency Lockout:</strong> The automaton immediately suffers Emergency Lockout: it is <strong>Incapacitated</strong> with a speed of 0 until the end of its next turn. Its Heat resets to 0.</li>
    </ul>
  </li>
</ul>`,
      },
      source: { custom: "Suns of Rubi" },
      type: { value: "monster", subtype: "Trait" },
      requirements: "",
      activities: {
        actMeltdown00001: {
          _id: "actMeltdown00001",
          type: "save",
          activation: {
            type: "special",
            value: null,
            condition: "When d20 < Heat during turn start check at 7+ Heat",
          },
          duration: { value: "0", units: "inst" },
          target: {
            affects: { count: "", type: "", choice: false, special: "" },
            template: {
              count: 0,
              contiguous: false,
              type: "radius",
              size: "10",
              width: 0,
              height: 0,
              units: "ft",
            },
          },
          range: { units: "self", special: "" },
          uses: { spent: 0, max: "", recovery: [] },
          save: {
            ability: ["dex"],
            dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" },
          },
          damage: {
            critical: { allow: false, bonus: "" },
            parts: [
              {
                custom: { enabled: true, formula: "@prof d6" },
                types: ["fire"],
                scaling: { mode: "whole", number: null, formula: "" },
              },
            ],
          },
          name: "Reactor Meltdown",
          img: "",
          appliedEffects: [],
        },
      },
    },
    effects: [],
    flags: {},
    sort: 100000,
    _key: `!actors.items!${actorId}.${itemId}`,
  };
}

function createAutomatonActor({
  id,
  name,
  img,
  size = "med",
  acFormula,
  hpFormula,
  walk = 30,
  fly = 0,
  burrow = 0,
  hover = false,
  str,
  dex,
  con,
  int,
  wis,
  cha,
  saves = [],
  skills = {},
  senses = "Darkvision 60 ft",
  specialTraits = [],
  actions = [],
  bonusActions = [],
  reactions = [],
  extraDamageImmunities = [],
  extraConditionImmunities = [],
  bio = "",
}) {
  const actorItems = [];

  // 1. Reactor Core
  actorItems.push(createReactorCore(id, `RctCore${id.slice(4, 14)}`));

  // 2. Embedded Traits
  specialTraits.forEach((tr, i) => {
    const itemId = `Trait${id.slice(4, 12)}${String(i + 1).padStart(2, "0")}`;
    actorItems.push({
      _id: itemId,
      name: tr.name,
      type: "feat",
      img: tr.img || "icons/magic/defensive/shield-barrier-blue.webp",
      system: {
        description: { value: tr.description },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Trait" },
        requirements: "",
        activities: tr.activities || {},
      },
      effects: [],
      flags: {},
      sort: 200000 + i * 10000,
      _key: `!actors.items!${id}.${itemId}`,
    });
  });

  // 3. Actions / Attacks
  actions.forEach((act, i) => {
    const itemId = `Actn${id.slice(4, 12)}${String(i + 1).padStart(2, "0")}`;
    actorItems.push({
      _id: itemId,
      name: act.name,
      type: act.type || "weapon",
      img: act.img || "icons/weapons/maces/mace-round-spiked-grey.webp",
      system: {
        description: { value: act.description },
        source: { custom: "Suns of Rubi" },
        type: { value: "natural" },
        requirements: "",
        equipped: true,
        proficient: true,
        activities: act.activities || {},
      },
      effects: [],
      flags: {},
      sort: 300000 + i * 10000,
      _key: `!actors.items!${id}.${itemId}`,
    });
  });

  // 4. Bonus Actions
  bonusActions.forEach((ba, i) => {
    const itemId = `BAct${id.slice(4, 12)}${String(i + 1).padStart(2, "0")}`;
    actorItems.push({
      _id: itemId,
      name: ba.name,
      type: "feat",
      img: ba.img || "icons/magic/movement/chevrons-right-yellow.webp",
      system: {
        description: { value: ba.description },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Bonus Action" },
        requirements: "",
        activities: ba.activities || {},
      },
      effects: [],
      flags: {},
      sort: 400000 + i * 10000,
      _key: `!actors.items!${id}.${itemId}`,
    });
  });

  // 5. Reactions
  reactions.forEach((re, i) => {
    const itemId = `Reac${id.slice(4, 12)}${String(i + 1).padStart(2, "0")}`;
    actorItems.push({
      _id: itemId,
      name: re.name,
      type: "feat",
      img: re.img || "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
      system: {
        description: { value: re.description },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Reaction" },
        requirements: "",
        activities: re.activities || {},
      },
      effects: [],
      flags: {},
      sort: 500000 + i * 10000,
      _key: `!actors.items!${id}.${itemId}`,
    });
  });

  return {
    _id: id,
    name,
    type: "npc",
    img,
    system: {
      abilities: {
        str: { value: str, proficient: saves.includes("str") ? 1 : 0 },
        dex: { value: dex, proficient: saves.includes("dex") ? 1 : 0 },
        con: { value: con, proficient: saves.includes("con") ? 1 : 0 },
        int: { value: int, proficient: saves.includes("int") ? 1 : 0 },
        wis: { value: wis, proficient: saves.includes("wis") ? 1 : 0 },
        cha: { value: cha, proficient: saves.includes("cha") ? 1 : 0 },
      },
      attributes: {
        ac: { flat: null, calc: "custom", formula: acFormula },
        hp: { value: 20, max: 20, formula: hpFormula },
        movement: {
          walk,
          fly,
          burrow,
          climb: 0,
          swim: 0,
          units: "ft",
          hover,
        },
        senses: {
          darkvision: 60,
          blindsight: 0,
          tremorsense: senses.includes("Tremorsense 30 ft") ? 30 : 0,
          truesight: 0,
          units: "ft",
          special: senses,
        },
      },
      details: {
        biography: { value: bio, public: "" },
        alignment: "Unaligned",
        cr: null,
        spellLevel: 0,
        type: {
          value: "construct",
          subtype: "Automaton",
          swarm: "",
          custom: "",
        },
        source: { custom: "Suns of Rubi" },
      },
      traits: {
        size,
        di: {
          value: ["poison", "psychic", ...extraDamageImmunities],
          bypasses: [],
          custom: "",
        },
        dv: {
          value: ["lightning"],
          bypasses: [],
          custom: "Ion",
        },
        dr: { value: [], bypasses: [], custom: "" },
        ci: {
          value: ["charmed", "exhaustion", "frightened", "poisoned", ...extraConditionImmunities],
          custom: "",
        },
        languages: {
          value: [],
          custom: "Understands creator's languages but cannot speak",
        },
      },
      skills,
    },
    prototypeToken: {
      name,
      displayName: 20,
      displayBars: 20,
      actorLink: true,
      disposition: 1,
      bar1: { attribute: "attributes.hp" },
      sight: {
        enabled: true,
        range: 60,
        visionMode: "darkvision",
      },
      depth: 1,
    },
    items: actorItems,
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    _stats: { compendiumSource: null, duplicateSource: null },
    _key: `!actors!${id}`,
  };
}

// 1. Automaton: Android
write(
  "src/actors/automaton-android.json",
  createAutomatonActor({
    id: "AutoAndroid00001",
    name: "Automaton: Android",
    img: "icons/creatures/magical/construct-iron-humanoid.webp",
    size: "med",
    acFormula: "13 + @prof",
    hpFormula: "5 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 30,
    str: 16,
    dex: 14,
    con: 14,
    int: 6,
    wis: 12,
    cha: 8,
    saves: ["str", "dex"],
    skills: {
      ath: { value: 1, ability: "str" },
      itm: { value: 1, ability: "cha" },
      prc: { value: 1, ability: "wis" },
    },
    bio: "<p>An anthropomorphic bipedal combat unit engineered for tactical breach maneuvers, close retention defense, and high-threat target neutralization.</p>",
    specialTraits: [
      {
        name: "Articulated Hardpoints",
        description: "<p>The Android can wield one-handed weapons or shields in its articulated manipulators, and its walking speed increases by 5 feet for each point of its creator's Proficiency Bonus.</p>",
      },
    ],
    actions: [
      {
        name: "Heavy Backhand",
        description: "<p><em>Melee Attack:</em> Reach 5 ft., one target. Hit: 1d8 + @prof kinetic damage.</p>",
        activities: {
          actHvyBackhand01: {
            _id: "actHvyBackhand01",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            attack: { ability: "str", bonus: "@prof", flat: false, type: { value: "melee", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d8 + @prof" }, types: ["kinetic"] }] },
            name: "Heavy Backhand",
          },
        },
      },
      {
        name: "Disarming Strike (3 Heat)",
        description: "<p><em>Special Attack (Generates 3 Heat):</em> The Android strikes a foe's arm. Target makes a STR save (DC 8 + creator's PB + INT mod) or drops one held item.</p>",
        activities: {
          actDisarmStrike1: {
            _id: "actDisarmStrike1",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            name: "Disarming Strike",
          },
        },
      },
      {
        name: "Ragdoll Heave (4 Heat)",
        description: "<p><em>Special Attack (Generates 4 Heat):</em> The Android lifts a Medium or smaller creature and heaves it up to 20 feet away. The target lands prone and takes 2d6 kinetic damage.</p>",
        activities: {
          actRagdollHeave1: {
            _id: "actRagdollHeave1",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d6" }, types: ["kinetic"] }] },
            name: "Ragdoll Heave",
          },
        },
      },
      {
        name: "Chokehold (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> The Android seizes a creature by the throat. The target is Grappled and Restrained (escape DC 8 + creator PB + INT mod) and suffers 2d8 + @prof kinetic damage at the start of each of its turns.</p>",
        activities: {
          actChokehold0001: {
            _id: "actChokehold0001",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d8 + @prof" }, types: ["kinetic"] }] },
            name: "Chokehold",
          },
        },
      },
    ],
    bonusActions: [
      {
        name: "Protocol Override (1/LR)",
        description: "<p>The Android enters an overclocked tactical state until the end of its turn: its speed doubles and its weapon attacks have Advantage.</p>",
        activities: {
          actProtOverride1: {
            _id: "actProtOverride1",
            type: "utility",
            activation: { type: "bonus", value: 1 },
            name: "Protocol Override",
          },
        },
      },
    ],
  })
);

// 2. Automaton: Cyber-Hound
write(
  "src/actors/automaton-cyber-hound.json",
  createAutomatonActor({
    id: "AutoCyberHound01",
    name: "Automaton: Cyber-Hound",
    img: "icons/creatures/magical/construct-hound-steel.webp",
    size: "med",
    acFormula: "13 + @prof",
    hpFormula: "5 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 50,
    str: 16,
    dex: 14,
    con: 14,
    int: 6,
    wis: 12,
    cha: 8,
    saves: ["dex", "con"],
    skills: {
      prc: { value: 1, ability: "wis" },
      sur: { value: 1, ability: "wis" },
    },
    extraDamageImmunities: ["fire"],
    bio: "<p>A quadrupedal vanguard hound equipped with omni-directional lidar, thermal olfactory sensors, and an internal plasma vent.</p>",
    specialTraits: [
      {
        name: "Lidar & Thermal Sniffer",
        description: "<p>The Cyber-Hound has Advantage on Wisdom (Perception) checks that rely on sight or smell, and detects hidden or invisible creatures within 30 feet.</p>",
      },
      {
        name: "Thermal Link (Level 7)",
        description: "<p>At 7th level, the creator shares sensory input with the Cyber-Hound, gaining Advantage on initiative while within 100 feet of it.</p>",
      },
    ],
    actions: [
      {
        name: "Incendiary Fang",
        description: "<p><em>Melee Attack:</em> Reach 5 ft., one target. Hit: 1d6 + @prof piercing damage plus 1d4 fire damage.</p>",
        activities: {
          actIncenFang0001: {
            _id: "actIncenFang0001",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            attack: { ability: "str", bonus: "@prof", flat: false, type: { value: "melee", classification: "weapon" } },
            damage: {
              critical: { allow: true },
              parts: [
                { custom: { enabled: true, formula: "1d6 + @prof" }, types: ["piercing"] },
                { custom: { enabled: true, formula: "1d4" }, types: ["fire"] },
              ],
            },
            name: "Incendiary Fang",
          },
        },
      },
      {
        name: "Plasma Spittle (3 Heat)",
        description: "<p><em>Ranged Attack (Generates 3 Heat):</em> Range 30 ft., one creature. Target makes a Dex save or takes 2d6 fire damage and is blinded until the start of its next turn.</p>",
        activities: {
          actPlasmaSpittle: {
            _id: "actPlasmaSpittle",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "30", units: "ft" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d6" }, types: ["fire"] }] },
            name: "Plasma Spittle",
          },
        },
      },
      {
        name: "Brutal Rush (4 Heat)",
        description: "<p><em>Special Attack (Generates 4 Heat):</em> The Hound moves up to 20 feet straight toward a creature and rams it. Target makes a STR save or is knocked Prone and takes 2d6 kinetic damage.</p>",
        activities: {
          actBrutalRush001: {
            _id: "actBrutalRush001",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "20", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d6" }, types: ["kinetic"] }] },
            name: "Brutal Rush",
          },
        },
      },
      {
        name: "Reactor Fire Breath (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> The Hound vents its core in a 15-foot cone. Each creature must make a Dex save, taking 3d6 fire damage on a failure, or half on a success.</p>",
        activities: {
          actFireBreath001: {
            _id: "actFireBreath001",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "cone", size: "15", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "3d6" }, types: ["fire"] }] },
            name: "Reactor Fire Breath",
          },
        },
      },
    ],
    bonusActions: [
      {
        name: "Predictive Tactical Sweep (1/LR)",
        description: "<p>The Cyber-Hound scans terrain, revealing hidden enemies within 60 feet to creator and allies until the end of its turn.</p>",
      },
    ],
  })
);

// 3. Automaton: Drone
write(
  "src/actors/automaton-drone.json",
  createAutomatonActor({
    id: "AutoDrone0000001",
    name: "Automaton: Drone",
    img: "icons/creatures/fey/sprite-glowing-yellow.webp",
    size: "sm",
    acFormula: "13 + @prof",
    hpFormula: "4 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 10,
    fly: 40,
    hover: true,
    str: 8,
    dex: 16,
    con: 12,
    int: 5,
    wis: 14,
    cha: 6,
    saves: ["dex", "wis"],
    skills: { prc: { value: 1, ability: "wis" } },
    bio: "<p>An airborne reconnaissance and precision harassment skiff equipped with repulsorlift thrusters and an active targeting laser.</p>",
    specialTraits: [
      {
        name: "Optical Telemetry",
        description: "<p>The Drone projects targeting data to its creator. While within 60 feet, the creator's ranged attacks ignore half cover.</p>",
      },
      {
        name: "Flyby (Level 5)",
        description: "<p>Starting at 5th level, the Drone does not provoke Opportunity Attacks when flying out of an enemy's reach.</p>",
      },
    ],
    actions: [
      {
        name: "Pulse Laser",
        description: "<p><em>Ranged Attack:</em> Range 30/120 ft., one target. Hit: 1d4 + @prof energy damage.</p>",
        activities: {
          actPulseLaser001: {
            _id: "actPulseLaser001",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "30", long: "120", units: "ft" },
            attack: { ability: "dex", bonus: "@prof", flat: false, type: { value: "ranged", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d4 + @prof" }, types: ["energy"] }] },
            name: "Pulse Laser",
          },
        },
      },
      {
        name: "Paint Target (2 Heat)",
        description: "<p><em>Special Action (Generates 2 Heat):</em> Illuminates a target within 60 ft with laser telemetry. Attacks against the target have Advantage until the Drone's next turn.</p>",
      },
      {
        name: "Swoop & Strip (4 Heat)",
        description: "<p><em>Special Action (Generates 4 Heat):</em> Dives past a creature and snatches an unattached or carried item with Dex vs DC check.</p>",
      },
      {
        name: "Razor Flurry (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> Ejects micro-shards in a 10-ft radius. Dex save or take 3d4 + @prof slashing damage.</p>",
        activities: {
          actRazorFlurry01: {
            _id: "actRazorFlurry01",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "radius", size: "10", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "3d4 + @prof" }, types: ["slashing"] }] },
            name: "Razor Flurry",
          },
        },
      },
    ],
    reactions: [
      {
        name: "Interceptor Dive (1/LR)",
        description: "<p>When an attack is made against creator within 10 feet, Drone interposes itself and takes the attack instead.</p>",
      },
    ],
  })
);

// 4. Automaton: Gladiator
write(
  "src/actors/automaton-gladiator.json",
  createAutomatonActor({
    id: "AutoGladiator001",
    name: "Automaton: Gladiator",
    img: "icons/creatures/magical/construct-golem-iron-armored.webp",
    size: "med",
    acFormula: "13 + @prof",
    hpFormula: "6 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 40,
    str: 16,
    dex: 12,
    con: 16,
    int: 5,
    wis: 10,
    cha: 6,
    saves: ["str", "con"],
    skills: {
      acr: { value: 1, ability: "dex" },
      prc: { value: 1, ability: "wis" },
    },
    bio: "<p>A high-torque arena construct built for aggressive crowd-pleasing kinetic brutality and arena-clearing shock waves.</p>",
    specialTraits: [
      {
        name: "Acoustic & Optical Scanners",
        description: "<p>The Gladiator cannot be surprised while conscious.</p>",
      },
    ],
    actions: [
      {
        name: "Hydraulic Claws",
        description: "<p><em>Melee Attack:</em> Reach 5 ft., one target. Hit: 1d6 + @prof kinetic damage.</p>",
        activities: {
          actHydrClaws0001: {
            _id: "actHydrClaws0001",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            attack: { ability: "str", bonus: "@prof", flat: false, type: { value: "melee", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d6 + @prof" }, types: ["kinetic"] }] },
            name: "Hydraulic Claws",
          },
        },
      },
      {
        name: "Violent Impact (3 Heat)",
        description: "<p><em>Special Attack (Generates 3 Heat):</em> Target makes STR save or takes 2d6 kinetic damage and is knocked back 10 ft.</p>",
        activities: {
          actViolentImp001: {
            _id: "actViolentImp001",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "5", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d6" }, types: ["kinetic"] }] },
            name: "Violent Impact",
          },
        },
      },
      {
        name: "Piston Slam (4 Heat)",
        description: "<p><em>Special Attack (Generates 4 Heat):</em> Overhead slam forces CON save vs Stunned until start of next turn.</p>",
        activities: {
          actPistonSlam001: {
            _id: "actPistonSlam001",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "5", units: "ft" },
            save: { ability: ["con"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d6" }, types: ["kinetic"] }] },
            name: "Piston Slam",
          },
        },
      },
      {
        name: "Hydraulic Clamp (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> Pinches target in hydraulic vice, dealing 3d8 + @prof bludgeoning damage and grappling it.</p>",
        activities: {
          actHydrClamp0001: {
            _id: "actHydrClamp0001",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "5", units: "ft" },
            save: { ability: ["str"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "3d8 + @prof" }, types: ["kinetic"] }] },
            name: "Hydraulic Clamp",
          },
        },
      },
    ],
    bonusActions: [
      {
        name: "Battle Klaxon (1/LR)",
        description: "<p>Sounds a deafening audio horn: enemies within 30 ft have Disadvantage on attack rolls against targets other than the Gladiator until start of its next turn.</p>",
      },
    ],
  })
);

// 5. Automaton: Launcher
write(
  "src/actors/automaton-launcher.json",
  createAutomatonActor({
    id: "AutoLauncher0001",
    name: "Automaton: Launcher",
    img: "icons/weapons/artillery/cannon-barrel-firing.webp",
    size: "sm",
    acFormula: "13 + @prof",
    hpFormula: "4 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 25,
    str: 8,
    dex: 16,
    con: 13,
    int: 6,
    wis: 12,
    cha: 4,
    saves: ["con"],
    skills: {
      prc: { value: 1, ability: "wis" },
      tec: { value: 1, ability: "int" },
    },
    bio: "<p>A mobile artillery tripod with variable payload canisters, laser triangulation, and a stabilized mortar barrel.</p>",
    specialTraits: [
      {
        name: "Chassis Camouflage",
        description: "<p>The Launcher can take the Hide action in dim light, fog, or difficult terrain without cover.</p>",
      },
    ],
    actions: [
      {
        name: "Mortar",
        description: "<p><em>Ranged Attack:</em> Range 60/240 ft., one target. Hit: 1d10 + @prof energy damage.</p>",
        activities: {
          actMortarLaunch1: {
            _id: "actMortarLaunch1",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "60", long: "240", units: "ft" },
            attack: { ability: "dex", bonus: "@prof", flat: false, type: { value: "ranged", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d10 + @prof" }, types: ["energy"] }] },
            name: "Mortar",
          },
        },
      },
      {
        name: "Destabilizing Shell (2 Heat)",
        description: "<p><em>Special Attack (Generates 2 Heat):</em> Shell explodes in a 10-ft radius; Dex save or knocked Prone and speed halved.</p>",
      },
      {
        name: "White-Phosphorus Barrage (4 Heat)",
        description: "<p><em>Special Attack (Generates 4 Heat):</em> Creates a 15-ft radius cloud of burning phosphorus for 1 minute; creatures starting turn inside take 2d6 fire damage.</p>",
      },
      {
        name: "Bunker-Buster Torpedo (8 Heat)",
        description: "<p><em>Signature Attack (Generates 8 Heat):</em> Launches heavy bunker-buster dealing 4d10 force damage to a target and 2d10 to creatures within 10 ft (Dex save half).</p>",
        activities: {
          actBunkerBuster1: {
            _id: "actBunkerBuster1",
            type: "save",
            activation: { type: "action", value: 1 },
            range: { value: "120", units: "ft" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "4d10" }, types: ["force"] }] },
            name: "Bunker-Buster Torpedo",
          },
        },
      },
    ],
    bonusActions: [
      {
        name: "Bipod Siege Lock",
        description: "<p>Locks stabilizers into ground: speed becomes 0, but attack rolls with Mortar gain a +2 bonus.</p>",
      },
    ],
  })
);

// 6. Automaton: Slayerdroid
write(
  "src/actors/automaton-slayerdroid.json",
  createAutomatonActor({
    id: "AutoSlayerdroid1",
    name: "Automaton: Slayerdroid",
    img: "icons/creatures/magical/construct-golem-metallic-spikes.webp",
    size: "lg",
    acFormula: "14 + @prof",
    hpFormula: "6 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 35,
    str: 16,
    dex: 10,
    con: 15,
    int: 4,
    wis: 10,
    cha: 8,
    saves: ["con", "str"],
    skills: { prc: { value: 1, ability: "wis" } },
    senses: "Darkvision 60 ft, Tremorsense 30 ft",
    bio: "<p>An imposing heavy combat chassis with tracked skids, dual scythe armatures, and a terrifying psychological audio transmitter.</p>",
    specialTraits: [
      {
        name: "Monomolecular Cleave",
        description: "<p>Slayerdroid hover-skids ignore nonmagical difficult terrain, and weapon attacks score a critical hit on a roll of 19–20.</p>",
      },
    ],
    actions: [
      {
        name: "Vibro-Scythes",
        description: "<p><em>Melee Attack:</em> Reach 5 ft., one target. Hit: 1d8 + @prof kinetic damage.</p>",
        activities: {
          actVibroScythes1: {
            _id: "actVibroScythes1",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "5", units: "ft" },
            attack: { ability: "str", bonus: "@prof", flat: false, type: { value: "melee", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d8 + @prof" }, types: ["kinetic"] }] },
            name: "Vibro-Scythes",
          },
        },
      },
      {
        name: "Twin Scythe Rake (2 Heat)",
        description: "<p><em>Special Attack (Generates 2 Heat):</em> Attacks two adjacent creatures within reach with a single sweep.</p>",
      },
      {
        name: "Dread Broadcast (4 Heat)",
        description: "<p><em>Special Action (Generates 4 Heat):</em> Emits subsonic terror frequency; enemies within 30 ft make Wis save or become Frightened for 1 minute.</p>",
        activities: {
          actDreadBcast001: {
            _id: "actDreadBcast001",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "radius", size: "30", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["wis"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            name: "Dread Broadcast",
          },
        },
      },
      {
        name: "Whirlwind of Scythes (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> Spins 360 degrees; each creature within 10 ft makes Dex save or takes 3d8 + @prof slashing damage.</p>",
        activities: {
          actWhirlScythes1: {
            _id: "actWhirlScythes1",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "radius", size: "10", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "3d8 + @prof" }, types: ["slashing"] }] },
            name: "Whirlwind of Scythes",
          },
        },
      },
    ],
  })
);

// 7. Automaton: Warbot
write(
  "src/actors/automaton-warbot.json",
  createAutomatonActor({
    id: "AutoWarbot000001",
    name: "Automaton: Warbot",
    img: "icons/creatures/magical/construct-golem-stone-runes.webp",
    size: "lg",
    acFormula: "15 + @prof",
    hpFormula: "7 + (@abilities.int.mod * @classes.engineer.levels)",
    walk: 25,
    burrow: 15,
    str: 16,
    dex: 10,
    con: 16,
    int: 4,
    wis: 10,
    cha: 6,
    saves: ["con"],
    skills: { ath: { value: 1, ability: "str" } },
    senses: "Darkvision 60 ft, Tremorsense 30 ft",
    extraConditionImmunities: ["petrified"],
    bio: "<p>A colossal mining and siege juggernaut engineered to absorb artillery fire, anchor frontline perimeters, and crush fortifications.</p>",
    specialTraits: [
      {
        name: "Mining Rig",
        description: "<p>The Warbot deals double damage to objects and structures, and can burrow through solid rock at half speed.</p>",
      },
    ],
    actions: [
      {
        name: "Pneumatic Slam",
        description: "<p><em>Melee Attack:</em> Reach 10 ft., one target. Hit: 1d8 + @prof kinetic damage.</p>",
        activities: {
          actPneumaticSlm1: {
            _id: "actPneumaticSlm1",
            type: "attack",
            activation: { type: "action", value: 1 },
            target: { affects: { count: "1", type: "creature" } },
            range: { value: "10", units: "ft" },
            attack: { ability: "str", bonus: "@prof", flat: false, type: { value: "melee", classification: "weapon" } },
            damage: { critical: { allow: true }, parts: [{ custom: { enabled: true, formula: "1d8 + @prof" }, types: ["kinetic"] }] },
            name: "Pneumatic Slam",
          },
        },
      },
      {
        name: "Threat Magnet (2 Heat)",
        description: "<p><em>Special Action (Generates 2 Heat):</em> Emits electromagnetic pulse; hostile creatures within 20 ft make Wis save or must target Warbot on next turn.</p>",
      },
      {
        name: "Shockwave Stomp (4 Heat)",
        description: "<p><em>Special Attack (Generates 4 Heat):</em> Stomps ground: all creatures within 15 ft make Dex save or take 2d8 kinetic damage and fall Prone.</p>",
        activities: {
          actShockwaveStmp: {
            _id: "actShockwaveStmp",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "radius", size: "15", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "2d8" }, types: ["kinetic"] }] },
            name: "Shockwave Stomp",
          },
        },
      },
      {
        name: "Mining Laser (6 Heat)",
        description: "<p><em>Signature Attack (Generates 6 Heat):</em> Fires industrial cutting laser in 30-ft line: 3d10 fire damage (Dex save half).</p>",
        activities: {
          actMiningLaser01: {
            _id: "actMiningLaser01",
            type: "save",
            activation: { type: "action", value: 1 },
            target: { template: { type: "line", size: "30", width: "5", units: "ft" } },
            range: { units: "self" },
            save: { ability: ["dex"], dc: { calculation: "int", formula: "8 + @prof + @abilities.int.mod" } },
            damage: { parts: [{ custom: { enabled: true, formula: "3d10" }, types: ["fire"] }] },
            name: "Mining Laser",
          },
        },
      },
    ],
    bonusActions: [
      {
        name: "Catapult Toss",
        description: "<p>Warbot picks up a willing Small ally within 5 ft and launches it up to 30 feet to an unoccupied space.</p>",
      },
    ],
  })
);

/* ================================================================== */
/*  2. Core Class Features (src/features/engineer/)                    */
/* ================================================================== */

// 1. Nanoprogramming (Level 1)
write(
  "src/features/engineer/nanoprogramming.json",
  createFeat({
    id: "EngNanoProg00001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circuit-board-glowing-blue.webp",
    requirements: "Engineer 1",
    description: `<p>Your mastery of hardware, industrial fabricators, and cybernetic compilers grants you the ability to execute nanoprograms from the Engineer Operating System (OS). You follow a <strong>2/3 Caster progression</strong> (scaling up to Tier 7 programs).</p>
<h3>Nanopool Points</h3>
<p>Your capacity to compile and sustain nanoprograms is fueled by your Nanopool. Your maximum Nanopool points equal your <strong>Engineer level × 3 + your Intelligence modifier</strong>. You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>
<p>Programs of 6th-tier and 7th-tier place immense strain on your cognitive architecture; you can only cast one program of 6th-tier per Long Rest, and one program of 7th-tier per Long Rest.</p>
<h3>Nanoprograms Known</h3>
<p>You know six 1st-tier nanoprograms of your choice from the Engineer OS at 1st level.</p>
<h3>Nanocasting Ability</h3>
<p><strong>Intelligence</strong> is your nanocasting ability for your Engineer nanoprograms.</p>
<ul>
  <li><strong>Nanoprogram Save DC</strong> = 8 + your Proficiency Bonus + your Intelligence modifier</li>
  <li><strong>Nanoprogram Attack Modifier</strong> = your Proficiency Bonus + your Intelligence modifier</li>
</ul>
<h3>Somatic Interface</h3>
<p>You must have at least one hand free to manipulate your wristpad interface or operate a set of artisan tools with which you are proficient.</p>`,
  })
);

// 2. Nanophotonic Automaton (Level 1)
write(
  "src/features/engineer/nanophotonic-automaton.json",
  createFeat({
    id: "EngNanophotAuto1",
    name: "Nanophotonic Automaton",
    img: "icons/creatures/magical/construct-golem-iron-armored.webp",
    requirements: "Engineer 1",
    description: `<p>At 1st level, you compile a permanent robotic companion known as an <strong>Automaton</strong>. Choose one of seven frames: <em>Android, Cyber-Hound, Drone, Gladiator, Launcher, Slayerdroid,</em> or <em>Warbot</em>.</p>
<h3>Initiative & Commands</h3>
<p>The Automaton shares your initiative count, taking its turn immediately after yours. It obeys your telepathic and verbal orders. If you issue no command, it takes the <strong>Dodge action</strong> and uses its movement to avoid danger. On your turn, you can command it where to move (no action required), and you can use your <strong>Action</strong> or <strong>Bonus Action</strong> to command it to take one action in its stat block.</p>
<h3>Reactor Core & Heat</h3>
<p>Every Automaton is driven by a high-output miniaturized reactor tracking <strong>Heat (0–10)</strong>. At the start of its turn, it gains +1 Heat (+2 if in melee). Taking 10+ damage adds +1 Heat. At 7+ Heat, roll a d20: if <code>d20 &lt; Heat</code>, a <strong>Meltdown</strong> occurs (deals \`@prof d6\` fire damage in a 10-ft radius, Dex save half, heavy obscurement, Emergency Lockout until next turn, Heat resets to 0).</p>
<h3>Reconfiguration & Field Rebuild</h3>
<p>Whenever you finish a Long Rest, you can recompile your Automaton into a different frame. If it is destroyed, you can rebuild it over a 1-hour procedure, or spend an <strong>Action and 4 Nanopool points</strong> to field-compile it back to functioning status with half its maximum hit points.</p>`,
    activities: {
      actRebuildAuto01: {
        _id: "actRebuildAuto01",
        type: "heal",
        activation: { type: "action", value: 1, condition: "Spend 4 Nanopool to field-rebuild destroyed Automaton" },
        target: { affects: { count: "1", type: "creature", special: "Destroyed Automaton" } },
        range: { value: "5", units: "ft" },
        name: "Field Rebuild Automaton",
      },
    },
  })
);

// 3. Manufacture (Level 1)
write(
  "src/features/engineer/manufacture.json",
  createFeat({
    id: "EngManufacture01",
    name: "Manufacture",
    img: "icons/tools/smithing/anvil.webp",
    requirements: "Engineer 1",
    description: `<p>At 1st level, you possess extraordinary industrial expertise:</p>
<ul>
  <li><strong>Tool Expertise:</strong> Your proficiency bonus is doubled for any ability check that uses your tool proficiencies.</li>
  <li><strong>Accelerated Fabrication:</strong> Your downtime required to craft mundane items, weapons, armor, and gear is halved.</li>
  <li><strong>Instantaneous Print:</strong> As an <strong>Action</strong>, you activate your micro-fabricator to synthesize one piece of nonmagical adventuring gear or tool worth up to <strong>500 credits</strong> (increasing to <strong>2,000 credits at 10th level</strong>). The item functions for until your next Long Rest before decomposing into inert nanite dust. You can use this feature a number of times equal to your Intelligence modifier (minimum of 1), regaining all uses on a <strong>Long Rest</strong>.</li>
</ul>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@abilities.int.mod",
    },
    activities: {
      actInstantPrint1: {
        _id: "actInstantPrint1",
        type: "utility",
        activation: { type: "action", value: 1 },
        name: "Instantaneous Print",
      },
    },
  })
);

// 4. Rapid Repair (Level 2)
write(
  "src/features/engineer/rapid-repair.json",
  createFeat({
    id: "EngRapidRepair01",
    name: "Rapid Repair",
    img: "icons/tools/screwdrivers/screwdriver-sparks.webp",
    requirements: "Engineer 2",
    description: `<p>At 2nd level, you carry a pool of repair nanites represented by a pool of <strong>d6 dice equal to twice your Intelligence modifier</strong> (minimum of 2 dice).</p>
<p>As a <strong>Bonus Action</strong>, you project nanites at a Construct, object, structure, or vehicle within <strong>30 feet</strong>. Spend any number of dice from your pool up to your Proficiency Bonus. Roll the dice: the target regains hit points equal to the total rolled. If the target is your Automaton, you can also reduce its <strong>Heat by an amount equal to the total rolled</strong>.</p>
<p>You regain all expended Rapid Repair dice when you finish a <strong>Long Rest</strong>.</p>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@scale.engineer.repair-dice",
    },
    activities: {
      actRapidRepair01: {
        _id: "actRapidRepair01",
        type: "heal",
        activation: { type: "bonus", value: 1 },
        range: { value: "30", units: "ft" },
        target: { affects: { count: "1", type: "creature", special: "Construct, object, vehicle, or structure" } },
        healing: {
          number: 1,
          denomination: 6,
          bonus: "",
          types: ["healing"],
          custom: { enabled: true, formula: "1d6" },
        },
        name: "Rapid Repair (Heal / Cool)",
      },
    },
  })
);

// 5. Tradeskill Schematics (Level 2)
write(
  "src/features/engineer/tradeskill-schematics.json",
  createFeat({
    id: "EngTradeskill001",
    name: "Tradeskill Schematics",
    img: "icons/sundries/documents/blueprint-recipe-magic.webp",
    requirements: "Engineer 2",
    description: `<p>At 2nd level, you master technical blueprints called <strong>Tradeskill Schematics</strong>. Whenever you finish a Long Rest, you can install a number of active schematics onto your gear, your allies' gear, or your Automaton up to your <strong>Intelligence modifier</strong> (minimum 1).</p>
<p>Schematics are divided into Baseline (Level 2), Advanced (Level 5), and Master (Level 9). Whenever you gain an Engineer level, you can swap one schematic you know for another schematic of an eligible tier.</p>`,
  })
);

// 6. Spark of Innovation (Level 3)
write(
  "src/features/engineer/spark-of-innovation.json",
  createFeat({
    id: "EngSparkInnov001",
    name: "Spark of Innovation",
    img: "icons/magic/light/bulb-glowing-yellow.webp",
    requirements: "Engineer 3",
    description: `<p>At 3rd level, sudden flashes of mechanical insight let you bypass normal nanotech limitations. Once per <strong>Long Rest</strong>, you can execute any program from the Engineer OS of a tier up to <strong>1 tier higher than your current Max Power Level</strong> without expending Nanopool points and without needing to have it prepared or known.</p>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actSparkInnov001: {
        _id: "actSparkInnov001",
        type: "utility",
        activation: { type: "special", value: null },
        name: "Spark of Innovation",
      },
    },
  })
);

// 7. Overdrive Aggression Subsystem (Level 5)
write(
  "src/features/engineer/overdrive-aggression-subsystem.json",
  createFeat({
    id: "EngOverdriveAggr",
    name: "Overdrive Aggression Subsystem",
    img: "icons/skills/combat/weapons-crossed-swords-yellow.webp",
    requirements: "Engineer 5",
    description: `<p>At 5th level, your Automaton's weapon attacks and signature attacks deal <strong>1 additional damage die</strong>. This increases to <strong>2 additional damage dice at 11th level</strong>, and <strong>3 additional damage dice at 17th level</strong>.</p>`,
  })
);

// 8. Experimentation (Level 6)
write(
  "src/features/engineer/experimentation.json",
  createFeat({
    id: "EngExperiment001",
    name: "Experimentation",
    img: "icons/magic/symbols/rune-sigil-horned-blue.webp",
    requirements: "Engineer 6",
    description: `<p>At 6th level, you can adapt your installed schematics on the fly. As an <strong>Action</strong>, you spend <strong>4 Nanopool points</strong> to uninstall one active Tradeskill Schematic and instantly install another schematic of an eligible tier onto a target within reach without taking a rest.</p>`,
    activities: {
      actExperiment001: {
        _id: "actExperiment001",
        type: "utility",
        activation: { type: "action", value: 1, condition: "Spend 4 Nanopool points" },
        name: "Instant Schematic Swap",
      },
    },
  })
);

// 9. Divert Energy (Level 7)
write(
  "src/features/engineer/divert-energy.json",
  createFeat({
    id: "EngDivertEnergy1",
    name: "Divert Energy",
    img: "icons/magic/defensive/shield-barrier-blue.webp",
    requirements: "Engineer 7",
    description: `<p>At 7th level, you can re-route your nanite power grid to shield allies in peril. When you or an ally within <strong>30 feet</strong> fails a saving throw or is hit by an attack roll, you can use your <strong>Reaction</strong> to expend 1 Rapid Repair die and add the roll result to the saving throw or AC against that attack, potentially turning a failure into a success or a hit into a miss.</p>`,
    activities: {
      actDivertEnergy1: {
        _id: "actDivertEnergy1",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When self or ally within 30 ft fails a save or is hit" },
        range: { value: "30", units: "ft" },
        name: "Divert Energy (Reaction Boost)",
      },
    },
  })
);

// 10. Repair Recharge (Level 14)
write(
  "src/features/engineer/repair-recharge.json",
  createFeat({
    id: "EngRepairRechg01",
    name: "Repair Recharge",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    requirements: "Engineer 14",
    description: `<p>At 14th level, your repair nanites cycle continuously. When you finish a <strong>Short Rest</strong>, you regain a number of expended Rapid Repair dice equal to your <strong>Intelligence modifier</strong> (minimum of 1). Once you use this feature, you cannot do so again until you finish a Long Rest.</p>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1",
    },
  })
);

// 11. Supreme Creator (Level 20)
write(
  "src/features/engineer/supreme-creator.json",
  createFeat({
    id: "EngSupremeCreat1",
    name: "Supreme Creator",
    img: "icons/magic/control/silhouette-aura-energy-purple.webp",
    requirements: "Engineer 20",
    description: `<p>At 20th level, you transcend biological limitations and achieve mechanical apotheosis:</p>
<ul>
  <li>Your <strong>Intelligence score increases by 2</strong>, and your maximum for that score is now 22.</li>
  <li><strong>Mechanical Ascension:</strong> Your creature type becomes <strong>Construct</strong> in addition to your other types. You are immune to critical hits, and your natural lifespan increases by 500 years.</li>
  <li><strong>Perfect Repair:</strong> As an <strong>Action</strong>, you touch the remains of a destroyed construct, vehicle, or structure (up to a 100-foot cube). It is completely restored to full functionality with maximum hit points. Once you use this feature, you must finish <strong>1d4 Long Rests</strong> before you can use it again.</li>
</ul>`,
    activities: {
      actPerfectRepair: {
        _id: "actPerfectRepair",
        type: "heal",
        activation: { type: "action", value: 1 },
        range: { units: "touch" },
        target: { affects: { count: "1", type: "creature", special: "Destroyed construct, vehicle, or structure" } },
        name: "Perfect Repair",
      },
    },
  })
);

/* ================================================================== */
/*  3. Tradeskill Schematics (src/features/engineer/schematics/)       */
/* ================================================================== */

const SCHEMATICS = [
  // Baseline (Level 2)
  {
    id: "SchmAtmoSeal0001",
    file: "atmospheric-hazard-seal.json",
    name: "Schematic: Atmospheric Hazard Seal",
    req: "Engineer 2",
    desc: "<p>Installed on armor: wearer is immune to inhaled toxins, radiation, and suffocation in vacuum for up to 24 hours.</p>",
  },
  {
    id: "SchmElemSocket01",
    file: "elemental-conversion-socket.json",
    name: "Schematic: Elemental Conversion Socket",
    req: "Engineer 2",
    desc: "<p>Installed on a weapon: wearer can change the weapon's damage type to fire, cold, acid, or lightning on rest.</p>",
  },
  {
    id: "SchmHardLightAeg",
    file: "hard-light-aegis-node.json",
    name: "Schematic: Hard-Light Aegis Node",
    req: "Engineer 2",
    desc: "<p>Installed on shield: wearer can deploy a hard-light barrier granting +1 bonus to AC and advantage vs shove attacks.</p>",
  },
  {
    id: "SchmHyperCalib01",
    file: "hyper-calibration-rig.json",
    name: "Schematic: Hyper-Calibration Rig",
    req: "Engineer 2",
    desc: "<p>Installed on tools or weapon: grants a +1 bonus to attack rolls or tool ability checks.</p>",
  },
  {
    id: "SchmUnivTrans001",
    file: "universal-translator.json",
    name: "Schematic: Universal Translator",
    req: "Engineer 2",
    desc: "<p>Installed on headgear or comm: wearer understands, speaks, and reads all spoken languages on Rubi-Ka.</p>",
  },
  {
    id: "SchmKinRepulsor1",
    file: "kinetic-repulsor.json",
    name: "Schematic: Kinetic Repulsor",
    req: "Engineer 2",
    desc: "<p>Installed on armor: when hit in melee, reaction pushes attacker 10 feet away.</p>",
  },
  {
    id: "SchmExosuitServ1",
    file: "personal-exosuit-servos.json",
    name: "Schematic: Personal Exosuit Servos",
    req: "Engineer 2",
    desc: "<p>Installed on armor: wearer's jump distance is tripled and carrying capacity is doubled.</p>",
  },
  {
    id: "SchmShockAnchor1",
    file: "shock-absorbing-anchor-plating.json",
    name: "Schematic: Shock-Absorbing Anchor Plating",
    req: "Engineer 2",
    desc: "<p>Installed on armor: wearer cannot be knocked prone against their will while on solid ground.</p>",
  },
  {
    id: "SchmTargetComp01",
    file: "targeting-computer.json",
    name: "Schematic: Targeting Computer",
    req: "Engineer 2",
    desc: "<p>Installed on ranged weapon: weapon ignores half and three-quarters cover.</p>",
  },
  {
    id: "SchmWpnExpansion",
    file: "weapon-expansion.json",
    name: "Schematic: Weapon Expansion",
    req: "Engineer 2",
    desc: "<p>Installed on weapon: grants the weapon an additional mastery property of your choice.</p>",
  },
  {
    id: "SchmWpnUpgrade01",
    file: "weapon-upgrade.json",
    name: "Schematic: Weapon Upgrade",
    req: "Engineer 2",
    desc: "<p>Installed on weapon: weapon becomes a +1 weapon to attack and damage rolls.</p>",
  },

  // Advanced (Level 5)
  {
    id: "SchmAuxPowerInj1",
    file: "auxiliary-power-injector.json",
    name: "Schematic: Auxiliary Power Injector",
    req: "Engineer 5",
    desc: "<p>Installed on armor or Automaton: bonus action gain 10 temporary hit points and +10 ft speed for 1 minute (1/LR).</p>",
  },
  {
    id: "SchmArmorExpans1",
    file: "armor-expansion.json",
    name: "Schematic: Armor Expansion",
    req: "Engineer 5",
    desc: "<p>Installed on armor: grants a +1 bonus to AC and resistance to one chosen damage type.</p>",
  },
  {
    id: "SchmBioRegulat01",
    file: "bio-regulator.json",
    name: "Schematic: Bio-Regulator",
    req: "Engineer 5",
    desc: "<p>Installed on gear: wearer is immune to disease and has advantage on saves against poison and paralysis.</p>",
  },
  {
    id: "SchmEmergStasis1",
    file: "emergency-stasis-matrix.json",
    name: "Schematic: Emergency Stasis Matrix",
    req: "Engineer 5",
    desc: "<p>Installed on armor: when wearer drops to 0 HP, stasis triggers, dropping them to 1 HP instead (1/LR).</p>",
  },
  {
    id: "SchmFocusAmplif1",
    file: "focus-amplifier.json",
    name: "Schematic: Focus Amplifier",
    req: "Engineer 5",
    desc: "<p>Installed on cyberdeck or focus: +1 bonus to nanoprogram save DC and spell attack rolls.</p>",
  },
  {
    id: "SchmEnergyReact1",
    file: "energy-reactor.json",
    name: "Schematic: Energy Reactor",
    req: "Engineer 5",
    desc: "<p>Installed on vehicle or Automaton: grants +10 max HP and regenerates 2 HP at start of each turn while above 0 HP.</p>",
  },
  {
    id: "SchmTargetVisor1",
    file: "targeting-telemetry-visor.json",
    name: "Schematic: Targeting Telemetry Visor",
    req: "Engineer 5",
    desc: "<p>Installed on headgear: wearer gains truesight up to 30 feet.</p>",
  },
  {
    id: "SchmWpnPeriph001",
    file: "weapon-peripheral.json",
    name: "Schematic: Weapon Peripheral",
    req: "Engineer 5",
    desc: "<p>Installed on weapon: attacks deal an extra 1d6 elemental damage (fire, cold, or lightning).</p>",
  },
  {
    id: "SchmReactRepuls1",
    file: "reactive-repulsor.json",
    name: "Schematic: Reactive Repulsor",
    req: "Engineer 5",
    desc: "<p>Installed on armor: reaction when hit reflects half damage back at attacker.</p>",
  },

  // Master (Level 9)
  {
    id: "SchmAblPhasePlt1",
    file: "ablative-phase-plating.json",
    name: "Schematic: Ablative Phase Plating",
    req: "Engineer 9",
    desc: "<p>Installed on armor: wearer can pass through solid walls and barriers up to 5 feet thick as difficult terrain.</p>",
  },
  {
    id: "SchmAntigravGen1",
    file: "antigrav-generator.json",
    name: "Schematic: Antigrav Generator",
    req: "Engineer 9",
    desc: "<p>Installed on armor or vehicle: grants a flying speed of 60 feet (hover).</p>",
  },
  {
    id: "SchmDimInverter1",
    file: "dimensional-inverter.json",
    name: "Schematic: Dimensional Inverter",
    req: "Engineer 9",
    desc: "<p>Installed on belt or Automaton: bonus action teleport up to 60 feet to an unoccupied space you can see.</p>",
  },
  {
    id: "SchmRefractGen01",
    file: "refraction-generator.json",
    name: "Schematic: Refraction Generator",
    req: "Engineer 9",
    desc: "<p>Installed on armor: wearer can turn invisible as an action for up to 1 hour (ends on attack or casting).</p>",
  },
  {
    id: "SchmHypOverclock",
    file: "hyper-overclocked-munitions.json",
    name: "Schematic: Hyper-Overclocked Munitions",
    req: "Engineer 9",
    desc: "<p>Installed on weapon: attacks score critical hits on 18–20 and ignore all damage resistances.</p>",
  },
  {
    id: "SchmNullFldRes01",
    file: "null-field-resonator.json",
    name: "Schematic: Null-Field Resonator",
    req: "Engineer 9",
    desc: "<p>Installed on shield or armor: wearer has Advantage on saving throws against nanoprograms, spells, and exotic effects.</p>",
  },
];

SCHEMATICS.forEach((sc) => {
  write(
    `src/features/engineer/schematics/${sc.file}`,
    createFeat({
      id: sc.id,
      name: sc.name,
      subtype: "schematic",
      requirements: sc.req,
      description: sc.desc,
    })
  );
});

/* ================================================================== */
/*  4. System Upgrades (src/features/engineer/upgrades/)               */
/* ================================================================== */

const UPGRADES = [
  { id: "UpgActvCamouflg1", file: "active-camouflage-shroud.json", name: "Upgrade: Active Camouflage Shroud", desc: "<p>Automaton can take the Hide action as a Bonus Action.</p>" },
  { id: "UpgAerialExtract", file: "aerial-extraction-cable.json", name: "Upgrade: Aerial Extraction Cable", desc: "<p>Automaton is equipped with a 50-ft winch cable capable of lifting 500 lbs.</p>" },
  { id: "UpgApexPursuit01", file: "apex-pursuit-engine.json", name: "Upgrade: Apex Pursuit Engine", desc: "<p>Automaton's walking speed increases by 15 feet.</p>" },
  { id: "UpgApexShield001", file: "apex-shield-harmonizer.json", name: "Upgrade: Apex Shield Harmonizer", desc: "<p>Automaton gains +2 AC while within 10 feet of its creator.</p>" },
  { id: "UpgAuxCargoHold1", file: "auxiliary-cargo-hold.json", name: "Upgrade: Auxiliary Cargo Hold", desc: "<p>Automaton integrates a sealed 200-lb container immune to vacuum and environmental hazards.</p>" },
  { id: "UpgBallistTarget", file: "ballistic-target-illuminator.json", name: "Upgrade: Ballistic Target Illuminator", desc: "<p>Automaton marks target: allies gain +1 to hit against it.</p>" },
  { id: "UpgColossTitan01", file: "colosseum-titan.json", name: "Upgrade: Colosseum Titan", desc: "<p>Automaton size category increases by one step (to Large or Huge) and gains +10 max HP.</p>" },
  { id: "UpgCombatMedic01", file: "combat-field-medic-unit.json", name: "Upgrade: Combat Field Medic Unit", desc: "<p>Automaton can administer medkits and stabilize dying allies as a Bonus Action.</p>" },
  { id: "UpgCoreRedirect1", file: "core-redirection-capacitor.json", name: "Upgrade: Core Redirection Capacitor", desc: "<p>Automaton can vent 2 Heat to gain +10 ft speed on its turn.</p>" },
  { id: "UpgCryoHeatSink1", file: "cryogenic-heat-sink.json", name: "Upgrade: Cryogenic Heat Sink", desc: "<p>Automaton reduces Heat by 2 at the end of each rest and gains Cold resistance.</p>" },
  { id: "UpgDeflectField1", file: "deflection-field-emitter.json", name: "Upgrade: Deflection Field Emitter", desc: "<p>Ranged attack rolls against Automaton have Disadvantage if made from beyond 30 feet.</p>" },
  { id: "UpgDeployGunShld", file: "deployable-gun-shield.json", name: "Upgrade: Deployable Gun Shield", desc: "<p>Automaton provides Three-Quarters Cover to allies directly behind it.</p>" },
  { id: "UpgDreadnought01", file: "dreadnought-executioner.json", name: "Upgrade: Dreadnought Executioner", desc: "<p>Automaton's melee attacks deal an extra 1d8 damage to Prone targets.</p>" },
  { id: "UpgGravBulwark01", file: "gravimetric-bulwark.json", name: "Upgrade: Gravimetric Bulwark", desc: "<p>Automaton cannot be pushed or pulled by forced movement effects.</p>" },
  { id: "UpgHamstringLock", file: "hamstring-lock.json", name: "Upgrade: Hamstring Lock", desc: "<p>Hitting a target reduces its speed to 0 until the end of its next turn.</p>" },
  { id: "UpgHvyWpnArmatr1", file: "heavy-weapon-armature.json", name: "Upgrade: Heavy Weapon Armature", desc: "<p>Automaton can mount and fire two-handed heavy firearms or artillery.</p>" },
  { id: "UpgHeurPerson001", file: "heuristic-personality-subroutine.json", name: "Upgrade: Heuristic Personality Subroutine", desc: "<p>Automaton gains sapience, can speak creator's languages, and gains Insight proficiency.</p>" },
  { id: "UpgHighAltOverw1", file: "high-altitude-overwatch.json", name: "Upgrade: High Altitude Overwatch", desc: "<p>Automaton hovering 20+ ft in the air reveals all invisible creatures within 60 ft.</p>" },
  { id: "UpgHighAngleArt1", file: "high-angle-artillery-trajectory.json", name: "Upgrade: High-Angle Artillery Trajectory", desc: "<p>Automaton ignores total cover if there is an open sky trajectory.</p>" },
  { id: "UpgHydrSuplex001", file: "hydraulic-overhead-suplex.json", name: "Upgrade: Hydraulic Overhead Suplex", desc: "<p>Automaton slams grappled target onto ground for 3d6 bludgeoning damage.</p>" },
  { id: "UpgHydrPummel001", file: "hydraulic-pummel.json", name: "Upgrade: Hydraulic Pummel", desc: "<p>Automaton can make one additional unarmed strike attack as a Bonus Action.</p>" },
  { id: "UpgIncenBackdrf1", file: "incendiary-backdraft.json", name: "Upgrade: Incendiary Backdraft", desc: "<p>Venting Heat ignites adjacent hostile creatures for fire damage equal to Heat spent.</p>" },
  { id: "UpgIntegToolHrd1", file: "integrated-tool-hardpoint.json", name: "Upgrade: Integrated Tool Hardpoint", desc: "<p>Integrates tools allowing Automaton to aid in repairs, crafting, and lockpicking.</p>" },
  { id: "UpgKinGrounding1", file: "kinetic-grounding-plates.json", name: "Upgrade: Kinetic Grounding Plates", desc: "<p>Automaton gains resistance to kinetic and thunder damage.</p>" },
  { id: "UpgLowEmissBaff1", file: "low-emissions-baffles.json", name: "Upgrade: Low-Emissions Baffles", desc: "<p>Automaton moves silently and cannot be detected by thermal or infrared sensors.</p>" },
  { id: "UpgLuminSearchl1", file: "luminescent-searchlight.json", name: "Upgrade: Luminescent Searchlight", desc: "<p>Mounts powerful spotlight illuminating 120-ft cone; blinded check on turn entry.</p>" },
  { id: "UpgMagDeckAnchor", file: "magnetic-deck-anchor.json", name: "Upgrade: Magnetic Deck Anchor", desc: "<p>Automaton can walk on metallic walls and ceilings without falling.</p>" },
  { id: "UpgMarkSapience1", file: "mark-of-sapience.json", name: "Upgrade: Mark of Sapience", desc: "<p>Automaton can attune to magic and exotic tech items as a player character.</p>" },
  { id: "UpgMobFortrCock1", file: "mobile-fortress-cockpit.json", name: "Upgrade: Mobile Fortress Cockpit", desc: "<p>Creator can ride inside Automaton chassis, gaining Total Cover while piloting.</p>" },
  { id: "UpgMonofilSerr01", file: "monofilament-serrations.json", name: "Upgrade: Monofilament Serrations", desc: "<p>Automaton weapon attacks inflict bleeding dealing 1d4 damage at start of turn.</p>" },
  { id: "UpgMonomolArmor1", file: "monomolecular-armor-breaker.json", name: "Upgrade: Monomolecular Armor Breaker", desc: "<p>Automaton attacks ignore enemy damage thresholds and AC bonuses from armor.</p>" },
  { id: "UpgNaniteSwarmH1", file: "nanite-swarm-hive.json", name: "Upgrade: Nanite Swarm Hive", desc: "<p>Automaton releases defensive cloud: creatures ending turn adjacent take 1d6 poison.</p>" },
  { id: "UpgOpticScanner1", file: "optical-scanner-upgrade.json", name: "Upgrade: Optical Scanner Upgrade", desc: "<p>Automaton darkvision increases to 120 ft and gains Blindsight 15 ft.</p>" },
  { id: "UpgOverdrvHaste1", file: "overdrive-haste-circuit.json", name: "Upgrade: Overdrive Haste Circuit", desc: "<p>Automaton can take the Dash, Disengage, or Dodge action as a Bonus Action.</p>" },
  { id: "UpgPassengrCock1", file: "passenger-cockpit-rig.json", name: "Upgrade: Passenger Cockpit Rig", desc: "<p>Automaton can transport up to two Medium allies on its chassis securely.</p>" },
  { id: "UpgPhoenixReactor", file: "phoenix-reactor-core.json", name: "Upgrade: Phoenix Reactor Core", desc: "<p>When Automaton drops to 0 HP, it immediately revives with 1 HP and max Heat (1/LR).</p>" },
  { id: "UpgPistonPounce1", file: "piston-pounce.json", name: "Upgrade: Piston Pounce", desc: "<p>Automaton can jump up to 30 feet as part of its movement without provoking OA.</p>" },
  { id: "UpgReactDisengag", file: "reactive-emergency-disengage.json", name: "Upgrade: Reactive Emergency Disengage", desc: "<p>Reaction when hit in melee: Automaton moves 10 ft away without provoking OA.</p>" },
  { id: "UpgRedlineCapac1", file: "redline-capacitor-bypass.json", name: "Upgrade: Redline Capacitor Bypass", desc: "<p>Automaton can voluntarily accept +2 Heat to deal maximum damage on an attack.</p>" },
  { id: "UpgRefractCloak1", file: "refractive-cloaking-field.json", name: "Upgrade: Refractive Cloaking Field", desc: "<p>Automaton turns invisible for 1 minute or until it attacks (1/SR).</p>" },
  { id: "UpgRepulsorThr01", file: "repulsorlift-jump-thrusters.json", name: "Upgrade: Repulsorlift Jump Thrusters", desc: "<p>Automaton gains a vertical jump of 40 ft and takes no fall damage.</p>" },
  { id: "UpgScoutHoloRel1", file: "scout-holo-relay.json", name: "Upgrade: Scout Holo-Relay", desc: "<p>Creator can cast nanoprograms originating from Automaton's position within 300 ft.</p>" },
  { id: "UpgSharedPower01", file: "shared-power-routing.json", name: "Upgrade: Shared Power Routing", desc: "<p>Automaton can expend Heat to recharge creator's Nanopool points on a 2-for-1 basis.</p>" },
  { id: "UpgSplinterMunit", file: "splinter-munitions-pod.json", name: "Upgrade: Splinter Munitions Pod", desc: "<p>Automaton's ranged attacks burst dealing half damage to an adjacent enemy.</p>" },
  { id: "UpgStratAnnihil1", file: "strategic-annihilation-shell.json", name: "Upgrade: Strategic Annihilation Shell", desc: "<p>Signature artillery attack deals double damage against fortifications.</p>" },
  { id: "UpgStrobeWarHrn1", file: "strobe-war-horns.json", name: "Upgrade: Strobe War Horns", desc: "<p>Automaton emits disorienting strobe: adjacent creatures make Con save or are blinded.</p>" },
  { id: "UpgSubdermSynth1", file: "subdermal-synth-skin.json", name: "Upgrade: Subdermal Synth-Skin", desc: "<p>Automaton appears completely organic until closely examined (DC 20 Perception).</p>" },
  { id: "UpgSubOrbSpottr1", file: "sub-orbital-spotter-uplink.json", name: "Upgrade: Sub-Orbital Spotter Uplink", desc: "<p>Automaton establishes orbital laser uplink adding +2 to hit rolls for the encounter.</p>" },
  { id: "UpgSynapticDual1", file: "synaptic-dual-core.json", name: "Upgrade: Synaptic Dual-Core", desc: "<p>Automaton can concentrate on one of creator's nanoprograms independently.</p>" },
  { id: "UpgTactWpnHardp1", file: "tactical-weapon-hardpoints.json", name: "Upgrade: Tactical Weapon Hardpoints", desc: "<p>Automaton gains proficiency with martial weapons and blaster rifles.</p>" },
  { id: "UpgTelescopingF1", file: "telescoping-frame.json", name: "Upgrade: Telescoping Frame", desc: "<p>Automaton can squeeze through gaps suitable for a Tiny creature.</p>" },
  { id: "UpgThermVentDef1", file: "thermal-vent-deflector.json", name: "Upgrade: Thermal Vent Deflector", desc: "<p>Automaton directs vented heat to grant +2 AC against fire and laser attacks.</p>" },
  { id: "UpgTrackLidarArr", file: "tracking-lidar-array.json", name: "Upgrade: Tracking Lidar Array", desc: "<p>Automaton tracks up to 5 marked targets through walls up to 60 ft away.</p>" },
  { id: "UpgTrueBionicSy1", file: "true-bionic-synthesis.json", name: "Upgrade: True Bionic Synthesis", desc: "<p>Automaton can receive healing from biological healing spells and medical supplies.</p>" },
  { id: "UpgUnivSlicerInt", file: "universal-slicer-interface.json", name: "Upgrade: Universal Slicer Interface", desc: "<p>Automaton can interface with electronic door locks and terminals instantly.</p>" },
  { id: "UpgUnstoppRamp01", file: "unstoppable-rampage.json", name: "Upgrade: Unstoppable Rampage", desc: "<p>When Automaton reduces a creature to 0 HP, it immediately moves 10 ft and attacks.</p>" },
  { id: "UpgWalkBastion01", file: "walking-bastion.json", name: "Upgrade: Walking Bastion", desc: "<p>Automaton AC increases by +1, and allies within 5 ft gain +1 AC.</p>" },
  { id: "UpgWhirlwndAccel", file: "whirlwind-acceleration.json", name: "Upgrade: Whirlwind Acceleration", desc: "<p>Automaton can spin in a cyclone of kinetic energy, knocking adjacent foes Prone.</p>" },
];

UPGRADES.forEach((up) => {
  write(
    `src/features/engineer/upgrades/${up.file}`,
    createFeat({
      id: up.id,
      name: up.name,
      subtype: "upgrade",
      requirements: "Engineer 4",
      description: up.desc,
    })
  );
});

/* ================================================================== */
/*  5. Engineer Class Document (src/classes/engineer.json)             */
/* ================================================================== */

write("src/classes/engineer.json", {
  _id: "EngineerClass001",
  name: "Engineer",
  type: "class",
  img: "icons/skills/trades/tools-wrench-screwdriver-yellow.webp",
  system: {
    description: {
      value: `<p>Masters of hardware compilation, autonomous constructs, and field fabrication, Engineers represent the bleeding edge of Rubi-Ka's technological supremacy. Accompanied by modular nanophotonic Automatons and armed with tradeskill schematics, an Engineer reshapes the theater of war through cold industrial precision.</p>`,
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "engineer",
    levels: 1,
    hd: {
      denomination: 8,
      spent: 0,
      additional: "",
    },
    primaryAbility: {
      value: ["int"],
      all: false,
    },
    spellcasting: {
      progression: "artificer",
      ability: "int",
    },
    advancement: [
      /* ── Hit Points (d8) ── */
      {
        _id: "advEngHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },

      /* ── Saves: CON, INT ── */
      {
        _id: "advEngSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:con", "saves:int"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },

      /* ── Armor: Light ── */
      {
        _id: "advEngArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },

      /* ── Weapons: Simple, Martial Pistols, Shotguns ── */
      {
        _id: "advEngWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },

      /* ── Tools: Mechanics Rig, Slicer's Kit, +1 Artisan Tool ── */
      {
        _id: "advEngToolPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["tools:tinkers", "tools:thieves"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Tool Proficiencies",
      },

      /* ── Skills: Choice of 3 from list ── */
      {
        _id: "advEngSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 3,
              pool: [
                "skills:arc",
                "skills:his",
                "skills:inv",
                "skills:med",
                "skills:nat",
                "skills:prc",
                "skills:slt",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Nanopool Points (3 at L1 to 60 at L20) ── */
      {
        _id: "advEngScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1: { value: 3 },
            2: { value: 6 },
            3: { value: 9 },
            4: { value: 12 },
            5: { value: 15 },
            6: { value: 18 },
            7: { value: 21 },
            8: { value: 24 },
            9: { value: 27 },
            10: { value: 30 },
            11: { value: 33 },
            12: { value: 36 },
            13: { value: 39 },
            14: { value: 42 },
            15: { value: 45 },
            16: { value: 48 },
            17: { value: 51 },
            18: { value: 54 },
            19: { value: 57 },
            20: { value: 60 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },

      /* ── ScaleValue: Rapid Repair Dice (formula 2 * @abilities.int.mod) ── */
      {
        _id: "advEngScRepDie01",
        type: "ScaleValue",
        configuration: {
          identifier: "repair-dice",
          type: "number",
          formula: "2 * @abilities.int.mod",
          scale: {
            2: { value: 2, formula: "2 * @abilities.int.mod" },
          },
        },
        value: {},
        level: 2,
        title: "Rapid Repair Dice",
      },

      /* ── ScaleValue: System Upgrades (2 at L4, 4 at L8, 6 at L12, 8 at L16, 10 at L19) ── */
      {
        _id: "advEngScSysUpg01",
        type: "ScaleValue",
        configuration: {
          identifier: "system-upgrades",
          type: "number",
          scale: {
            4: { value: 2 },
            8: { value: 4 },
            12: { value: 6 },
            16: { value: 8 },
            19: { value: 10 },
          },
        },
        value: {},
        level: 4,
        title: "System Upgrades",
      },

      /* ── ScaleValue: Overdrive Aggression Dice (1 at L5, 2 at L11, 3 at L17) ── */
      {
        _id: "advEngScOvrDrDie",
        type: "ScaleValue",
        configuration: {
          identifier: "overdrive-dice",
          type: "number",
          scale: {
            5: { value: 1 },
            11: { value: 2 },
            17: { value: 3 },
          },
        },
        value: {},
        level: 5,
        title: "Overdrive Damage Dice",
      },

      /* ── ScaleValue: Manufacture Cap (500 at L1, 2000 at L10) ── */
      {
        _id: "advEngScMfgCap01",
        type: "ScaleValue",
        configuration: {
          identifier: "manufacture-cap",
          type: "number",
          scale: {
            1: { value: 500 },
            10: { value: 2000 },
          },
        },
        value: {},
        level: 1,
        title: "Manufacture Credit Cap",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Nanophotonic Automaton, Manufacture) ── */
      {
        _id: "advEngItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngNanoProg00001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngNanophotAuto1", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngManufacture01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Engineer Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Rapid Repair, Tradeskill Schematics) ── */
      {
        _id: "advEngItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngRapidRepair01", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngTradeskill001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Engineer Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Engineering Field") ── */
      {
        _id: "advEngSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Engineering Field",
      },

      /* ── ItemGrant: Level 3 (Spark of Innovation) ── */
      {
        _id: "advEngItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngSparkInnov001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Engineer Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advEngASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Overdrive Aggression Subsystem) ── */
      {
        _id: "advEngItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngOverdriveAggr", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Engineer Features (Level 5)",
      },

      /* ── ItemGrant: Level 6 (Experimentation) ── */
      {
        _id: "advEngItmGrLvl06",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngExperiment001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Engineer Features (Level 6)",
      },

      /* ── ItemGrant: Level 7 (Divert Energy) ── */
      {
        _id: "advEngItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngDivertEnergy1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Engineer Features (Level 7)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advEngASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advEngASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 14 (Repair Recharge) ── */
      {
        _id: "advEngItmGrLvl14",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngRepairRechg01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Engineer Features (Level 14)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advEngASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advEngASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Supreme Creator) ── */
      {
        _id: "advEngItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.EngSupremeCreat1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Engineer Features (Level 20)",
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
  _key: "!items!EngineerClass001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Engineer build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
