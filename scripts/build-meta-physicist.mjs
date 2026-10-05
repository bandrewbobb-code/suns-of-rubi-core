#!/usr/bin/env node
/**
 * build-meta-physicist.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Meta-Physicist class package:
 *   • src/actors/manifestation-node.json        – Manifestation Companion Actor
 *   • src/features/meta-physicist/              – 10 Core Class Features
 *   • src/features/meta-physicist/attunements/  – 3 Paracausal Attunements
 *   • src/features/meta-physicist/theories/     – 33 Metaphysical Theories
 *   • src/classes/meta-physicist.json           – Meta-Physicist Class Document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - Unique 16-character alphanumeric _id at root and in _key
 *   - Modern Foundry v12/v14 system.activities architecture
 *   - Compendium UUID references
 *   - depth: 1 in prototypeToken for Foundry v14 canvas validation
 *   - compound _key for actor embedded items: !actors.items!<actorId>.<itemId>
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

  if (obj._key && !obj._id) {
    const suffix = obj._key.split("!").pop();
    const dotIdx = suffix.lastIndexOf(".");
    obj._id = dotIdx >= 0 ? suffix.slice(dotIdx + 1) : suffix;
  }

  if (obj._id && !obj._key) {
    obj._key = obj.type === "npc" || obj.type === "character" ? `!actors!${obj._id}` : `!items!${obj._id}`;
  }

  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath} [${obj._id}]`);
}

/** Standard feat scaffold for Meta-Physicist features, attunements, and theories */
function createFeat({
  id,
  name,
  img = "icons/magic/symbols/runes-carved-stone-purple.webp",
  description,
  subtype = "",
  requirements = "Meta-Physicist 1",
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

/* ------------------------------------------------------------------ */
/*  1. Companion Actor: Manifestation Node                            */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Manifestation Companion Actor ---");

const ACTOR_ID = "MetaManifestNode";

const manifestationActor = {
  _id: ACTOR_ID,
  name: "Manifestation Node",
  type: "npc",
  img: "icons/magic/light/orb-lightbulb-gray.webp",
  system: {
    abilities: {
      str: { value: 14, proficient: 0 },
      dex: { value: 14, proficient: 0 },
      con: { value: 14, proficient: 0 },
      int: { value: 10, proficient: 0 },
      wis: { value: 10, proficient: 0 },
      cha: { value: 10, proficient: 0 },
    },
    attributes: {
      ac: {
        flat: null,
        calc: "custom",
        formula: "10 + @prof + @abilities.wis.mod",
      },
      hp: {
        value: 15,
        max: 15,
        formula: "10 + (5 * @classes.meta-physicist.levels)",
      },
      movement: {
        walk: 0,
        fly: 30,
        burrow: 0,
        climb: 0,
        swim: 0,
        units: "ft",
        hover: true,
      },
      senses: {
        darkvision: 60,
        blindsight: 0,
        tremorsense: 0,
        truesight: 0,
        units: "ft",
        special: "Darkvision 60 ft",
      },
    },
    details: {
      biography: {
        value:
          "<p>A floating, crystalline-plasmic sphere of materialized Notum energy woven from the Meta-Physicist's consciousness. Manifestation Nodes channel destructive wrath, somatic mending, or psionic bewilderment according to their creator's noetic pulses.</p>",
        public: "",
      },
      alignment: "Unaligned",
      cr: null,
      spellLevel: 0,
      type: {
        value: "aberration",
        subtype: "Notum Valence",
        swarm: "",
        custom: "",
      },
      source: {
        custom: "Suns of Rubi",
      },
    },
    traits: {
      size: "sm",
      di: {
        value: ["poison", "psychic"],
        bypasses: [],
        custom: "",
      },
      dv: {
        value: [],
        bypasses: [],
        custom: "",
      },
      dr: {
        value: [],
        bypasses: [],
        custom: "",
      },
      ci: {
        value: ["charmed", "exhaustion", "frightened", "poisoned"],
        custom: "",
      },
      languages: {
        value: [],
        custom: "Understands creator's languages but cannot speak",
      },
    },
    skills: {
      prc: {
        value: 2,
        ability: "wis",
      },
    },
  },
  prototypeToken: {
    name: "Manifestation Node",
    displayName: 20,
    displayBars: 20,
    actorLink: true,
    disposition: 1,
    bar1: {
      attribute: "attributes.hp",
    },
    sight: {
      enabled: true,
      range: 60,
      visionMode: "darkvision",
    },
    depth: 1,
  },
  items: [
    {
      _id: "NodeTraitSharedC1",
      name: "Shared Paracausal Conduit",
      type: "feat",
      img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
      system: {
        description: {
          value:
            "<p>All active manifestations share a single unified hit point reserve called the <strong>Conduit Pool</strong> (<code>10 + 5 * @classes.meta-physicist.levels</code>). When an area-of-effect spell or hazard damages multiple manifestations at once, damage is deducted from the Conduit Pool only once for that instance. If the Conduit Pool drops to 0 HP, all active manifestations immediately destabilize and dissipate.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Trait" },
        requirements: "",
        activities: {},
      },
      effects: [],
      flags: {},
      sort: 100000,
      _key: `!actors.items!${ACTOR_ID}.NodeTraitSharedC1`,
    },
    {
      _id: "NodeTraitSymbOrb1",
      name: "Symbiotic Orbit",
      type: "feat",
      img: "icons/magic/movement/trail-streak-zigzag-blue.webp",
      system: {
        description: {
          value:
            "<p>The manifestation can enter and occupy the space of a willing allied creature. While orbiting in an ally's space, it moves along with that ally automatically and does not provoke opportunity attacks from movement.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Trait" },
        requirements: "",
        activities: {},
      },
      effects: [],
      flags: {},
      sort: 200000,
      _key: `!actors.items!${ACTOR_ID}.NodeTraitSymbOrb1`,
    },
    {
      _id: "NodeActWrathStrk1",
      name: "Wrath Strike",
      type: "feat",
      img: "icons/magic/fire/projectile-fireball-smoke-orange.webp",
      system: {
        description: {
          value:
            "<p><em>Commanded via Creator's Bonus Action Noetic Pulse</em></p><p>The Wrath manifestation projects a beam of compressed paracausal energy at a target within 60 feet of the node. Make a ranged program attack using your creator's attack modifier (<code>@prof + @abilities.wis.mod</code>). On a hit, the target takes Force or Psychic damage equal to the Noetic Pulse roll (<code>1d8 + @abilities.wis.mod</code>).</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Action" },
        requirements: "",
        activities: {
          actWrathStrike01: {
            _id: "actWrathStrike01",
            type: "attack",
            name: "Wrath Strike Attack",
            activation: {
              type: "special",
              value: null,
              condition: "Commanded via Creator's Noetic Pulse",
            },
            duration: { units: "inst", value: "" },
            target: { template: { contiguous: false, units: "ft" }, affix: false },
            range: { value: "60", units: "ft" },
            attack: {
              ability: "wis",
              bonus: "",
              critical: { threshold: null },
              flat: false,
              type: { value: "ranged", classification: "spell" },
            },
            damage: {
              critical: { allow: true, bonus: "" },
              parts: [
                {
                  custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
                  number: null,
                  denomination: 0,
                  bonus: "",
                  types: ["force"],
                  scaling: { mode: "whole", number: null, formula: "" },
                },
              ],
            },
          },
        },
      },
      effects: [],
      flags: {},
      sort: 300000,
      _key: `!actors.items!${ACTOR_ID}.NodeActWrathStrk1`,
    },
    {
      _id: "NodeActCurativeP1",
      name: "Curative Pulse",
      type: "feat",
      img: "icons/magic/life/cross-beam-green.webp",
      system: {
        description: {
          value:
            "<p><em>Commanded via Creator's Bonus Action Noetic Pulse</em></p><p>The Curative manifestation radiates regenerative Notum harmonics. Choose one ally within 60 feet of the node. That ally gains temporary hit points equal to the Noetic Pulse roll (<code>1d8 + @abilities.wis.mod</code>), which persist until the start of your creator's next turn.</p>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Action" },
        requirements: "",
        activities: {
          actCurativePulse: {
            _id: "actCurativePulse",
            type: "heal",
            name: "Curative Pulse Temp HP",
            activation: {
              type: "special",
              value: null,
              condition: "Commanded via Creator's Noetic Pulse",
            },
            duration: { units: "round", value: "1" },
            target: { template: { contiguous: false, units: "ft" }, affix: false },
            range: { value: "60", units: "ft" },
            healing: {
              types: ["temphp"],
              custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
              scaling: { mode: "whole", number: null, formula: "" },
              bonus: "",
            },
          },
        },
      },
      effects: [],
      flags: {},
      sort: 400000,
      _key: `!actors.items!${ACTOR_ID}.NodeActCurativeP1`,
    },
    {
      _id: "NodeActBewilderP1",
      name: "Bewilderment Pulse",
      type: "feat",
      img: "icons/magic/control/silhouette-hold-change-blue.webp",
      system: {
        description: {
          value:
            "<p><em>Commanded via Creator's Bonus Action Noetic Pulse</em></p><p>The Bewilderment manifestation projects a mind-warping psychic dissonance at one creature within 60 feet of the node. Calculate the Bewilderment Threshold: <code>1d8 + @abilities.wis.mod + (2 * @classes.meta-physicist.levels)</code>.</p><ul><li><strong>Target Current HP &le; Threshold:</strong> The target is <strong>Mesmerized</strong> (Incapacitated with speed 0) until it takes damage or until the end of its next turn.</li><li><strong>Target Current HP &gt; Threshold:</strong> The target is <strong>Dazed</strong> until the end of its next turn (its speed is halved, it cannot take reactions, and on its turn it can take either an Action or a Bonus Action, but not both).</li></ul>",
        },
        source: { custom: "Suns of Rubi" },
        type: { value: "monster", subtype: "Action" },
        requirements: "",
        activities: {
          actBewilderPulse: {
            _id: "actBewilderPulse",
            type: "utility",
            name: "Bewilderment Threshold Check",
            activation: {
              type: "special",
              value: null,
              condition: "Commanded via Creator's Noetic Pulse",
            },
            duration: { units: "round", value: "1" },
            target: { template: { contiguous: false, units: "ft" }, affix: false },
            range: { value: "60", units: "ft" },
            roll: {
              formula: "1d8 + @abilities.wis.mod + (2 * @classes.meta-physicist.levels)",
              name: "Bewilderment Threshold",
            },
          },
        },
      },
      effects: [],
      flags: {},
      sort: 500000,
      _key: `!actors.items!${ACTOR_ID}.NodeActBewilderP1`,
    },
  ],
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: `!actors!${ACTOR_ID}`,
};

write("src/actors/manifestation-node.json", manifestationActor);

/* ------------------------------------------------------------------ */
/*  2. Core Class Features (10)                                       */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Core Features (10) ---");

// 1. Nanoprogramming (Level 1)
write(
  "src/features/meta-physicist/nanoprogramming.json",
  createFeat({
    id: "MpNanoProg000001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p>You learn to shape raw paracausal Notum streams into utilitarian and offensive nanoprograms.</p><p><strong>Progression:</strong> You follow a full-caster progression (Tiers 1–9).</p><p><strong>Wisdom Nanocasting:</strong> Wisdom is your nanocasting ability for your meta-physicist programs.</p><p><strong>Programs Known:</strong> You know 9 nanoprograms of 1st tier at 1st level.</p><p><strong>Nanopool Points:</strong> You possess a pool of Nanopool points equal to your Meta-Physicist Level &times; 4 + your Wisdom modifier. Expended Nanopool points are restored when you finish a Long Rest.</p><p><strong>High-Tier Limits:</strong> Nanoprograms of 6th, 7th, 8th, and 9th tier can each be compiled only once per Long Rest.</p><p><strong>Execution Requirement:</strong> Executing your nanoprograms requires at least one free hand or an attuned Notum focus stave or device.</p>",
    requirements: "Meta-Physicist 1",
    activities: {
      actMpNanoRecovery: {
        _id: "actMpNanoRecovery",
        type: "utility",
        name: "Nanopool Recovery",
        activation: { type: "special", value: null, condition: "Finish a Long Rest" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 2. Notum Manifestation (Level 1)
write(
  "src/features/meta-physicist/notum-manifestation.json",
  createFeat({
    id: "MpManifestation1",
    name: "Notum Manifestation",
    img: "icons/magic/light/orb-lightbulb-gray.webp",
    description:
      "<p>Starting at 1st level, you can materialize floating Notum Valences known as <strong>Manifestation Nodes</strong>. As an Action, you spend Nanopool points to manifest one node in an unoccupied space within 60 feet. The minimum cost is 2 Nanopool points (Power Level 1), and you can spend additional points up to your Max Power Level (+1 NP per tier).</p><ul><li><strong>Node Aspects:</strong> You choose the node's aspect upon manifestation: <em>Wrath</em> (offensive force), <em>Curative</em> (somatic restoration), or <em>Bewilderment</em> (sensory distortion).</li><li><strong>Capacity & Duration:</strong> You can maintain up to 3 active nodes simultaneously. A manifestation persists for a number of hours equal to your Meta-Physicist level, until reduced to 0 HP, or until you dismiss it.</li><li><strong>Conduit Pool:</strong> All your manifestations share a single Conduit Pool with hit points equal to <code>10 + (5 * @classes.meta-physicist.levels)</code>. Overpowering a manifestation at Power Level 2 or higher immediately heals the Conduit Pool for <code>5 * Power Level</code>.</li><li><strong>Noetic Pulse:</strong> As a Bonus Action on your turn, you can issue a Noetic Pulse command to one active manifestation node, activating its corresponding action (Wrath Strike, Curative Pulse, or Bewilderment Pulse).</li><li><strong>Symbiotic Orbit:</strong> A manifestation node can enter and occupy an ally's space, moving along with them without provoking opportunity attacks.</li></ul>",
    requirements: "Meta-Physicist 1",
    activities: {
      actMpManifestNode: {
        _id: "actMpManifestNode",
        type: "utility",
        name: "Manifest Node",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "hour", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "60", units: "ft" },
        consumption: {
          targets: [
            {
              type: "value",
              value: "2",
              scaling: { mode: "", formula: "" },
            },
          ],
          scaling: { allowed: true, max: "" },
        },
        roll: { formula: "", name: "" },
      },
      actMpNoeticPulse1: {
        _id: "actMpNoeticPulse1",
        type: "utility",
        name: "Noetic Pulse Command",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "1d8 + @abilities.wis.mod", name: "Noetic Pulse Roll" },
      },
    },
  })
);

// 3. Paracausal Attunement (Level 2)
write(
  "src/features/meta-physicist/paracausal-attunement.json",
  createFeat({
    id: "MpParacausalAtt1",
    name: "Paracausal Attunement",
    img: "icons/magic/symbols/star-solid-gold.webp",
    description:
      "<p>At 2nd level, you attune your neural link to a distinct metaphysical discipline: <strong>Attunement of Creation</strong>, <strong>Attunement of the Noosphere</strong>, or <strong>Attunement of the Resonator</strong>.</p>",
    requirements: "Meta-Physicist 2",
  })
);

// 4. Metaphysical Theories (Level 2)
write(
  "src/features/meta-physicist/metaphysical-theories.json",
  createFeat({
    id: "MpTheoriesOvervw",
    name: "Metaphysical Theories",
    img: "icons/sundries/books/book-embossed-jewel-purple.webp",
    description:
      "<p>In your research into the physics of Notum, you have formulated modular Metaphysical Theories that unlock unique paracausal interactions. At 2nd level, you gain two Metaphysical Theories of your choice. You gain additional theories as shown in the Theories Known column of the Meta-Physicist table (up to 10 at 18th level).</p><p>Whenever you gain a level in this class, you can choose one of the theories you know and replace it with another theory that you could learn at that level.</p>",
    requirements: "Meta-Physicist 2",
  })
);

// 5. Composite Teachings (Level 5)
write(
  "src/features/meta-physicist/composite-teachings.json",
  createFeat({
    id: "MpCompositeTeach",
    name: "Composite Teachings",
    img: "icons/magic/symbols/runes-carved-stone-purple.webp",
    description:
      "<p>Starting at 5th level, whenever you finish a Short or Long Rest, you broadcast a persistent carrier wave to a number of willing allies within 30 feet equal to your Proficiency Bonus. You and affected allies gain the following benefits:</p><ul><li><strong>Harmonic Resonance:</strong> When you roll damage or healing for a nanoprogram of 1st tier or higher, you add your Wisdom modifier to one roll.</li><li><strong>Neuron-Notum Interface:</strong> Your maximum overclock tier increases by +1 (<code>@scale.meta-physicist.composite-overclock</code>; +2 at 13th level, +3 at 17th level).</li><li><strong>Notum Recycler:</strong> Whenever you score a critical hit with a program attack, an enemy rolls a natural 1 on a saving throw against your programs, or you execute a program at your maximum overclock tier, you immediately regain 2 Nanopool points (<code>@scale.meta-physicist.composite-recycler</code>; 4 NP at 13th level, 6 NP at 17th level).</li></ul>",
    requirements: "Meta-Physicist 5",
    activities: {
      actMpCarrierWave: {
        _id: "actMpCarrierWave",
        type: "utility",
        name: "Broadcast Carrier Wave",
        activation: { type: "special", value: null, condition: "Finish a Short or Long Rest" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "30", units: "ft" },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 6. Multi-Vector Synchronization (Level 6)
write(
  "src/features/meta-physicist/multi-vector-synchronization.json",
  createFeat({
    id: "MpMultiVectorSyn",
    name: "Multi-Vector Synchronization",
    img: "icons/magic/movement/trail-streak-zigzag-blue.webp",
    description:
      "<p>Beginning at 6th level, you can synchronize multiple manifestations across the battlefield. As a Bonus Action on your turn, you can spend 2 Nanopool points to command two active manifestation nodes simultaneously. You roll your Noetic Pulse once and apply the result to both commanded nodes.</p>",
    requirements: "Meta-Physicist 6",
    activities: {
      actMpMultiVector: {
        _id: "actMpMultiVector",
        type: "utility",
        name: "Dual Node Command",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        consumption: {
          targets: [
            {
              type: "value",
              value: "2",
              scaling: { mode: "", formula: "" },
            },
          ],
          scaling: { allowed: false, max: "" },
        },
        roll: { formula: "1d8 + @abilities.wis.mod", name: "Synchronized Noetic Pulse" },
      },
    },
  })
);

// 7. Source Crystallization (Level 7)
write(
  "src/features/meta-physicist/source-crystallization.json",
  createFeat({
    id: "MpSourceCrystall",
    name: "Source Crystallization",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p>At 7th level, you can condense ambient Notum into a solid crystalline battery called a <strong>Crystallized Source Vessel</strong>. You create 1 vessel whenever you finish a Short or Long Rest. You can shatter the vessel to produce one of the following effects:</p><ul><li><strong>Sovereign Aegis (Reaction):</strong> When you or an ally within 30 feet takes damage, reduce the damage by <code>1d10 + @abilities.wis.mod</code>. Your Conduit Pool heals for an amount equal to the damage prevented.</li><li><strong>Primordial Singularity (Action):</strong> Shatter the vessel at a point within 60 feet. Creatures within a 15-foot radius must make a Strength saving throw against your Program Save DC or take 2d8 Force damage and be pulled up to 10 feet toward the center.</li><li><strong>Conduit Surge (Action):</strong> You regain Nanopool points equal to your Proficiency Bonus, or gain temporary hit points equal to your Meta-Physicist level, and all your active manifestations gain +15 feet to their flying speed until the end of your next turn.</li></ul>",
    requirements: "Meta-Physicist 7",
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actMpSovereignAe: {
        _id: "actMpSovereignAe",
        type: "utility",
        name: "Sovereign Aegis",
        activation: {
          type: "reaction",
          value: 1,
          condition: "You or an ally within 30 ft takes damage",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "30", units: "ft" },
        roll: { formula: "1d10 + @abilities.wis.mod", name: "Damage Reduction" },
      },
      actMpPrimordSing: {
        _id: "actMpPrimordSing",
        type: "save",
        name: "Primordial Singularity",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: {
          template: { count: 1, contiguous: false, type: "radius", units: "ft", size: "15" },
          affix: false,
        },
        range: { value: "60", units: "ft" },
        save: {
          ability: ["str"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: {
          onSave: "none",
          parts: [
            {
              custom: { enabled: true, formula: "2d8" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["force"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
      actMpConduitSurg: {
        _id: "actMpConduitSurg",
        type: "utility",
        name: "Conduit Surge",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 8. Attunement Enhancements (Level 7)
write(
  "src/features/meta-physicist/attunement-enhancements.json",
  createFeat({
    id: "MpAttunementEnh1",
    name: "Attunement Enhancements",
    img: "icons/magic/symbols/star-solid-gold.webp",
    description:
      "<p>Your Crystallized Source Vessels receive signature upgrades based on your 2nd-level Paracausal Attunement:</p><ul><li><strong>Creation Infusion:</strong> When you shatter a vessel, your Creation Weapon deals an extra 1d8 Force damage on hits for 1 minute, and your Novictum Bulwark grants +1 additional AC.</li><li><strong>Noospheric Flush:</strong> As a Bonus Action, you can shatter a vessel to immediately regain Nanopool points equal to your Proficiency Bonus. The next nanoprogram you execute ignores half and three-quarters cover and does not suffer Disadvantage from ranged proximity.</li><li><strong>Crucible Capacity:</strong> You can carry up to 2 Crystallized Source Vessels simultaneously instead of 1.</li></ul>",
    requirements: "Meta-Physicist 7",
  })
);

// 9. Sacrifice Manifestation (Level 9)
write(
  "src/features/meta-physicist/sacrifice-manifestation.json",
  createFeat({
    id: "MpSacrificeManif",
    name: "Sacrifice Manifestation",
    img: "icons/magic/fire/explosion-fireball-large-purple-orange.webp",
    description:
      "<p>At 9th level, you can detonate an active manifestation as an Action, or as a Reaction when an ally within 30 feet of a node drops to 0 hit points. Roll a number of d8s equal to the sacrificed manifestation's Power Level:</p><ul><li><strong>Wrath (Kinetic Singularity):</strong> Every creature in a 20-foot sphere around the node must make a Strength saving throw against your Program Save DC or take Force damage equal to the total rolled + your Wisdom modifier, be pulled up to 15 feet toward the node's space, and be knocked Prone.</li><li><strong>Curative (Cellular Transfusion):</strong> Choose one ally within 30 feet of the node. That ally regains hit points equal to the total rolled + your Wisdom modifier, and ends one of the following conditions on itself: Blinded, Deafened, Dazed, Paralyzed, or Poisoned.</li><li><strong>Bewilderment (Neural Flash):</strong> Every creature in a 20-foot sphere must make an Intelligence saving throw or take Psychic damage equal to the total rolled + your Wisdom modifier, be Blinded, and lose its reaction until the end of its next turn. Friendly creatures in the area can use their reaction to immediately move up to half their speed without provoking opportunity attacks.</li></ul><p>Once you sacrifice a manifestation, you must finish a Short or Long Rest before doing so again.</p>",
    requirements: "Meta-Physicist 9",
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actMpDetonateWrat: {
        _id: "actMpDetonateWrat",
        type: "save",
        name: "Detonate Wrath (Kinetic Singularity)",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: {
          template: { count: 1, contiguous: false, type: "sphere", units: "ft", size: "20" },
          affix: false,
        },
        save: {
          ability: ["str"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: {
          onSave: "half",
          parts: [
            {
              custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["force"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
      actMpDetonateCura: {
        _id: "actMpDetonateCura",
        type: "heal",
        name: "Detonate Curative (Cellular Transfusion)",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "30", units: "ft" },
        healing: {
          types: ["healing"],
          custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
      actMpDetonateBewi: {
        _id: "actMpDetonateBewi",
        type: "save",
        name: "Detonate Bewilderment (Neural Flash)",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "round", value: "1" },
        target: {
          template: { count: 1, contiguous: false, type: "sphere", units: "ft", size: "20" },
          affix: false,
        },
        save: {
          ability: ["int"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: {
          onSave: "half",
          parts: [
            {
              custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["psychic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

// 10. Avatar of the Source (Level 20)
write(
  "src/features/meta-physicist/avatar-of-the-source.json",
  createFeat({
    id: "MpAvatarOfSource",
    name: "Avatar of the Source",
    img: "icons/magic/light/explosion-star-glow-silhouette.webp",
    description:
      "<p>You achieve perfect unity with the Notum stream. Your Wisdom score and its maximum each increase by 4 (to a maximum of 24).</p><p>Additionally, as an Action, you can enter an awakened state for 1 minute:</p><ul><li>You gain a flying speed of 60 feet (hover).</li><li>You can command all three active manifestation nodes simultaneously using your Bonus Action without spending Nanopool points.</li><li>All your active manifestations are treated as if cast at 9th Power Level for all effects and calculations.</li></ul><p>You can enter this state once per Long Rest, or by expending 10 Nanopool points.</p>",
    requirements: "Meta-Physicist 20",
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actMpAvatarAwaken: {
        _id: "actMpAvatarAwaken",
        type: "utility",
        name: "Awaken Avatar of the Source",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

/* ------------------------------------------------------------------ */
/*  3. Paracausal Attunements (3)                                     */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Paracausal Attunements (3) ---");

// Attunement 1: Creation
write(
  "src/features/meta-physicist/attunements/attunement-creation.json",
  createFeat({
    id: "MpAttuneCreation",
    name: "Attunement of Creation",
    img: "icons/weapons/swords/sword-broad-crystal-blue.webp",
    description:
      "<p><em>Paracausal Attunement</em></p><p>You focus on shaping dense, hard-light matter and defensive matrices:</p><ul><li><strong>Creation Weapon:</strong> As a Bonus Action, you can materialize a weapon made of solid Notum. It can take the form of a one-handed weapon dealing 1d8 Force damage (Versatile 1d10) or two light finesse source blades dealing 1d6 Force damage each. You can use your Wisdom modifier for its attack and damage rolls, and it counts as an NCU focus.</li><li><strong>Novictum Bulwark:</strong> Alternatively, you can materialize a shimmering shield (+2 AC). When a creature within 30 feet that is orbited by one of your manifestations is attacked, you can use your reaction to project a defensive hard-light flare, granting that ally a +2 bonus to AC against the triggering attack.</li></ul>",
    subtype: "attunement",
    requirements: "Meta-Physicist 2",
    activities: {
      actMpMaterializeW: {
        _id: "actMpMaterializeW",
        type: "utility",
        name: "Materialize Creation Weapon / Bulwark",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// Attunement 2: Noosphere
write(
  "src/features/meta-physicist/attunements/attunement-noosphere.json",
  createFeat({
    id: "MpAttuneNoospher",
    name: "Attunement of the Noosphere",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description:
      "<p><em>Paracausal Attunement</em></p><p>You tap into the planetary consciousness network and wide-band sensory arrays:</p><ul><li><strong>Omniscience Cache:</strong> You learn three At-Will nanoprograms of your choice from any Operating System.</li><li><strong>Dynamic Recalibration:</strong> When you finish a Short Rest, you can replace one prepared nanoprogram with another program from your OS.</li><li><strong>Telepathic Hub:</strong> You establish a telepathic network with a number of willing creatures within 60 feet equal to your Wisdom modifier.</li><li><strong>Relay Array:</strong> You can originate nanoprograms from the space of any of your active manifestations. Furthermore, Triangulated Targeting ensures your ranged attacks ignore half and three-quarters cover against targets within 10 feet of a node, and Noospheric Relay extends your Noetic Pulse command range to 120 feet.</li></ul>",
    subtype: "attunement",
    requirements: "Meta-Physicist 2",
  })
);

// Attunement 3: Resonator
write(
  "src/features/meta-physicist/attunements/attunement-resonator.json",
  createFeat({
    id: "MpAttuneResonato",
    name: "Attunement of the Resonator",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p><em>Paracausal Attunement</em></p><p>You manifest a specialized focus known as the <strong>Paracausal Resonator</strong>, tuning sympathetic vibrational frequencies to your allies:</p><ul><li><strong>Cognitive Buffer:</strong> You bond your resonator to one ally during a rest. When that ally fails an ability check or saving throw, you can use your reaction to add a 1d4 bonus to the roll (usable a number of times equal to 2 &times; Proficiency Bonus per Long Rest).</li><li><strong>Reactive Static:</strong> When a bonded ally is hit in melee, you can use your reaction to deal <code>1d8 + @abilities.wis.mod</code> Psychic damage to the attacker.</li><li><strong>Conduit Tether:</strong> When your bonded ally takes damage, you can use your reaction to shunt half of the damage to your Conduit Pool instead.</li><li><strong>Resonant Echo:</strong> When your Curative manifestation pulses, your bonded ally gains additional temporary hit points equal to your Wisdom modifier.</li></ul>",
    subtype: "attunement",
    requirements: "Meta-Physicist 2",
    activities: {
      actMpCognitiveBuf: {
        _id: "actMpCognitiveBuf",
        type: "utility",
        name: "Cognitive Buffer",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Bonded ally fails an ability check or saving throw",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "1d4", name: "Buffer Bonus" },
      },
      actMpReactiveStat: {
        _id: "actMpReactiveStat",
        type: "damage",
        name: "Reactive Static",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Bonded ally is hit by a melee attack",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: false, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "1d8 + @abilities.wis.mod" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["psychic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

/* ------------------------------------------------------------------ */
/*  4. Metaphysical Theories (33)                                     */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Metaphysical Theories (33) ---");

// --- Baseline Theories (15) ---
const baselineTheories = [
  {
    id: "MpTheoBulwarkInt",
    file: "bulwark-interposition.json",
    name: "Bulwark Interposition",
    desc: "<p><em>Metaphysical Theory</em></p><p>When an attacker within 30 feet of one of your manifestations makes an attack roll against an ally, you can use your reaction to impose Disadvantage on the attack roll as the manifestation flashes interposing hard-light shielding.</p>",
  },
  {
    id: "MpTheoCognitiveA",
    file: "cognitive-anchoring.json",
    name: "Cognitive Anchoring",
    desc: "<p><em>Metaphysical Theory</em></p><p>Your mind is anchored to the global Notum lattice. You have Advantage on saving throws against being Charmed or Frightened, and cannot be put to sleep by technological or magical means.</p>",
  },
  {
    id: "MpTheoEnduringKn",
    file: "enduring-knowledge.json",
    name: "Enduring Knowledge",
    desc: "<p><em>Metaphysical Theory</em></p><p>You gain proficiency in two skills of your choice from Arcana, History, Nature, or Technology. You add double your proficiency bonus to checks made with these chosen skills.</p>",
  },
  {
    id: "MpTheoFrancoisDi",
    file: "francois-dissonant-echo.json",
    name: "Francois' Dissonant Echo",
    desc: "<p><em>Metaphysical Theory</em></p><p>Whenever a creature fails a saving throw against one of your nanoprograms or Bewilderment Pulse, it takes additional Psychic damage equal to your Wisdom modifier.</p>",
  },
  {
    id: "MpTheoNasiersRes",
    file: "nasiers-resonant-grace.json",
    name: "Nasier's Resonant Grace",
    desc: "<p><em>Metaphysical Theory</em></p><p>Your movement speed increases by 10 feet. When you take the Disengage action, your active manifestations can immediately fly up to 15 feet as a free movement.</p>",
  },
  {
    id: "MpTheoOcularFocu",
    file: "ocular-focus.json",
    name: "Ocular Focus",
    desc: "<p><em>Metaphysical Theory</em></p><p>You can perceive through the senses of your active manifestation nodes as if you were in their space, seeing through non-magical darkness up to 120 feet.</p>",
  },
  {
    id: "MpTheoPrecursorC",
    file: "precursor-compiler-protocol.json",
    name: "Precursor Compiler Protocol",
    desc: "<p><em>Metaphysical Theory</em></p><p>Executing At-Will nanoprograms requires no verbal or somatic components, making your cantrips completely undetectable by audio or visual observation.</p>",
  },
  {
    id: "MpTheoReachExpan",
    file: "reach-of-the-expanse.json",
    name: "Reach of the Expanse",
    desc: "<p><em>Metaphysical Theory</em></p><p>The range of your nanoprograms that have a range of 10 feet or greater increases by 30 feet.</p>",
  },
  {
    id: "MpTheoRedfiresIr",
    file: "redfires-ire.json",
    name: "Redfire's Ire",
    desc: "<p><em>Metaphysical Theory</em></p><p>When your Wrath manifestation hits with a Wrath Strike, the target catches fire or begins melting from paracybernetic heat, taking 1d6 Fire damage at the start of its next turn.</p>",
  },
  {
    id: "MpTheoRetaliator",
    file: "retaliatory-backlash.json",
    name: "Retaliatory Backlash",
    desc: "<p><em>Metaphysical Theory</em></p><p>When a creature hits one of your manifestations with a melee attack, the attacker takes Force damage equal to your Wisdom modifier.</p>",
  },
  {
    id: "MpTheoRuinousPow",
    file: "ruinous-power.json",
    name: "Ruinous Power",
    desc: "<p><em>Metaphysical Theory</em></p><p>Your Wrath Strike damage rolls deal double damage to objects, structures, and automated barriers.</p>",
  },
  {
    id: "MpTheoSensorNode",
    file: "sensor-node-uplink.json",
    name: "Sensor Node Uplink",
    desc: "<p><em>Metaphysical Theory</em></p><p>Creatures within 10 feet of your manifestation nodes cannot benefit from being Invisible or lightly obscured against you and your allies.</p>",
  },
  {
    id: "MpTheoSpatialAnc",
    file: "spatial-anchor.json",
    name: "Spatial Anchor",
    desc: "<p><em>Metaphysical Theory</em></p><p>You and allies orbited by your manifestations cannot be moved against your will or knocked prone by effects originating from creatures of Huge size or smaller.</p>",
  },
  {
    id: "MpTheoSynapticTa",
    file: "synaptic-tap.json",
    name: "Synaptic Tap",
    desc: "<p><em>Metaphysical Theory</em></p><p>When you hit an enemy with a Wrath Strike or damage it with a nanoprogram, you reduce its next saving throw roll by 1d4 if made before the end of your next turn.</p>",
  },
  {
    id: "MpTheoWarpingImp",
    file: "warping-impact.json",
    name: "Warping Impact",
    desc: "<p><em>Metaphysical Theory</em></p><p>When your Wrath Strike scores a critical hit, the target is pushed up to 15 feet straight back and knocked Prone.</p>",
  },
];

for (const theo of baselineTheories) {
  write(
    `src/features/meta-physicist/theories/${theo.file}`,
    createFeat({
      id: theo.id,
      name: theo.name,
      description: theo.desc,
      subtype: "theory",
      requirements: "Meta-Physicist 2",
    })
  );
}

// --- Level 5+ Theories (7) ---
const level5Theories = [
  {
    id: "MpTheoCallOfTheD",
    file: "call-of-the-deep.json",
    name: "Call of the Deep",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>When you manifest a node, you can summon it with 1 additional Power Level without spending extra Nanopool points once per Short or Long Rest.</p>",
  },
  {
    id: "MpTheoEmotionalT",
    file: "emotional-transmutation.json",
    name: "Emotional Transmutation",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>As a reaction when an enemy within 30 feet fails a saving throw against an enchantment or illusion effect, you can immediately heal your Conduit Pool for 2d8 hit points.</p>",
  },
  {
    id: "MpTheoHarmonicBas",
    file: "harmonic-bastion.json",
    name: "Harmonic Bastion",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>Allies within 10 feet of your Curative manifestation gain Resistance to Force and Psychic damage.</p>",
  },
  {
    id: "MpTheoNovictumGu",
    file: "novictum-guiding-strike.json",
    name: "Novictum Guiding Strike",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>When your Wrath Strike hits a target, the next attack roll made against that target by an ally before the start of your next turn has Advantage.</p>",
  },
  {
    id: "MpTheoOverAirVec",
    file: "over-the-air-vector.json",
    name: "Over-the-Air Vector",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>You can deliver touch nanoprograms through any of your active manifestations within 120 feet of you.</p>",
  },
  {
    id: "MpTheoPhantomMim",
    file: "phantom-mimicry.json",
    name: "Phantom Mimicry",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>You can cause your manifestations to project realistic holographic doubles of yourself. Attack rolls against you have Disadvantage while at least one manifestation is within 5 feet of you.</p>",
  },
  {
    id: "MpTheoQuantumFer",
    file: "quantum-ferry.json",
    name: "Quantum Ferry",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 5)</em></p><p>As a Bonus Action, you can swap positions with an active manifestation node within 60 feet of you.</p>",
  },
];

for (const theo of level5Theories) {
  write(
    `src/features/meta-physicist/theories/${theo.file}`,
    createFeat({
      id: theo.id,
      name: theo.name,
      description: theo.desc,
      subtype: "theory",
      requirements: "Meta-Physicist 5",
    })
  );
}

// --- Level 7+ Theories (5) ---
const level7Theories = [
  {
    id: "MpTheoBottledInc",
    file: "bottled-incarnation-sovereign-node.json",
    name: "Bottled Incarnation (Sovereign Node)",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 7)</em></p><p>You can store a pre-manifested node inside a containment sphere on your belt during a rest. You can deploy this node as a Bonus Action without spending Nanopool points.</p>",
  },
  {
    id: "MpTheoHoveringBa",
    file: "hovering-bastion.json",
    name: "Hovering Bastion",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 7)</em></p><p>Your manifestations can lift an orbited ally off the ground, granting them a hovering fly speed of 20 feet for the duration of the orbit.</p>",
  },
  {
    id: "MpTheoMentalClar",
    file: "mental-clarity-scrubbed-horizon.json",
    name: "Mental Clarity (Scrubbed Horizon)",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 7)</em></p><p>You can spend 1 Nanopool point as a Bonus Action to cleanse all sensory interference, granting yourself Truesight out to 30 feet for 1 minute.</p>",
  },
  {
    id: "MpTheoNoosphericI",
    file: "noospheric-interceptor.json",
    name: "Noospheric Interceptor",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 7)</em></p><p>When an enemy within 60 feet casts a spell or executes a nanoprogram, you can use your reaction to force it to make an Intelligence saving throw against your Program Save DC; on a failure, the program's level or tier is reduced by 1.</p>",
  },
  {
    id: "MpTheoStaticInter",
    file: "static-interdiction-relay.json",
    name: "Static Interdiction Relay",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 7)</em></p><p>Hostile creatures treat the area within 15 feet of your Bewilderment node as difficult terrain. Teleportation into or out of this aura requires a successful Wisdom save against your Program Save DC.</p>",
  },
];

for (const theo of level7Theories) {
  write(
    `src/features/meta-physicist/theories/${theo.file}`,
    createFeat({
      id: theo.id,
      name: theo.name,
      description: theo.desc,
      subtype: "theory",
      requirements: "Meta-Physicist 7",
    })
  );
}

// --- Level 9+ Theories (3) ---
const level9Theories = [
  {
    id: "MpTheoIncarnator",
    file: "incarnator-extraction.json",
    name: "Incarnator Extraction",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 9)</em></p><p>When an active manifestation is destroyed or sacrificed, you immediately siphon 2 Nanopool points from its collapsing core into your reserves.</p>",
  },
  {
    id: "MpTheoOmniscient",
    file: "omniscient-overwatch.json",
    name: "Omniscient Overwatch",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 9)</em></p><p>While you have at least 2 active manifestations within 60 feet of each other, you cannot be surprised, and you and allies within their line of sight gain a +2 bonus to Initiative rolls.</p>",
  },
  {
    id: "MpTheoSingularTr",
    file: "singularity-triangulation.json",
    name: "Singularity Triangulation",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 9)</em></p><p>When you have three active manifestations and target a creature between them, your nanoprogram attack rolls score a critical hit on an 18–20.</p>",
  },
];

for (const theo of level9Theories) {
  write(
    `src/features/meta-physicist/theories/${theo.file}`,
    createFeat({
      id: theo.id,
      name: theo.name,
      description: theo.desc,
      subtype: "theory",
      requirements: "Meta-Physicist 9",
    })
  );
}

// --- Level 11–12+ Theories (3) ---
const level11Theories = [
  {
    id: "MpTheoSharedDisp",
    file: "shared-dispersion.json",
    name: "Shared Dispersion",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 11)</em></p><p>When you take damage from an attack or area effect, you can choose to divert up to half of that damage into your Conduit Pool instead of taking it yourself.</p>",
  },
  {
    id: "MpTheoNeuralRebo",
    file: "neural-rebound.json",
    name: "Neural Rebound",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 11)</em></p><p>When you succeed on a Wisdom or Intelligence saving throw against a hostile spell or program, the caster takes Psychic damage equal to half the damage the effect would have dealt (or your level + Wis mod, whichever is higher).</p>",
  },
  {
    id: "MpTheoNoeticEdge",
    file: "noetic-edge.json",
    name: "Noetic Edge",
    desc: "<p><em>Metaphysical Theory (Prerequisite: Meta-Physicist Level 12)</em></p><p>Your Noetic Pulse die increases from a d8 to a d10 for all calculations, strikes, and curative pulses.</p>",
  },
];

for (const theo of level11Theories) {
  write(
    `src/features/meta-physicist/theories/${theo.file}`,
    createFeat({
      id: theo.id,
      name: theo.name,
      description: theo.desc,
      subtype: "theory",
      requirements: "Meta-Physicist 11",
    })
  );
}

/* ------------------------------------------------------------------ */
/*  5. Class Document: Meta-Physicist                                 */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Class Document ---");

const metaPhysicistClass = {
  _id: "MetaPhysClass001",
  name: "Meta-Physicist",
  type: "class",
  img: "icons/magic/symbols/runes-carved-stone-purple.webp",
  system: {
    description: {
      value:
        "<p>Pioneers of the Notum stream and masters of psychological and physical materialization, Meta-Physicists weave raw conscious thought into autonomous manifestations. Through shared conduit pools, sympathetic attunements, and modular metaphysical theories, they command the battlefield with unparalleled paracausal versatility.</p>",
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "meta-physicist",
    levels: 1,
    hd: {
      denomination: 6,
      spent: 0,
      additional: "",
    },
    primaryAbility: {
      value: ["wis"],
      all: false,
    },
    spellcasting: {
      progression: "full",
      ability: "wis",
    },
    advancement: [
      {
        _id: "advMpHitPoints01",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      {
        _id: "advMpSavesPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:cha", "saves:wis"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Saving Throws",
      },
      {
        _id: "advMpArmorPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:shl"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Armor Training",
      },
      {
        _id: "advMpWeaponPr001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:simple-sourceweapon"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Weapon Proficiencies",
      },
      {
        _id: "advMpToolProf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: ["tools:artisan", "tools:artificer", "tools:tinkers"],
            },
          ],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Tool Proficiencies",
      },
      {
        _id: "advMpSkillPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 2,
              pool: [
                "skills:dec",
                "skills:ins",
                "skills:itm",
                "skills:lor",
                "skills:nat",
                "skills:prc",
                "skills:per",
                "skills:tec",
              ],
            },
          ],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Skill Proficiencies",
      },
      {
        _id: "advMpScNanopl001",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1: { value: 4 },
            2: { value: 8 },
            3: { value: 12 },
            4: { value: 16 },
            5: { value: 20 },
            6: { value: 24 },
            7: { value: 28 },
            8: { value: 32 },
            9: { value: 36 },
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
      {
        _id: "advMpScTheoKn001",
        type: "ScaleValue",
        configuration: {
          identifier: "theories-known",
          type: "number",
          scale: {
            2: { value: 2 },
            3: { value: 3 },
            4: { value: 4 },
            5: { value: 4 },
            6: { value: 5 },
            7: { value: 5 },
            8: { value: 6 },
            9: { value: 6 },
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
        title: "Theories Known",
      },
      {
        _id: "advMpScConduit01",
        type: "ScaleValue",
        configuration: {
          identifier: "conduit-pool-max",
          type: "number",
          formula: "10 + (5 * @classes.meta-physicist.levels)",
          scale: {
            1: { value: 15, formula: "10 + (5 * @classes.meta-physicist.levels)" },
          },
        },
        value: {},
        level: 1,
        title: "Conduit Pool Max HP",
      },
      {
        _id: "advMpScBewilder1",
        type: "ScaleValue",
        configuration: {
          identifier: "bewilderment-threshold",
          type: "number",
          formula: "1d8 + @abilities.wis.mod + (2 * @classes.meta-physicist.levels)",
          scale: {
            1: { value: 3, formula: "1d8 + @abilities.wis.mod + (2 * @classes.meta-physicist.levels)" },
          },
        },
        value: {},
        level: 1,
        title: "Bewilderment Threshold",
      },
      {
        _id: "advMpScCompOvr01",
        type: "ScaleValue",
        configuration: {
          identifier: "composite-overclock",
          type: "number",
          scale: {
            5: { value: 1 },
            13: { value: 2 },
            17: { value: 3 },
          },
        },
        value: {},
        level: 5,
        title: "Composite Overclock Bonus",
      },
      {
        _id: "advMpScCompRec01",
        type: "ScaleValue",
        configuration: {
          identifier: "composite-recycler",
          type: "number",
          scale: {
            5: { value: 2 },
            13: { value: 4 },
            17: { value: 6 },
          },
        },
        value: {},
        level: 5,
        title: "Composite Recycler Nanopool",
      },
      // Level 1 Item Grants
      {
        _id: "advMpItmGrLvl010",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpNanoProg000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpManifestation1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Level 1 Features",
      },
      // Level 2 Item Grants
      {
        _id: "advMpItmGrLvl020",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpParacausalAtt1",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpTheoriesOvervw",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Level 2 Features",
      },
      // Level 3 Subclass
      {
        _id: "advMpSubclass001",
        type: "Subclass",
        configuration: {
          identifier: "manifestation-discipline",
        },
        value: {},
        level: 3,
        title: "Manifestation Discipline",
      },
      // Level 4 ASI
      {
        _id: "advMpASILvl04001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 4,
        title: "Ability Score Improvement",
      },
      // Level 5 Item Grants
      {
        _id: "advMpItmGrLvl050",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpCompositeTeach",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Level 5 Features",
      },
      // Level 6 Item Grants
      {
        _id: "advMpItmGrLvl060",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpMultiVectorSyn",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Level 6 Features",
      },
      // Level 7 Item Grants
      {
        _id: "advMpItmGrLvl070",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpSourceCrystall",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpAttunementEnh1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Level 7 Features",
      },
      // Level 8 ASI
      {
        _id: "advMpASILvl08001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 8,
        title: "Ability Score Improvement",
      },
      // Level 9 Item Grants
      {
        _id: "advMpItmGrLvl090",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpSacrificeManif",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 9,
        title: "Level 9 Features",
      },
      // Level 12 ASI
      {
        _id: "advMpASILvl12001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 12,
        title: "Ability Score Improvement",
      },
      // Level 16 ASI
      {
        _id: "advMpASILvl16001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 16,
        title: "Ability Score Improvement",
      },
      // Level 19 ASI
      {
        _id: "advMpASILvl19001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 19,
        title: "Ability Score Improvement",
      },
      // Level 20 Item Grants
      {
        _id: "advMpItmGrLvl200",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MpAvatarOfSource",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Level 20 Features",
      },
    ],
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!MetaPhysClass001",
};

write("src/classes/meta-physicist.json", metaPhysicistClass);

console.log("\n=======================================================");
console.log("  Meta-Physicist class build complete (48 documents).");
console.log("=======================================================\n");
