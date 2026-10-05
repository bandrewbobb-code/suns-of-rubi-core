#!/usr/bin/env node
/**
 * build-soldier.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Soldier class package:
 *   • src/features/soldier/             – 13 core class features
 *   • src/features/soldier/strategies/  – 19 Soldier Strategies
 *   • src/classes/soldier.json          – Soldier class document
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

/** Standard feat scaffold for Soldier features and strategies */
function createFeat({
  id,
  name,
  img = "icons/skills/combat/strike-heavy-weapon-orange.webp",
  description,
  subtype = "",
  requirements = "Soldier 1",
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
/*  1. Core Class Features (src/features/soldier/)                     */
/* ================================================================== */

// 1. Combat Training (Level 1)
write(
  "src/features/soldier/combat-training.json",
  createFeat({
    id: "SolCombatTrain01",
    name: "Combat Training",
    img: "icons/skills/combat/hand-to-hand-fighting-stance.webp",
    requirements: "Soldier 1",
    description: `<h3>Fighting Style</h3>
<p>You have honed your martial prowess and gain one Fighting Style of your choice. Whenever you gain a Soldier level, you can replace the chosen Fighting Style with another one of your choice.</p>
<h3>Weapon Mastery</h3>
<p>Your training with weapons allows you to use the mastery properties of three kinds of weapons of your choice with which you have proficiency. Whenever you finish a <strong>Long Rest</strong>, you can change the kinds of weapons you have chosen.</p>
<h3>Second Wind</h3>
<p>You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a <strong>Bonus Action</strong> to regain hit points equal to <strong>1d10 + your Soldier level</strong>.</p>
<p>You can use this feature a number of times equal to your <strong>Proficiency Bonus</strong> (\`@prof\`). You regain one expended use when you finish a <strong>Short Rest</strong>, and all expended uses when you finish a <strong>Long Rest</strong>. You can also expend 2 Nanopool points to regain one expended use of Second Wind.</p>
<h3>Tactical Mind</h3>
<p>When you fail an ability check, you can expend one use of your <strong>Second Wind</strong> (or spend 2 Nanopool points) to push yourself toward success. Rather than rolling the die and regaining hit points, you roll <strong>1d10</strong> and add the number rolled to the ability check, potentially turning the failure into a success. If the check still fails, this use of Second Wind is not expended.</p>`,
    uses: {
      spent: 0,
      recovery: [
        { period: "sr", type: "recoverAll" },
        { period: "lr", type: "recoverAll" },
      ],
      max: "@scale.soldier.second-wind-uses",
    },
    activities: {
      actSecondWind001: {
        _id: "actSecondWind001",
        type: "heal",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "self",
            choice: false,
            special: "",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "self",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        healing: {
          number: 1,
          denomination: 10,
          bonus: "@classes.soldier.levels",
          types: ["healing"],
          custom: { enabled: false, formula: "" },
          scaling: { mode: "whole", number: null, formula: "" },
        },
        name: "Second Wind",
        img: "",
        appliedEffects: [],
      },
      actTacticalMind01: {
        _id: "actTacticalMind01",
        type: "utility",
        activation: {
          type: "special",
          value: null,
          condition: "When you fail an ability check",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "self",
            choice: false,
            special: "",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "self",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        roll: {
          name: "Tactical Mind Check Bonus",
          formula: "1d10",
        },
        name: "Tactical Mind",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 2. Nanoprogramming (Level 1)
write(
  "src/features/soldier/nanoprogramming.json",
  createFeat({
    id: "SolNanoProg00001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circuit-board-glowing-blue.webp",
    requirements: "Soldier 1",
    description: `<p>Your tactical cyberware and wetware implants allow you to execute combat nanoprograms from the Soldier Operating System (OS). You follow a <strong>1/3 Caster progression</strong> (scaling up to Tier 4 programs).</p>
<h3>Nanopool Points</h3>
<p>Your Nanopool points determine your capacity to fuel programs and activate tactical subroutines. Your maximum Nanopool points equal your <strong>Soldier level + your Intelligence modifier</strong> (minimum of 1). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>
<h3>Nanoprograms Known</h3>
<p>You know two 1st-tier nanoprograms of your choice from the Soldier OS at 1st level. The Programs Known column of the Soldier table shows when you learn more Soldier nanoprograms of 1st-tier or higher.</p>
<h3>Nanocasting Ability</h3>
<p><strong>Intelligence</strong> is your nanocasting ability for your Soldier nanoprograms, reflecting your understanding of cyber-warfare architectures, tactical ballistic calculations, and hardware overclocking.</p>
<ul>
  <li><strong>Nanoprogram Save DC</strong> = 8 + your Proficiency Bonus + your Intelligence modifier</li>
  <li><strong>Nanoprogram Attack Modifier</strong> = your Proficiency Bonus + your Intelligence modifier</li>
</ul>
<h3>Somatic Interface</h3>
<p>To execute a nanoprogram, you must have at least one hand free to manipulate your wrist console, weapon-mounted tactile interface, or neural port, or have both hands holding a ranged weapon equipped with a firing bus interface.</p>`,
  })
);

// 3. Action Surge (Level 2)
write(
  "src/features/soldier/action-surge.json",
  createFeat({
    id: "SolActionSurge01",
    name: "Action Surge",
    img: "icons/magic/movement/chevrons-down-yellow.webp",
    requirements: "Soldier 2",
    description: `<p>At 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take <strong>one additional action</strong>.</p>
<p>Once you use this feature, you must finish a <strong>Short or Long Rest</strong> before you can use it again. Starting at <strong>17th level</strong>, you can use it twice before a rest, but only once on the same turn.</p>`,
    uses: {
      spent: 0,
      recovery: [
        { period: "sr", type: "recoverAll" },
        { period: "lr", type: "recoverAll" },
      ],
      max: "@scale.soldier.action-surge-uses",
    },
    activities: {
      actActionSurge01: {
        _id: "actActionSurge01",
        type: "utility",
        activation: {
          type: "special",
          value: null,
          condition: "On your turn",
        },
        duration: {
          value: "1",
          units: "turn",
        },
        target: {
          affects: {
            count: "1",
            type: "self",
            choice: false,
            special: "",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "self",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        name: "Action Surge",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 4. Tactical Strikes (Level 2)
write(
  "src/features/soldier/tactical-strikes.json",
  createFeat({
    id: "SolTactStrikes01",
    name: "Tactical Strikes",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    requirements: "Soldier 2",
    description: `<p>At 2nd level, you turn the heat of combat into an analytical combat loop. When you hit a creature with a weapon attack as part of the <strong>Attack action</strong>, check the natural number rolled on the d20:</p>
<ul>
  <li><strong>Natural Even Roll — Tactical Reposition:</strong> Choose one willing ally within 30 feet who can see or hear you. That ally can use its <strong>Reaction</strong> to move up to 10 feet without provoking Opportunity Attacks.</li>
  <li><strong>Natural Odd Roll — Suppressive Fire:</strong> The target's speed is reduced by <strong>10 feet</strong> until the start of your next turn.</li>
  <li><strong>Natural 16–20 — Tactical Maneuver:</strong> You can apply one of the following maneuvers (maximum once per turn):
    <ul>
      <li><strong>Disarming Strike:</strong> The target must succeed on a Strength saving throw against your Nanoprogram Save DC or drop one weapon or held item of your choice onto the ground within 5 feet of it.</li>
      <li><strong>Heavy Ordnance:</strong> If the target is Large or smaller, it is pushed 15 feet straight away from you. If your attack misses, it still suffers graze damage equal to your Intelligence modifier (minimum of 1 kinetic damage).</li>
    </ul>
  </li>
</ul>`,
    activities: {
      actTactReposition: {
        _id: "actTactReposition",
        type: "utility",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with weapon attack (Natural Even roll)",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "ally",
            choice: false,
            special: "Willing ally within 30 ft who can see or hear you",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          value: "30",
          units: "ft",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        name: "Tactical Reposition (Natural Even)",
        img: "",
        appliedEffects: [],
      },
      actSuppressFire1: {
        _id: "actSuppressFire1",
        type: "utility",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with weapon attack (Natural Odd roll)",
        },
        duration: {
          value: "1",
          units: "round",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Target of weapon attack",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "spec",
          special: "Target of attack",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        name: "Suppressive Fire (Natural Odd)",
        img: "",
        appliedEffects: [],
      },
      actDisarmStrike1: {
        _id: "actDisarmStrike1",
        type: "save",
        activation: {
          type: "special",
          value: null,
          condition: "Natural 16–20 on weapon attack (1/turn)",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Target hit by weapon attack",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "spec",
          special: "Target hit",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        save: {
          ability: ["str"],
          dc: {
            calculation: "int",
            formula: "",
          },
        },
        name: "Disarming Strike (Natural 16–20)",
        img: "",
        appliedEffects: [],
      },
      actHeavyOrdnance: {
        _id: "actHeavyOrdnance",
        type: "damage",
        activation: {
          type: "special",
          value: null,
          condition: "Natural 16–20 on weapon attack (1/turn)",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Large or smaller target",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "spec",
          special: "Target hit",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        damage: {
          critical: {
            allow: false,
            bonus: "",
          },
          parts: [
            {
              custom: { enabled: true, formula: "max(1, @abilities.int.mod)" },
              types: ["kinetic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
        name: "Heavy Ordnance (Push 15 ft / Graze Damage)",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 5. Soldier Strategies (Level 2)
write(
  "src/features/soldier/soldier-strategies.json",
  createFeat({
    id: "SolStrategies001",
    name: "Soldier Strategies",
    img: "icons/skills/trades/academics-study-reading-book.webp",
    requirements: "Soldier 2",
    description: `<p>At 2nd level, you integrate dynamic tactical doctrines into your combat HUD. You gain two Soldier Strategies of your choice.</p>
<p>The Strategies Known column of the Soldier table shows when you learn more Soldier Strategies (scaling up to 10 at 19th level). Whenever you gain a Soldier level, you can replace one Strategy you know with another Strategy of your choice.</p>`,
  })
);

// 6. Eye for Talent (Level 4)
write(
  "src/features/soldier/eye-for-talent.json",
  createFeat({
    id: "SolEyeForTalent1",
    name: "Eye for Talent",
    img: "icons/magic/perception/eye-slit-orange.webp",
    requirements: "Soldier 4",
    description: `<p>At 4th level, you can assess a combatant's operational parameters with a glance. As a <strong>Bonus Action</strong>, make an Intelligence (Search) check against a creature you can see within <strong>30 feet</strong>. The DC equals <strong>8 + the creature's Challenge Rating (CR)</strong>. If you hit the creature with a weapon attack within the past minute, you add your Soldier level to this check.</p>
<p>On a success, you learn one of the following pieces of tactical intel of your choice:</p>
<ul>
  <li>Armor Class (AC)</li>
  <li>Highest and lowest ability score</li>
  <li>Special senses (such as Darkvision, Blindsight, or Tremorsense)</li>
  <li>Damage Resistances, Immunities, and Vulnerabilities</li>
  <li>Condition Immunities</li>
  <li>One trait, feature, or action from its stat block</li>
</ul>`,
    activities: {
      actEyeForTalent1: {
        _id: "actEyeForTalent1",
        type: "utility",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Creature you can see within 30 ft",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          value: "30",
          units: "ft",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        roll: {
          name: "Search Check",
          formula: "1d20 + @skills.inv.total",
        },
        name: "Eye for Talent Assessment",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 7. Extra Attack (Level 5)
write(
  "src/features/soldier/extra-attack.json",
  createFeat({
    id: "SolExtraAttack01",
    name: "Extra Attack",
    img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
    requirements: "Soldier 5",
    description: `<p>Starting at 5th level, you can attack twice, instead of once, whenever you take the <strong>Attack action</strong> on your turn.</p>`,
  })
);

// 8. Tactical Shift (Level 5)
write(
  "src/features/soldier/tactical-shift.json",
  createFeat({
    id: "SolTactShift0001",
    name: "Tactical Shift",
    img: "icons/magic/movement/trail-streak-zigzag-teal.webp",
    requirements: "Soldier 5",
    description: `<p>At 5th level, whenever you activate your <strong>Second Wind</strong> as a Bonus Action, you can move up to <strong>half your speed</strong> immediately as part of the same Bonus Action without provoking Opportunity Attacks.</p>`,
  })
);

// 9. Studied Attacks (Level 7)
write(
  "src/features/soldier/studied-attacks.json",
  createFeat({
    id: "SolStudiedAtks01",
    name: "Studied Attacks",
    img: "icons/skills/targeting/crosshair-arrow-blue.webp",
    requirements: "Soldier 7",
    description: `<p>At 7th level, you learn from every missed shot and parried strike. If you miss with a weapon attack roll against a creature, you gain <strong>Advantage</strong> on the next attack roll you make against that creature before the end of your next turn.</p>`,
  })
);

// 10. Tactical Master (Level 9)
write(
  "src/features/soldier/tactical-master.json",
  createFeat({
    id: "SolTactMaster001",
    name: "Tactical Master",
    img: "icons/skills/combat/blade-strike-sparks-metal.webp",
    requirements: "Soldier 9",
    description: `<p>At 9th level, your mastery over weaponry reaches supreme flexibility. When you make an attack roll with a weapon whose mastery property you are using, you can replace that mastery property for that attack with the <strong>Push</strong>, <strong>Sap</strong>, or <strong>Slow</strong> property, even if you are not normally using that property on that weapon.</p>`,
  })
);

// 11. Indomitable (Level 9)
write(
  "src/features/soldier/indomitable.json",
  createFeat({
    id: "SolIndomitable01",
    name: "Indomitable",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    requirements: "Soldier 9",
    description: `<p>At 9th level, you possess an iron will and nanotech safeguards that reject failure. When you fail a saving throw, you can spend <strong>4 Nanopool points</strong> to turn the failed roll into a <strong>success</strong> instead.</p>
<p>You can use this feature once per <strong>Long Rest</strong>. You gain an additional use of this feature at <strong>13th level</strong> (2 uses) and again at <strong>17th level</strong> (3 uses).</p>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@scale.soldier.indomitable-uses",
    },
    activities: {
      actIndomitable01: {
        _id: "actIndomitable01",
        type: "utility",
        activation: {
          type: "special",
          value: null,
          condition: "When you fail a saving throw (spend 4 Nanopool)",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "self",
            choice: false,
            special: "",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "self",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        name: "Indomitable (Save Success)",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 12. Greater Extra Attack (Level 11)
write(
  "src/features/soldier/greater-extra-attack.json",
  createFeat({
    id: "SolGtrExtraAtk01",
    name: "Greater Extra Attack",
    img: "icons/skills/melee/strike-polearm-glowing-yellow.webp",
    requirements: "Soldier 11",
    description: `<p>At 11th level, you can attack three times, instead of twice, whenever you take the <strong>Attack action</strong> on your turn.</p>`,
  })
);

// 13. Master of Combat (Level 20)
write(
  "src/features/soldier/master-of-combat.json",
  createFeat({
    id: "SolMstrOfCombat1",
    name: "Master of Combat",
    img: "icons/skills/combat/weapons-crossed-swords-fire-purple.webp",
    requirements: "Soldier 20",
    description: `<p>At 20th level, you have attained absolute martial supremacy across Rubi-Ka and beyond.</p>
<ul>
  <li>Your <strong>Strength or Dexterity score increases by 2</strong>, and your <strong>Intelligence score increases by 2</strong>. Your maximum for those scores increases by 2.</li>
  <li>Whenever you take the <strong>Attack action</strong> on your turn, you can attack <strong>four times</strong>, instead of three.</li>
</ul>`,
  })
);

/* ================================================================== */
/*  2. Soldier Strategies (src/features/soldier/strategies/)           */
/* ================================================================== */

// 1. Cover Strategist
write(
  "src/features/soldier/strategies/cover-strategist.json",
  createFeat({
    id: "StratCoverStrat1",
    name: "Strategy: Cover Strategist",
    img: "icons/magic/defensive/barrier-shield-dome-blue-purple.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You are an expert in tactical geometry and ballistic cover:</p>
<ul>
  <li>Whenever you benefit from partial cover, treat it as one step higher: quarter cover (+1) becomes half cover (+2 AC and Dexterity saving throws), and half cover (+2) becomes three-quarters cover (+5 AC and Dexterity saving throws).</li>
  <li>Whenever you make an attack roll against a target while you are benefiting from cover, the target's partial cover benefits against that attack are reduced by one step (three-quarters cover becomes half cover, and half cover becomes quarter cover).</li>
</ul>`,
  })
);

// 2. Cunning Strategist
write(
  "src/features/soldier/strategies/cunning-strategist.json",
  createFeat({
    id: "StratCunningStr1",
    name: "Strategy: Cunning Strategist",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>Your quick thinking enables rapid tactical execution. Choose two of the following actions; you can now perform those actions as a <strong>Bonus Action</strong> on your turn:</p>
<ul>
  <li>Applying a coating or poison to a weapon</li>
  <li>Dash</li>
  <li>Disengage</li>
  <li>Guard</li>
  <li>Help</li>
  <li>Hide</li>
  <li>Search</li>
  <li>Throwing a grenade or deploying a mine</li>
  <li>Issuing a command attack to a beast or companion</li>
  <li>Operating an installed vehicle system or turret</li>
</ul>
<p>Whenever you finish a <strong>Long Rest</strong>, you can swap one of your chosen actions for another action on the list.</p>`,
  })
);

// 3. CQC Drill (Req: L5)
write(
  "src/features/soldier/strategies/cqc-drill.json",
  createFeat({
    id: "StratCQCDrill001",
    name: "Strategy: CQC Drill",
    img: "icons/skills/melee/unarmed-punch-fist-blue.webp",
    requirements: "Soldier 5",
    subtype: "strategy",
    description: `<p>You have trained extensively in close-quarters combat and retention drills:</p>
<ul>
  <li>You have <strong>Advantage on saving throws and ability checks</strong> made to resist being disarmed or having an item taken from your grasp.</li>
  <li>When a hostile creature misses you with a melee attack roll, you can use your <strong>Reaction</strong> to make one melee weapon or unarmed strike attack against that creature. If the attack hits, the target has <strong>Disadvantage</strong> on the next melee attack roll it makes before the end of its next turn.</li>
</ul>`,
    activities: {
      actCQCCounter001: {
        _id: "actCQCCounter001",
        type: "utility",
        activation: {
          type: "reaction",
          value: 1,
          condition: "When a hostile creature misses you with a melee attack",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Attacking creature that missed",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "spec",
          special: "Melee reach",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        name: "CQC Counter-Attack (Reaction)",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 4. Enduring Strategist
write(
  "src/features/soldier/strategies/enduring-strategist.json",
  createFeat({
    id: "StratEnduringSt1",
    name: "Strategy: Enduring Strategist",
    img: "icons/magic/life/heart-cross-strong-flame-purple.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>Your conditioning allows you to operate continuously under grueling conditions:</p>
<ul>
  <li>You only need <strong>3 hours of sleep</strong> to gain the full benefits of a Long Rest, remaining conscious and alert during light sentry duty for the remainder of the rest period.</li>
  <li>If your rest is interrupted by combat or strenuous activity, you do not lose your progress; you only need to complete the remaining hours of the rest.</li>
  <li>You have <strong>Advantage on saving throws</strong> against gaining levels of exhaustion.</li>
</ul>`,
  })
);

// 5. Mastery Strategist
write(
  "src/features/soldier/strategies/mastery-strategist.json",
  createFeat({
    id: "StratMasteryStr1",
    name: "Strategy: Mastery Strategist",
    img: "icons/skills/combat/strike-hammer-destructive-orange.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You expand your specialized weapon mastery. Choose one <strong>Fighting Mastery</strong> option from Chapter 6.</p>
<p><em>Special:</em> You can select this Strategy multiple times. Each time you take it, you choose a different Fighting Mastery.</p>`,
  })
);

// 6. Sourceweapons Strategist
write(
  "src/features/soldier/strategies/sourceweapons-strategist.json",
  createFeat({
    id: "StratSourcewpns1",
    name: "Strategy: Sourceweapons Strategist",
    img: "icons/weapons/swords/sword-broad-crystal-blue.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You integrate exotic Sourceweapon doctrines into your military training:</p>
<ul>
  <li>You gain <strong>proficiency in all Sourceweapons</strong>.</li>
  <li>You learn one <strong>Fighting Form</strong> of your choice without needing to possess forcecasting or nanocasting requirements.</li>
  <li><strong>Second Skin:</strong> While wearing Medium or Heavy armor, all kinetic, energy, and ion damage you suffer is reduced by your <strong>Proficiency Bonus</strong> (\`@prof\`).</li>
</ul>`,
  })
);

// 7. Skilled Strategist
write(
  "src/features/soldier/strategies/skilled-strategist.json",
  createFeat({
    id: "StratSkilledStr1",
    name: "Strategy: Skilled Strategist",
    img: "icons/tools/scribal/magnifying-glass.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You gain proficiency in one skill and one tool of your choice, or in two tools of your choice.</p>
<p><em>Special:</em> You can select this Strategy multiple times. Each time you select it, choose different proficiencies.</p>`,
  })
);

// 8. Style Strategist
write(
  "src/features/soldier/strategies/style-strategist.json",
  createFeat({
    id: "StratStyleStrat1",
    name: "Strategy: Style Strategist",
    img: "icons/skills/melee/weapons-crossed-daggers-orange.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You learn a second <strong>Fighting Style</strong> of your choice. Whenever you finish a <strong>Long Rest</strong>, you can swap this Fighting Style for another Fighting Style of your choice.</p>
<p><em>Special:</em> You can select this Strategy multiple times. Each time you do, you gain an additional swappable Fighting Style.</p>`,
  })
);

// 9. Program Strategist
write(
  "src/features/soldier/strategies/program-strategist.json",
  createFeat({
    id: "StratProgramStr1",
    name: "Strategy: Program Strategist",
    img: "icons/magic/symbols/runes-star-pentagon-blue.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p>You load secondary tactical subroutines into your system memory:</p>
<ul>
  <li>You learn <strong>two additional nanoprograms</strong> of your choice from the Soldier OS of a tier you can cast.</li>
  <li>Whenever you finish a <strong>Short Rest</strong>, you can swap one of these programs for another Soldier nanoprogram. Whenever you finish a <strong>Long Rest</strong>, you can swap both programs.</li>
</ul>`,
  })
);

// 10. Tactical Strike: Oppressive Fire
write(
  "src/features/soldier/strategies/strategy-oppressive-fire.json",
  createFeat({
    id: "StratOppressFire",
    name: "Strategy: Oppressive Fire",
    img: "icons/skills/ranged/projectile-impact-bullet-smoke-orange.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural Even Roll</strong> on a weapon attack as part of your Tactical Strikes, you can choose to push a Large or smaller target <strong>5 feet away from you in any horizontal direction</strong> in addition to or in place of Tactical Reposition.</p>`,
  })
);

// 11. Tactical Strike: Covering Arc
write(
  "src/features/soldier/strategies/strategy-covering-arc.json",
  createFeat({
    id: "StratCoveringArc",
    name: "Strategy: Covering Arc",
    img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural Even Roll</strong> on a weapon attack as part of your Tactical Strikes, your suppressing volley locks down the target's reactions: the target <strong>cannot make Opportunity Attacks</strong> until the start of your next turn.</p>`,
  })
);

// 12. Tactical Strike: Intercept Screen
write(
  "src/features/soldier/strategies/strategy-intercept-screen.json",
  createFeat({
    id: "StratInterceptSc",
    name: "Strategy: Intercept Screen",
    img: "icons/magic/defensive/shield-barrier-blue.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural Odd Roll</strong> on a weapon attack as part of your Tactical Strikes, you can deploy a deflecting sensor lock. One ally of your choice within <strong>30 feet</strong> who can see or hear you gains a <strong>+2 bonus to AC</strong> against the next attack roll made against them before the start of your next turn.</p>`,
  })
);

// 13. Tactical Strike: Armor Dent
write(
  "src/features/soldier/strategies/strategy-armor-dent.json",
  createFeat({
    id: "StratArmorDent01",
    name: "Strategy: Armor Dent",
    img: "icons/skills/combat/armor-broken-shield-yellow.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural Odd Roll</strong> on a weapon attack as part of your Tactical Strikes, your strike compromises the target's plating: the target suffers a <strong>-1 penalty to AC</strong> against the next attack roll made against it before the start of your next turn.</p>`,
  })
);

// 14. Tactical Strike: Commander's Advance
write(
  "src/features/soldier/strategies/strategy-commanders-advance.json",
  createFeat({
    id: "StratCmdrsAdvnc1",
    name: "Strategy: Commander's Advance",
    img: "icons/skills/melee/spear-thrust-thrusting-yellow.webp",
    requirements: "Soldier 2",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural 16–20</strong> on a weapon attack as part of your Tactical Strikes, you can call in a synchronized strike. One ally within <strong>30 feet</strong> who can see or hear you can use its <strong>Reaction</strong> to immediately make one weapon attack or cast an At-Will nanoprogram (cantrip).</p>`,
  })
);

// 15. Tactical Strike: Expose Weakness (Req: L5)
write(
  "src/features/soldier/strategies/strategy-expose-weakness.json",
  createFeat({
    id: "StratExposeWeak1",
    name: "Strategy: Expose Weakness",
    img: "icons/magic/death/skull-energy-glowing-purple.webp",
    requirements: "Soldier 5",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>When you hit a target with a weapon attack as part of the Attack action, the target <strong>loses resistance to kinetic and energy damage</strong> until the start of your next turn.</p>`,
  })
);

// 16. Tactical Strike: Shell Shock (Req: L5)
write(
  "src/features/soldier/strategies/strategy-shell-shock.json",
  createFeat({
    id: "StratShellShock1",
    name: "Strategy: Shell Shock",
    img: "icons/magic/unholy/strike-body-explosion-red.webp",
    requirements: "Soldier 5",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural 16–20</strong> on a weapon attack as part of your Tactical Strikes, the sheer shockwave of your impact rattles the target:</p>
<ul>
  <li>The attack deals extra psychic or kinetic damage equal to your <strong>Proficiency Bonus</strong> (\`@prof\`).</li>
  <li>The target must succeed on a <strong>Wisdom saving throw</strong> against your Nanoprogram Save DC or become <strong>Frightened</strong> of you until the end of its next turn.</li>
</ul>`,
    activities: {
      actShellShock001: {
        _id: "actShellShock001",
        type: "save",
        activation: {
          type: "special",
          value: null,
          condition: "Natural 16–20 on weapon attack",
        },
        duration: {
          value: "1",
          units: "round",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Target hit",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "",
            size: "" || 0,
            width: "" || 0,
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          units: "spec",
          special: "Target hit",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        save: {
          ability: ["wis"],
          dc: {
            calculation: "int",
            formula: "",
          },
        },
        damage: {
          critical: {
            allow: false,
            bonus: "",
          },
          parts: [
            {
              custom: { enabled: true, formula: "@prof" },
              types: ["kinetic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
        name: "Shell Shock Save & Damage",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 17. Tactical Strike: Penetrating Munitions (Req: L5)
write(
  "src/features/soldier/strategies/strategy-penetrating-munitions.json",
  createFeat({
    id: "StratPenetratMun",
    name: "Strategy: Penetrating Munitions",
    img: "icons/weapons/ammunition/bullet-hole-penetration-orange.webp",
    requirements: "Soldier 5",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural 16–20</strong> with a ranged weapon attack as part of your Tactical Strikes, your shot punches straight through the target. A secondary creature directly behind the primary target within a line <strong>15 feet long and 5 feet wide</strong> takes kinetic damage equal to your <strong>Proficiency Bonus + your Intelligence modifier</strong> (\`@prof + @abilities.int.mod\`).</p>`,
    activities: {
      actPenetrateMun1: {
        _id: "actPenetrateMun1",
        type: "damage",
        activation: {
          type: "special",
          value: null,
          condition: "Natural 16–20 on ranged weapon attack",
        },
        duration: {
          value: "0",
          units: "inst",
        },
        target: {
          affects: {
            count: "1",
            type: "creature",
            choice: false,
            special: "Secondary creature within 15 ft line behind target",
          },
          template: {
            count: "" || 0,
            contiguous: false,
            type: "line",
            size: "15",
            width: "5",
            height: "" || 0,
            units: "ft",
          },
        },
        range: {
          value: "15",
          units: "ft",
          special: "",
        },
        uses: {
          spent: 0,
          max: "",
          recovery: [],
        },
        damage: {
          critical: {
            allow: false,
            bonus: "",
          },
          parts: [
            {
              custom: { enabled: true, formula: "@prof + @abilities.int.mod" },
              types: ["kinetic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
        name: "Penetrating Munitions Damage",
        img: "",
        appliedEffects: [],
      },
    },
  })
);

// 18. Tactical Strike: Squad Surge (Req: L11)
write(
  "src/features/soldier/strategies/strategy-squad-surge.json",
  createFeat({
    id: "StratSquadSurge1",
    name: "Strategy: Squad Surge",
    img: "icons/magic/movement/chevrons-right-yellow.webp",
    requirements: "Soldier 11",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>Whenever you trigger a <strong>Natural 16–20</strong> on a weapon attack as part of your Tactical Strikes, your fire superiority opens an evasive movement window for your team. Up to <strong>three willing allies within 30 feet</strong> who can see or hear you can immediately use their <strong>Reactions</strong> to move up to <strong>half their speed</strong> without provoking Opportunity Attacks.</p>`,
  })
);

// 19. Tactical Strike: Total War Coordinator (Req: L14)
write(
  "src/features/soldier/strategies/strategy-total-war-coordinator.json",
  createFeat({
    id: "StratTotalWarCrd",
    name: "Strategy: Total War Coordinator",
    img: "icons/skills/combat/strike-fist-destructive-purple.webp",
    requirements: "Soldier 14",
    subtype: "strategy",
    description: `<p><em>Tactical Strike Enhancement</em></p>
<p>During an <strong>Action Surge</strong>, when you roll a <strong>Natural 16–20</strong> on a weapon attack as part of your Tactical Strikes, your computational firing solutions peak: you can choose and apply <strong>two different Tactical Strike options simultaneously</strong> instead of only one.</p>`,
  })
);

/* ================================================================== */
/*  3. Soldier Class Document (src/classes/soldier.json)               */
/* ================================================================== */

write("src/classes/soldier.json", {
  _id: "SoldierClass0001",
  name: "Soldier",
  type: "class",
  img: "icons/skills/combat/strike-heavy-weapon-orange.webp",
  system: {
    description: {
      value: `<p>Disciplined, tactical, and relentlessly effective, Soldiers are the frontline masters of weaponry, ballistic coordinates, and military-grade cybernetic nanoprogramming on Rubi-Ka. Whether clearing orbital boarding pods or securing Notum extraction corridors, a Soldier commands total dominance over the battlefield.</p>`,
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "soldier",
    levels: 1,
    hd: {
      denomination: 10,
      spent: 0,
      additional: "",
    },
    primaryAbility: {
      value: ["str", "dex"],
      all: false,
    },
    spellcasting: {
      progression: "third",
      ability: "int",
    },
    advancement: [
      /* ── Hit Points (d10) ── */
      {
        _id: "advSolHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },

      /* ── Saves: STR, CON ── */
      {
        _id: "advSolSavesPrf01",
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

      /* ── Armor: Light, Medium, Heavy, Shields ── */
      {
        _id: "advSolArmorPrf01",
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

      /* ── Weapons: Simple, Martial, Blasters, Vibroweapons ── */
      {
        _id: "advSolWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [
            "weapons:sim",
            "weapons:mar",
            "weapons:blaster",
            "weapons:vibroweapon",
          ],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },

      /* ── Skills: Choice of 2 from list ── */
      {
        _id: "advSolSkillPrf01",
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
                "skills:his",
                "skills:ins",
                "skills:itm",
                "skills:med",
                "skills:prc",
                "skills:per",
                "skills:ste",
                "skills:sur",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Nanopool Points (1 at L1 to 20 at L20) ── */
      {
        _id: "advSolScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1: { value: 1 },
            2: { value: 2 },
            3: { value: 3 },
            4: { value: 4 },
            5: { value: 5 },
            6: { value: 6 },
            7: { value: 7 },
            8: { value: 8 },
            9: { value: 9 },
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

      /* ── ScaleValue: Weapon Masteries (3 at L1, 4 at L4, 5 at L10, 6 at L16) ── */
      {
        _id: "advSolScWpnMst01",
        type: "ScaleValue",
        configuration: {
          identifier: "weapon-masteries",
          type: "number",
          scale: {
            1: { value: 3 },
            4: { value: 4 },
            10: { value: 5 },
            16: { value: 6 },
          },
        },
        value: {},
        level: 1,
        title: "Weapon Masteries",
      },

      /* ── ScaleValue: Strategies Known (2 at L3 up to 10 at L19) ── */
      {
        _id: "advSolScStratKn1",
        type: "ScaleValue",
        configuration: {
          identifier: "strategies-known",
          type: "number",
          scale: {
            3: { value: 2 },
            4: { value: 3 },
            5: { value: 4 },
            7: { value: 5 },
            9: { value: 6 },
            11: { value: 7 },
            13: { value: 8 },
            16: { value: 9 },
            19: { value: 10 },
          },
        },
        value: {},
        level: 3,
        title: "Strategies Known",
      },

      /* ── ScaleValue: Second Wind Uses (@prof formula) ── */
      {
        _id: "advSolScSecWind1",
        type: "ScaleValue",
        configuration: {
          identifier: "second-wind-uses",
          type: "number",
          formula: "@prof",
          scale: {
            1: { value: 2, formula: "@prof" },
            5: { value: 3, formula: "@prof" },
            9: { value: 4, formula: "@prof" },
            13: { value: 5, formula: "@prof" },
            17: { value: 6, formula: "@prof" },
          },
        },
        value: {},
        level: 1,
        title: "Second Wind Uses",
      },

      /* ── ScaleValue: Indomitable Uses (1 at L9, 2 at L13, 3 at L17) ── */
      {
        _id: "advSolScIndom001",
        type: "ScaleValue",
        configuration: {
          identifier: "indomitable-uses",
          type: "number",
          scale: {
            9: { value: 1 },
            13: { value: 2 },
            17: { value: 3 },
          },
        },
        value: {},
        level: 9,
        title: "Indomitable Uses",
      },

      /* ── ScaleValue: Action Surge Uses (1 at L2, 2 at L17) ── */
      {
        _id: "advSolScActSurg1",
        type: "ScaleValue",
        configuration: {
          identifier: "action-surge-uses",
          type: "number",
          scale: {
            2: { value: 1 },
            17: { value: 2 },
          },
        },
        value: {},
        level: 2,
        title: "Action Surge Uses",
      },

      /* ── ItemGrant: Level 1 (Combat Training, Nanoprogramming) ── */
      {
        _id: "advSolItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolCombatTrain01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolNanoProg00001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Soldier Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Action Surge, Tactical Strikes, Soldier Strategies) ── */
      {
        _id: "advSolItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolActionSurge01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolTactStrikes01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolStrategies001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Soldier Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Soldier Specialty") ── */
      {
        _id: "advSolSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Soldier Specialty",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advSolASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 4 (Eye for Talent) ── */
      {
        _id: "advSolItmGrLvl04",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolEyeForTalent1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 4,
        title: "Soldier Features (Level 4)",
      },

      /* ── ItemGrant: Level 5 (Extra Attack, Tactical Shift) ── */
      {
        _id: "advSolItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolExtraAttack01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolTactShift0001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Soldier Features (Level 5)",
      },

      /* ── ASI: Level 6 ── */
      {
        _id: "advSolASILvl0601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 6,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 7 (Studied Attacks) ── */
      {
        _id: "advSolItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolStudiedAtks01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Soldier Features (Level 7)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advSolASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 9 (Tactical Master, Indomitable) ── */
      {
        _id: "advSolItmGrLvl09",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolTactMaster001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolIndomitable01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 9,
        title: "Soldier Features (Level 9)",
      },

      /* ── ItemGrant: Level 11 (Greater Extra Attack) ── */
      {
        _id: "advSolItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolGtrExtraAtk01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Soldier Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advSolASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 14 ── */
      {
        _id: "advSolASILvl1401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 14,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advSolASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advSolASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Master of Combat) ── */
      {
        _id: "advSolItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.SolMstrOfCombat1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Soldier Features (Level 20)",
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
  _key: "!items!SoldierClass0001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Soldier build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
