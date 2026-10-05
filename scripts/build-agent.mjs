#!/usr/bin/env node
/**
 * build-agent.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Agent class package:
 *   • src/features/agent/           – 12 Core Class Features
 *   • src/features/agent/personas/  – 9 Operative Personas
 *   • src/classes/agent.json        – Agent Class Document
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

  if (obj._key && !obj._id) {
    const suffix = obj._key.split("!").pop();
    const dotIdx = suffix.lastIndexOf(".");
    obj._id = dotIdx >= 0 ? suffix.slice(dotIdx + 1) : suffix;
  }

  if (obj._id && !obj._key) {
    obj._key = `!items!${obj._id}`;
  }

  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath} [${obj._id}]`);
}

/** Standard feat scaffold for Agent features and personas */
function createFeat({
  id,
  name,
  img = "icons/skills/targeting/crosshair-pointed-red.webp",
  description,
  subtype = "",
  requirements = "Agent 1",
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
/*  1. Core Class Features (src/features/agent/)                      */
/* ================================================================== */

// 1. Nanoprogramming (Level 1)
write(
  "src/features/agent/nanoprogramming.json",
  createFeat({
    id: "AgtNanoProg00001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circuit-board-glowing-blue.webp",
    requirements: "Agent 1",
    description: `<p>Your black-budget cyberware, clandestine transmitters, and neural emulation decks grant you the ability to execute nanoprograms from the Agent Operating System (OS). You follow a <strong>2/3 Caster progression</strong> (scaling up to Tier 7 programs).</p>
<h3>Nanopool Points</h3>
<p>Your capacity to compile and execute nanoprograms is fueled by your Nanopool. Your maximum Nanopool points equal your <strong>Agent level × 3 + your Wisdom modifier</strong>. You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>
<p>Programs of 6th-tier and 7th-tier place immense strain on your clandestine hardware; you can only cast one program of 6th-tier per Long Rest, and one program of 7th-tier per Long Rest.</p>
<h3>Nanoprograms Known</h3>
<p>You know six 1st-tier nanoprograms of your choice from the Agent OS at 1st level.</p>
<h3>Nanocasting Ability</h3>
<p><strong>Wisdom</strong> is your nanocasting ability for your Agent nanoprograms, reflecting your psychological insight, observational acuity, and covert situational awareness.</p>
<ul>
  <li><strong>Nanoprogram Save DC</strong> = 8 + your Proficiency Bonus + your Wisdom modifier</li>
  <li><strong>Nanoprogram Attack Modifier</strong> = your Proficiency Bonus + your Wisdom modifier</li>
</ul>
<h3>Somatic Interface</h3>
<p>You must have at least one hand free to manipulate your cyberdeck or comm, or have both hands holding a proficient two-handed weapon equipped with a smartlink interface.</p>`,
  })
);

// 2. Jack of All Trades (Level 1)
write(
  "src/features/agent/jack-of-all-trades.json",
  createFeat({
    id: "AgtJackTrades001",
    name: "Jack of All Trades",
    img: "icons/tools/scribal/magnifying-glass.webp",
    requirements: "Agent 1",
    description: `<p>Starting at 1st level, you can add half your Proficiency Bonus (rounded down) to any ability check you make that doesn't already include your Proficiency Bonus.</p>`,
  })
);

// 3. Socio-Metrics (Level 1)
write(
  "src/features/agent/socio-metrics.json",
  createFeat({
    id: "AgtSocioMetric01",
    name: "Socio-Metrics",
    img: "icons/magic/perception/eye-slit-orange.webp",
    requirements: "Agent 1",
    description: `<p>At 1st level, your cold analytical assessment of micro-expressions, speech patterns, and biometrics replaces emotional persuasion. You can substitute your <strong>Wisdom modifier</strong> in place of your Charisma modifier when making <strong>Deception, Intimidation, and Persuasion checks</strong>.</p>`,
  })
);

// 4. Covert Ops (Level 1)
write(
  "src/features/agent/covert-ops.json",
  createFeat({
    id: "AgtCovertOps0001",
    name: "Covert Ops",
    img: "icons/skills/movement/stealth-shadow-silhouette-gray.webp",
    requirements: "Agent 1",
    description: `<p>At 1st level, you master elite infiltration and sniping protocols:</p>
<h3>Shifting Shadows</h3>
<p>You can take the <strong>Hide action as a Bonus Action</strong> on your turn. Additionally, you can spend <strong>1 Nanopool point</strong> when you take the Hide action to hide even when you are only lightly obscured by dim light, foliage, or smoke. While hidden in this manner, missing with a ranged weapon attack does not reveal your location.</p>
<h3>Take the Shot</h3>
<p>Once per turn when you make a ranged weapon attack that deals Sneak Attack damage, you can spend <strong>1 Nanopool point</strong> to calibrate your smart-optic HUD. That attack completely <strong>ignores half cover and three-quarters cover</strong>, and any damage dice that roll a 1 or 2 are treated as a 3.</p>`,
    activities: {
      actShiftingShadow: {
        _id: "actShiftingShadow",
        type: "utility",
        activation: { type: "bonus", value: 1, condition: "Spend 1 Nanopool to hide when lightly obscured" },
        name: "Shifting Shadows (Bonus Action Hide)",
      },
      actTakeTheShot01: {
        _id: "actTakeTheShot01",
        type: "utility",
        activation: { type: "special", value: null, condition: "Once per turn on ranged Sneak Attack (1 Nanopool)" },
        name: "Take the Shot (Ignore Cover / Minimum 3s)",
      },
    },
  })
);

// 5. Sneak Attack (Level 1)
write(
  "src/features/agent/sneak-attack.json",
  createFeat({
    id: "AgtSneakAttack01",
    name: "Sneak Attack",
    img: "icons/skills/targeting/crosshair-arrow-blue.webp",
    requirements: "Agent 1",
    description: `<p>Beginning at 1st level, you know how to strike subtly and exploit an enemy's distraction. Once per turn, you can deal an extra <strong>1d6 damage</strong> to one creature you hit with an attack if you have Advantage on the attack roll. The attack must use a <strong>Finesse weapon or a Ranged weapon</strong>.</p>
<p>You don't need Advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't Incapacitated, and you don't have Disadvantage on the attack roll. Alternatively, you can apply your Sneak Attack damage against a target that has Disadvantage on Dexterity saving throws and fails a saving throw against one of your nanoprograms or features.</p>
<p>The extra damage increases as you gain levels in this class: <strong>2d6 at 5th level</strong>, <strong>3d6 at 11th level</strong>, and <strong>4d6 at 17th level</strong> (\`@scale.agent.sneak-attack\`).</p>`,
  })
);

// 6. False Profession (Level 2)
write(
  "src/features/agent/false-profession.json",
  createFeat({
    id: "AgtFalseProf0001",
    name: "False Profession",
    img: "icons/magic/control/silhouette-aura-energy-purple.webp",
    requirements: "Agent 2",
    description: `<p>At 2nd level, you integrate an Emulation Deck into your neural implants, allowing you to disguise your digital and nanite footprint as an operative of another class. Whenever you finish a <strong>Long Rest</strong>, choose one other class (Bureaucrat, Doctor, Enforcer, Engineer, Fixer, Keeper, Nano-Technician, Soldier, or Trader).</p>
<h3>Spoofed OS Programs</h3>
<p>You learn <strong>two nanoprograms of your choice</strong> from the chosen class's Operating System of a tier lower than your current Max Power Level (Tier 0 cantrips at 2nd level). These count as Agent nanoprograms for you.</p>
<h3>Processing Tax</h3>
<p>Executing programs from your spoofed OS demands high computational overhead. You must expend <strong>1 additional Nanopool point</strong> whenever you cast a program learned through False Profession.</p>`,
  })
);

// 7. Operative Personas (Level 2)
write(
  "src/features/agent/operative-personas.json",
  createFeat({
    id: "AgtOperPersonas1",
    name: "Operative Personas",
    img: "icons/skills/trades/academics-study-reading-book.webp",
    requirements: "Agent 2",
    description: `<p>At 2nd level, you install modular identity templates known as <strong>Operative Personas</strong> into your behavioral matrix. You load two Personas of your choice from the available options.</p>
<p>The Personas Known column of the Agent table shows when you learn more Personas (scaling up to 10 at 19th level). Whenever you gain an Agent level, you can replace one Persona you know with another Persona of your choice.</p>
<h3>Passive Alias & Active Burn</h3>
<p>Each Persona grants you a continuous <strong>Passive Alias</strong> (skills, physical abilities, or sensory enhancements) and an <strong>Active Burn</strong> (an overclocked emergency subroutine).</p>`,
  })
);

// 8. Steady Aim (Level 3)
write(
  "src/features/agent/steady-aim.json",
  createFeat({
    id: "AgtSteadyAim0001",
    name: "Steady Aim",
    img: "icons/skills/targeting/crosshair-scoped-green.webp",
    requirements: "Agent 3",
    description: `<p>At 3rd level, as a <strong>Bonus Action</strong>, you give yourself Advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.</p>`,
    activities: {
      actSteadyAim0001: {
        _id: "actSteadyAim0001",
        type: "utility",
        activation: { type: "bonus", value: 1, condition: "Usable only if not moved this turn; sets speed to 0" },
        name: "Steady Aim",
      },
    },
  })
);

// 9. Total Concentration (Level 5)
write(
  "src/features/agent/total-concentration.json",
  createFeat({
    id: "AgtTotalConcen01",
    name: "Total Concentration",
    img: "icons/skills/targeting/target-strike-triple-blue.webp",
    requirements: "Agent 5",
    description: `<p>At 5th level, you can spend <strong>4 Nanopool points</strong> when you activate <strong>Steady Aim</strong> to enter an ultra-focused state of hyper-awareness for up to <strong>1 minute (requires Concentration)</strong>. While in this state:</p>
<ul>
  <li>Your ranged weapon attacks score a critical hit on a roll of <strong>18–20</strong>.</li>
  <li>Whenever you deal Sneak Attack damage with a ranged weapon, you deal the <strong>maximum value of each damage die</strong> instead of rolling.</li>
  <li><strong>Execute Threshold:</strong> If a ranged attack you make leaves the target with hit points equal to or less than <strong>twice your Agent level</strong> (\`@scale.agent.execute-threshold\`), the target immediately drops to <strong>0 hit points</strong>.</li>
</ul>`,
    activities: {
      actTotalConcen01: {
        _id: "actTotalConcen01",
        type: "utility",
        activation: { type: "special", value: null, condition: "Spend 4 Nanopool when activating Steady Aim" },
        duration: { value: "1", units: "minute" },
        target: { affects: { count: "1", type: "self" } },
        name: "Enter Total Concentration",
      },
    },
  })
);

// 10. Improved False Profession (Level 9)
write(
  "src/features/agent/improved-false-profession.json",
  createFeat({
    id: "AgtImpFalsePrf01",
    name: "Improved False Profession",
    img: "icons/magic/control/silhouette-aura-energy-purple.webp",
    requirements: "Agent 9",
    description: `<p>At 9th level, your emulation deck becomes vastly more sophisticated:</p>
<ul>
  <li><strong>Identity Hijack:</strong> You can spend <strong>3 Nanopool points</strong> as a Bonus Action to activate one 1st-level active class feature of your emulated class. For the purpose of that feature's scaling and formulas, treat your level in that class as equal to your <strong>Proficiency Bonus</strong> (\`@prof\`).</li>
  <li><strong>Rapid Recalibration:</strong> You can change your chosen False Profession whenever you finish a <strong>Short or Long Rest</strong>.</li>
  <li><strong>Expanded Emulation:</strong> You know <strong>four nanoprograms</strong> (instead of two) from your emulated class's OS.</li>
</ul>`,
    activities: {
      actIdentityHijack: {
        _id: "actIdentityHijack",
        type: "utility",
        activation: { type: "bonus", value: 1, condition: "Spend 3 Nanopool points" },
        name: "Identity Hijack",
      },
    },
  })
);

// 11. Between the Eyes (Level 11)
write(
  "src/features/agent/between-the-eyes.json",
  createFeat({
    id: "AgtBetweenEyes01",
    name: "Between the Eyes",
    img: "icons/weapons/ammunition/bullet-hole-penetration-orange.webp",
    requirements: "Agent 11",
    description: `<p>At 11th level, your critical shots inflict devastating neuro-trauma. When you score a critical hit against a creature with a weapon attack, the target <strong>cannot take Reactions</strong> and has <strong>Disadvantage on Constitution saving throws to maintain Concentration</strong> until the end of your next turn.</p>`,
  })
);

// 12. Perfect Alias (Level 20)
write(
  "src/features/agent/perfect-alias.json",
  createFeat({
    id: "AgtPerfectAlias1",
    name: "Perfect Alias",
    img: "icons/magic/control/silhouette-aura-energy-purple.webp",
    requirements: "Agent 20",
    description: `<p>At 20th level, you are the ghost in every system, impossible to pin down or predict:</p>
<ul>
  <li>Your <strong>Dexterity score increases by 2</strong>, and your <strong>Wisdom score increases by 2</strong>. Your maximum for those scores is now 22.</li>
  <li>Whenever you roll Initiative, you can instantly swap your chosen <strong>False Profession</strong> to any other class of your choice (no action required).</li>
</ul>`,
  })
);

/* ================================================================== */
/*  2. Operative Personas (src/features/agent/personas/)              */
/* ================================================================== */

// 1. Persona of the Ghost
write(
  "src/features/agent/personas/persona-ghost.json",
  createFeat({
    id: "PersOfGhost00001",
    name: "Persona of the Ghost",
    img: "icons/creatures/magical/spirit-undead-ghost-purple.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain a climbing speed equal to your walking speed and Darkvision out to 60 feet (or +30 feet if you already have it).</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you scramble enemy optics for <strong>1 minute</strong>. During this time, Opportunity Attacks against you have Disadvantage, and you can move through the spaces of hostile creatures as if they were difficult terrain.</p>`,
    activities: {
      actBurnGhost0001: {
        _id: "actBurnGhost0001",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: Optic Scramble",
      },
    },
  })
);

// 2. Persona of the Grifter
write(
  "src/features/agent/personas/persona-grifter.json",
  createFeat({
    id: "PersOfGrifter001",
    name: "Persona of the Grifter",
    img: "icons/skills/social/diplomacy-handshake-yellow.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency in Deception and Persuasion. You add half your Wisdom modifier (minimum of +1) to any check you make with either skill.</p>
<p><strong>Active Burn:</strong> As an <strong>Action</strong>, you project a hard-light disguise for <strong>1 hour</strong>, perfectly mimicking the clothing, physical appearance, and voiceprint of a humanoid creature you have observed within the last 24 hours.</p>`,
    activities: {
      actBurnGrifter01: {
        _id: "actBurnGrifter01",
        type: "utility",
        activation: { type: "action", value: 1 },
        duration: { value: "1", units: "hour" },
        name: "Active Burn: Hard-Light Disguise",
      },
    },
  })
);

// 3. Persona of the Contender
write(
  "src/features/agent/personas/persona-contender.json",
  createFeat({
    id: "PersOfContend001",
    name: "Persona of the Contender",
    img: "icons/skills/melee/unarmed-punch-fist-yellow.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency with Medium Armor, and your Unarmed Strikes deal <strong>1d6 kinetic damage</strong> and have the Finesse property.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you harden your subdermal frame for <strong>1 minute</strong>: you gain temporary hit points equal to your <strong>Agent level + your Wisdom modifier</strong>, and you have Advantage on checks made to grapple, shove, or resist forced movement.</p>`,
    activities: {
      actBurnContender: {
        _id: "actBurnContender",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: Subdermal Reinforcement",
      },
    },
  })
);

// 4. Persona of the Responder
write(
  "src/features/agent/personas/persona-responder.json",
  createFeat({
    id: "PersOfRespond001",
    name: "Persona of the Responder",
    img: "icons/magic/life/cross-worn-green.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency in Medicine and Insight. You can use a Hacker's Kit or Security Kit to stabilize a dying creature without needing a medkit.</p>
<p><strong>Active Burn:</strong> When an ally within <strong>30 feet</strong> takes damage, you can use your <strong>Reaction</strong> to project a defensive nanite shield, granting that ally Resistance to that damage instance and increasing its walking speed by 10 feet until the end of its next turn.</p>`,
    activities: {
      actBurnResponder: {
        _id: "actBurnResponder",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When an ally within 30 ft takes damage" },
        range: { value: "30", units: "ft" },
        name: "Active Burn: Nanite Shield Reaction",
      },
    },
  })
);

// 5. Persona of the Slicer
write(
  "src/features/agent/personas/persona-slicer.json",
  createFeat({
    id: "PersOfSlicer0001",
    name: "Persona of the Slicer",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency in Technology and Hacker's Kits. You can interface wirelessly with electronic terminals, keycard doors, and computer nodes within 15 feet.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you broadcast an active telemetry jammer for <strong>1 minute</strong>. Construct and cybernetic enemies within 30 feet have Disadvantage on Perception checks to detect you, and your weapon attacks deal an extra <strong>1d6 ion damage</strong> to synthetic and droid targets.</p>`,
    activities: {
      actBurnSlicer001: {
        _id: "actBurnSlicer001",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: Telemetry Jammer",
      },
    },
  })
);

// 6. Persona of the Scout
write(
  "src/features/agent/personas/persona-scout.json",
  createFeat({
    id: "PersOfScout00001",
    name: "Persona of the Scout",
    img: "icons/tools/navigation/binoculars-leather-brass.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency in Perception and Survival. You cannot be surprised while conscious, and traveling stealthily does not reduce your travel pace.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you activate your high-spectrum reconnaissance HUD for <strong>1 minute</strong>, gaining <strong>Blindsight out to 15 feet</strong> and ignoring Disadvantage on attack rolls caused by light or heavy obscurement.</p>`,
    activities: {
      actBurnScout0001: {
        _id: "actBurnScout0001",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: High-Spectrum HUD",
      },
    },
  })
);

// 7. Persona of the Contractor
write(
  "src/features/agent/personas/persona-contractor.json",
  createFeat({
    id: "PersOfContract01",
    name: "Persona of the Contractor",
    img: "icons/skills/combat/weapons-crossed-swords-yellow.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You adopt one Fighting Style of your choice from Chapter 6.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you engage predictive ballistic computations for <strong>1 minute</strong>. You can stow or draw weapons freely on your turn, and weapon attacks you make utilizing your chosen Fighting Style add your <strong>Wisdom modifier</strong> to their damage rolls.</p>`,
    activities: {
      actBurnContract: {
        _id: "actBurnContract",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: Predictive Ballistics",
      },
    },
  })
);

// 8. Persona of the Saboteur
write(
  "src/features/agent/personas/persona-saboteur.json",
  createFeat({
    id: "PersOfSaboteur01",
    name: "Persona of the Saboteur",
    img: "icons/weapons/ammunition/mine-grenade-spiked.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> You gain proficiency with Demolitions Kits and Sleight of Hand. You have Advantage on saving throws against traps, environmental hazards, and explosive area-of-effect abilities.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you toss a proximity mine to an unoccupied space within <strong>20 feet</strong>. The mine arms immediately. When a hostile creature moves within 5 feet of it, the mine detonates: each creature within a 10-foot radius must make a Dexterity saving throw against your Nanoprogram Save DC, taking <strong>2d8 energy damage</strong> and being <strong>Stunned until the start of its next turn</strong> on a failure, or half damage and no stun on a success.</p>`,
    activities: {
      actBurnSaboteur1: {
        _id: "actBurnSaboteur1",
        type: "save",
        activation: { type: "bonus", value: 1 },
        range: { value: "20", units: "ft" },
        target: { template: { type: "radius", size: "10", units: "ft" } },
        save: { ability: ["dex"], dc: { calculation: "wis", formula: "" } },
        damage: { parts: [{ custom: { enabled: true, formula: "2d8" }, types: ["energy"] }] },
        name: "Active Burn: Proximity Mine",
      },
    },
  })
);

// 9. Persona of the Courier
write(
  "src/features/agent/personas/persona-courier.json",
  createFeat({
    id: "PersOfCourier001",
    name: "Persona of the Courier",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    requirements: "Agent 2",
    subtype: "persona",
    description: `<p><strong>Passive Alias:</strong> Your walking speed increases by <strong>10 feet</strong>, and you gain proficiency in Piloting and Land Vehicles.</p>
<p><strong>Active Burn:</strong> As a <strong>Bonus Action</strong>, you engage a locomotive overclock for <strong>1 minute</strong>. You can take the <strong>Dash or Disengage action as a Bonus Action</strong> on each of your turns, and your jump distance is tripled.</p>`,
    activities: {
      actBurnCourier01: {
        _id: "actBurnCourier01",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "1", units: "minute" },
        name: "Active Burn: Locomotive Overclock",
      },
    },
  })
);

/* ================================================================== */
/*  3. Agent Class Document (src/classes/agent.json)                  */
/* ================================================================== */

write("src/classes/agent.json", {
  _id: "AgentClass000001",
  name: "Agent",
  type: "class",
  img: "icons/skills/targeting/crosshair-pointed-red.webp",
  system: {
    description: {
      value: `<p>Operatives of shadow, corporate espionage, and long-range assassination, Agents manipulate identities, sociometrics, and tactical telemetry. Armed with emulation decks and modular operative personas, an Agent executes clandestine objectives with lethal mathematical precision.</p>`,
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "agent",
    levels: 1,
    hd: {
      denomination: 8,
      spent: 0,
      additional: "",
    },
    primaryAbility: {
      value: ["dex", "wis"],
      all: false,
    },
    spellcasting: {
      progression: "artificer",
      ability: "wis",
    },
    advancement: [
      /* ── Hit Points (d8) ── */
      {
        _id: "advAgtHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },

      /* ── Saves: DEX, INT ── */
      {
        _id: "advAgtSavesPrf01",
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

      /* ── Armor: Light ── */
      {
        _id: "advAgtArmorPrf01",
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

      /* ── Weapons: Simple, Sniper Rifles, Blaster Carbines, Sidearms, Vibroblades ── */
      {
        _id: "advAgtWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [
            "weapons:sim",
            "weapons:sniper-rifle",
            "weapons:blaster-carbine",
            "weapons:sidearm",
            "weapons:vibroblade",
          ],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },

      /* ── Skills: Choice of 3 from list ── */
      {
        _id: "advAgtSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 3,
              pool: [
                "skills:acr",
                "skills:dec",
                "skills:ins",
                "skills:inv",
                "skills:prc",
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

      /* ── ScaleValue: Sneak Attack Dice ── */
      {
        _id: "advAgtScSnkAtk01",
        type: "ScaleValue",
        configuration: {
          identifier: "sneak-attack",
          type: "dice",
          scale: {
            1: { number: 1, faces: 6 },
            5: { number: 2, faces: 6 },
            11: { number: 3, faces: 6 },
            17: { number: 4, faces: 6 },
          },
        },
        value: {},
        level: 1,
        title: "Sneak Attack",
      },

      /* ── ScaleValue: Nanopool Points (3 at L1 to 60 at L20) ── */
      {
        _id: "advAgtScNanopl01",
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

      /* ── ScaleValue: Personas Known (2 at L2 to 10 at L19) ── */
      {
        _id: "advAgtScPersKn01",
        type: "ScaleValue",
        configuration: {
          identifier: "personas-known",
          type: "number",
          scale: {
            2: { value: 2 },
            4: { value: 3 },
            6: { value: 4 },
            8: { value: 5 },
            10: { value: 6 },
            12: { value: 7 },
            14: { value: 8 },
            16: { value: 8 },
            17: { value: 9 },
            19: { value: 10 },
          },
        },
        value: {},
        level: 2,
        title: "Personas Known",
      },

      /* ── ScaleValue: Execute Threshold (2 * Agent level) ── */
      {
        _id: "advAgtScExecThr1",
        type: "ScaleValue",
        configuration: {
          identifier: "execute-threshold",
          type: "number",
          formula: "2 * @classes.agent.levels",
          scale: {
            5: { value: 10, formula: "2 * @classes.agent.levels" },
          },
        },
        value: {},
        level: 5,
        title: "Execute Threshold",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Jack of All Trades, Socio-Metrics, Covert Ops, Sneak Attack) ── */
      {
        _id: "advAgtItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtNanoProg00001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtJackTrades001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtSocioMetric01", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtCovertOps0001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtSneakAttack01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Agent Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (False Profession, Operative Personas) ── */
      {
        _id: "advAgtItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtFalseProf0001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtOperPersonas1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Agent Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Covert Agency") ── */
      {
        _id: "advAgtSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Covert Agency",
      },

      /* ── ItemGrant: Level 3 (Steady Aim) ── */
      {
        _id: "advAgtItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtSteadyAim0001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Agent Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advAgtASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Total Concentration) ── */
      {
        _id: "advAgtItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtTotalConcen01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Agent Features (Level 5)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advAgtASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 9 (Improved False Profession) ── */
      {
        _id: "advAgtItmGrLvl09",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtImpFalsePrf01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 9,
        title: "Agent Features (Level 9)",
      },

      /* ── ItemGrant: Level 11 (Between the Eyes) ── */
      {
        _id: "advAgtItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtBetweenEyes01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Agent Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advAgtASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advAgtASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advAgtASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Perfect Alias) ── */
      {
        _id: "advAgtItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AgtPerfectAlias1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Agent Features (Level 20)",
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
  _key: "!items!AgentClass000001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Agent build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
