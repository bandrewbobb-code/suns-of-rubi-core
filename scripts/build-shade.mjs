#!/usr/bin/env node
/**
 * build-shade.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Shade class package:
 *   • src/features/shade/                  – 16 Core Class Features
 *   • src/features/shade/cunning-strikes/  – 15 Cunning Strikes
 *   • src/features/shade/inscriptions/     – 23 Novictum Inscriptions
 *   • src/classes/shade.json               – Shade Class Document
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

/** Standard feat scaffold for Shade features, strikes, and inscriptions */
function createFeat({
  id,
  name,
  img = "icons/magic/perception/shadow-stealth-eyes-purple.webp",
  description,
  subtype = "",
  requirements = "Shade 1",
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
/*  1. Core Class Features (16)                                       */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Core Features (16) ---");

// 1. Shadow Training (Level 1)
write(
  "src/features/shade/shadow-training.json",
  createFeat({
    id: "ShdShadowTrain01",
    name: "Shadow Training",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p>Your conditioning in the cold void and forgotten underworld sectors sharpens your nocturnal prowess:</p><ul><li><strong>Voidwalker Sight:</strong> You gain Darkvision out to a range of 60 feet. If you already have Darkvision from your species or another feature, its range increases by 30 feet instead.</li><li><strong>Fighting Style:</strong> You adopt a particular style of fighting as your specialty. Choose one Fighting Style feature from Chapter 6.</li><li><strong>Weapon Mastery:</strong> Your training with arms allows you to use the Mastery properties of two kinds of weapons of your choice with which you are proficient. Whenever you finish a Long Rest, you can practice weapon katas and change the kinds of weapons you chose.</li></ul>",
    requirements: "Shade 1",
  })
);

// 2. Sneak Attack (Level 1)
write(
  "src/features/shade/sneak-attack.json",
  createFeat({
    id: "ShdSneakAttack01",
    name: "Sneak Attack",
    img: "icons/skills/melee/strike-dagger-white.webp",
    description:
      "<p>Beginning at 1st level, you know how to strike subtly and exploit an opponent's distraction. Once per turn, you can deal extra damage to one creature you hit with an attack roll if you make the attack roll with a Light and Finesse melee weapon or an Unarmed Strike, and you meet at least one of the following conditions:</p><ul><li>You have Advantage on the attack roll.</li><li>An ally of yours is within 5 feet of the target, that ally isn't Incapacitated, and you don't have Disadvantage on the attack roll.</li><li><strong>Isolated Prey:</strong> No other creature (hostile or friendly) is within 15 feet of the target, and you don't have Disadvantage on the attack roll.</li></ul><p>The extra damage is 1d6 at 1st level, and increases as you gain Shade levels as shown in the Sneak Attack column of the Shade table (<code>@scale.shade.sneak-attack</code>).</p><p><strong>Siphon Banking:</strong> When you qualify to deal Sneak Attack damage, you can forgo rolling any number of your Sneak Attack damage dice to bank them into your Novictum Reserve instead. You can bank a maximum number of Sneak Attack dice equal to your Proficiency Bonus (<code>@scale.shade.siphon-bank-cap</code>). You can spend banked dice on future attacks within the same encounter to add to your Sneak Attack damage or pay the cost of Cunning Strike options. All banked dice dissipate when you finish a Short or Long Rest.</p>",
    requirements: "Shade 1",
    activities: {
      actShdSneakAtk01: {
        _id: "actShdSneakAtk01",
        type: "damage",
        name: "Sneak Attack Damage",
        activation: {
          type: "special",
          value: null,
          condition: "Once per turn on a qualifying hit",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: true, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "@scale.shade.sneak-attack" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["piercing"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
      actShdSiphonBank: {
        _id: "actShdSiphonBank",
        type: "utility",
        name: "Siphon Banking",
        activation: {
          type: "special",
          value: null,
          condition: "Forgo rolling Sneak Attack dice to store in reserve",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 3. Nanoprogramming (Level 1)
write(
  "src/features/shade/nanoprogramming.json",
  createFeat({
    id: "ShdNanoProg00001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p>Through specialized void cyberware and subcutaneous nanite injectors, you channel utilitarian covert programs.</p><p><strong>Progression:</strong> You follow a 1/3-caster progression (Tiers 1–4).</p><p><strong>Wisdom Nanocasting:</strong> Wisdom is your nanocasting ability for your shade nanoprograms.</p><p><strong>Programs Known:</strong> You know 2 nanoprograms of 1st tier at 1st level.</p><p><strong>Nanopool Points:</strong> You possess a pool of Nanopool points equal to your Shade Level + your Wisdom modifier. Expended Nanopool points are restored when you finish a Long Rest.</p><p><strong>Execution Requirement:</strong> Executing your nanoprograms requires at least one free hand to operate injectors or calibrate somatic dermal matrices.</p>",
    requirements: "Shade 1",
    activities: {
      actShdNanoRecov1: {
        _id: "actShdNanoRecov1",
        type: "utility",
        name: "Nanopool Recovery",
        activation: {
          type: "special",
          value: null,
          condition: "Finish a Long Rest",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 4. Cunning Action (Level 2)
write(
  "src/features/shade/cunning-action.json",
  createFeat({
    id: "ShdCunningActn01",
    name: "Cunning Action",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p>Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a Bonus Action on each of your turns in combat to take the <strong>Dash</strong>, <strong>Disengage</strong>, or <strong>Hide</strong> action.</p><p><strong>Shadow Step:</strong> When you take this Bonus Action while in dim light or darkness, you can spend 1 Nanopool point to teleport up to 15 feet to an unoccupied space you can see that is also in dim light or darkness as part of the same Bonus Action.</p>",
    requirements: "Shade 2",
    activities: {
      actShdDash000001: {
        _id: "actShdDash000001",
        type: "utility",
        name: "Cunning Action: Dash",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actShdDisengage1: {
        _id: "actShdDisengage1",
        type: "utility",
        name: "Cunning Action: Disengage",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actShdHide000001: {
        _id: "actShdHide000001",
        type: "utility",
        name: "Cunning Action: Hide",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actShdShadowStep: {
        _id: "actShdShadowStep",
        type: "utility",
        name: "Shadow Step Teleport",
        activation: {
          type: "special",
          value: null,
          condition: "In dim light or darkness as part of Cunning Action",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "15", units: "ft" },
        consumption: {
          targets: [
            {
              type: "value",
              value: "1",
              scaling: { mode: "", formula: "" },
            },
          ],
          scaling: { allowed: false, max: "" },
        },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 5. Cunning Strikes (Level 2)
write(
  "src/features/shade/cunning-strikes.json",
  createFeat({
    id: "ShdCunningStrk01",
    name: "Cunning Strikes",
    img: "icons/skills/melee/strike-dagger-blood-red.webp",
    description:
      "<p>You learn to trade raw damage for debilitating tactical maneuvers. When you deal Sneak Attack damage, you can forgo rolling one or more of your Sneak Attack damage dice (or spend banked dice from Siphon Banking) to trigger a Cunning Strike effect.</p><p>Each option specifies how many dice you must forgo to use it. If an option forces a saving throw, the DC equals your Program Save DC (<code>8 + Proficiency Bonus + Wisdom modifier</code>).</p><p>You automatically learn four baseline Cunning Strike options: <em>Vanish</em> (1d6), <em>Trip</em> (1d6), <em>Leech</em> (1d6), and <em>Vital Siphon</em> (1d6 + 1 Nanopool point).</p>",
    requirements: "Shade 2",
  })
);

// 6. Novictum Inscriptions (Level 2)
write(
  "src/features/shade/novictum-inscriptions.json",
  createFeat({
    id: "ShdNovictumInsc1",
    name: "Novictum Inscriptions",
    img: "icons/magic/symbols/runes-carved-stone-purple.webp",
    description:
      "<p>Through specialized alchemical rituals and biological cyber-etching, you carve void-resonant Novictum runes directly onto your flesh and neuromuscular pathways. At 2nd level, you gain two Novictum Inscriptions of your choice. You gain additional inscriptions as shown in the Inscriptions Known column of the Shade table (up to 10 at 18th level).</p><p>Whenever you gain a level in this class, you can choose one of the inscriptions you know and replace it with another inscription that you could learn at that level.</p>",
    requirements: "Shade 2",
  })
);

// 7. Hesitation is Defeat (Level 3)
write(
  "src/features/shade/hesitation-is-defeat.json",
  createFeat({
    id: "ShdHesitatDefeat",
    name: "Hesitation is Defeat",
    img: "icons/magic/time/hourglass-tilted-gray.webp",
    description:
      "<p>Starting at 3rd level, you capitalize instantly on the slightest hesitation in combat. In a round of combat in which you have not yet taken a turn, immediately after a friendly creature ends its turn, you can use your reaction to seize the initiative. Your turn begins immediately, and you act next in initiative order.</p><p>Your place in the initiative order permanently changes to this new position for the remainder of the encounter. Once you use this feature, you can't use it again until you finish a Long Rest.</p>",
    requirements: "Shade 3",
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actShdHesitatDef: {
        _id: "actShdHesitatDef",
        type: "utility",
        name: "Seize the Initiative",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Immediately after a friendly creature ends its turn, before you have acted this round",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 8. On the Mark (Level 5)
write(
  "src/features/shade/on-the-mark.json",
  createFeat({
    id: "ShdOnTheMark0001",
    name: "On the Mark",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p>Your lethal precision ensures that even near-misses bleed energy from your foe. When you miss with an attack roll that would have qualified for Sneak Attack, you can still roll your Sneak Attack damage; the target takes half of that damage, or you can forgo dice to apply Cunning Strike effects as normal.</p><p>Doing so counts as using Sneak Attack for the turn.</p>",
    requirements: "Shade 5",
    activities: {
      actShdOnTheMark1: {
        _id: "actShdOnTheMark1",
        type: "damage",
        name: "Near-Miss Half Sneak Attack",
        activation: {
          type: "special",
          value: null,
          condition: "On a missed attack qualifying for Sneak Attack",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: false, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "floor((@scale.shade.sneak-attack) / 2)" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["piercing"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

// 9. In All This Confusion (Level 5)
write(
  "src/features/shade/in-all-this-confusion.json",
  createFeat({
    id: "ShdInAllThisConf",
    name: "In All This Confusion",
    img: "icons/skills/movement/body-turn-twist-blue.webp",
    description:
      "<p>When you are hit by an attack from an attacker that you can see, you can use your reaction to halve the attack's damage against you. Immediately after the damage resolves, you can move up to 15 feet without provoking opportunity attacks as you slip through the chaos of combat.</p>",
    requirements: "Shade 5",
    activities: {
      actShdInConfusion: {
        _id: "actShdInConfusion",
        type: "utility",
        name: "In All This Confusion Reaction",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Hit by an attack from an attacker you can see",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 10. Evasion (Level 7)
write(
  "src/features/shade/evasion.json",
  createFeat({
    id: "ShdEvasion000001",
    name: "Evasion",
    img: "icons/skills/movement/arrows-up-diverging-blue.webp",
    description:
      "<p>Your instinctive agility lets you dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>",
    requirements: "Shade 7",
  })
);

// 11. Novictum Anchor (Level 9)
write(
  "src/features/shade/novictum-anchor.json",
  createFeat({
    id: "ShdNovictAnchor1",
    name: "Novictum Anchor",
    img: "icons/magic/symbols/rune-sigil-hook-white-blue.webp",
    description:
      "<p>You can use a Bonus Action to tether an invisible Novictum Anchor to your current space. The anchor lasts for 1 minute or until you create another one. At any point while the anchor persists, if you are within 60 feet of it, you can use a Bonus Action or a Reaction to instantly teleport back to the anchor's space.</p><p>You can place an anchor once without spending Nanopool, regaining this free use when you finish a Short or Long Rest. You can also create an anchor by spending 4 Nanopool points.</p>",
    requirements: "Shade 9",
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actShdPlaceAnchor: {
        _id: "actShdPlaceAnchor",
        type: "utility",
        name: "Place Novictum Anchor",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actShdTeleToAnchr: {
        _id: "actShdTeleToAnchr",
        type: "utility",
        name: "Teleport to Anchor",
        activation: {
          type: "bonus",
          value: 1,
          condition: "Within 60 ft of active Novictum Anchor (can also use Reaction)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "60", units: "ft" },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 12. Improved Cunning Strike (Level 11)
write(
  "src/features/shade/improved-cunning-strike.json",
  createFeat({
    id: "ShdImpCunningSt1",
    name: "Improved Cunning Strike",
    img: "icons/skills/melee/strike-dagger-blood-red.webp",
    description:
      "<p>You have mastered the art of simultaneous tactical exploitation. When you deal Sneak Attack damage, you can choose up to two Cunning Strike effects to trigger at once, paying the die cost for each effect separately.</p>",
    requirements: "Shade 11",
  })
);

// 13. Ruthless Exploitation (Level 14)
write(
  "src/features/shade/ruthless-exploitation.json",
  createFeat({
    id: "ShdRuthlessExpl1",
    name: "Ruthless Exploitation",
    img: "icons/skills/melee/strike-blades-scythe-red.webp",
    description:
      "<p>Your lethal reflex loop grants you a second reaction each round. This extra reaction can be used only to make an Opportunity Attack or to use your <em>In All This Confusion</em> feature against a creature within 5 feet of you.</p>",
    requirements: "Shade 14",
  })
);

// 14. Slippery Mind (Level 15)
write(
  "src/features/shade/slippery-mind.json",
  createFeat({
    id: "ShdSlipperyMind1",
    name: "Slippery Mind",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description:
      "<p>By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom and Charisma saving throws.</p>",
    requirements: "Shade 15",
  })
);

// 15. Elusive (Level 18)
write(
  "src/features/shade/elusive.json",
  createFeat({
    id: "ShdElusive000001",
    name: "Elusive",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p>Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll can have Advantage against you if you aren't Incapacitated.</p>",
    requirements: "Shade 18",
  })
);

// 16. Avatar of the Void (Level 20)
write(
  "src/features/shade/avatar-of-the-void.json",
  createFeat({
    id: "ShdAvatarOfVoid1",
    name: "Avatar of the Void",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p>You embody pure void essence. Your Dexterity and Wisdom scores each increase by 2, and their maximums become 22.</p><p>Additionally, as a Bonus Action, you can merge entirely with Novictum energy for 1 minute, gaining the following benefits:</p><ul><li>You gain the <strong>Invisible</strong> condition.</li><li>All Cunning Strike options cost 1 fewer Sneak Attack die to activate (to a minimum of 0 dice).</li><li>Once per turn, your Sneak Attack damage deals maximum damage automatically without rolling.</li></ul><p>You can use this transformation once without spending Nanopool, regaining this use upon finishing a Long Rest. You can also activate it by spending 6 Nanopool points.</p>",
    requirements: "Shade 20",
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actShdAvatarTrans: {
        _id: "actShdAvatarTrans",
        type: "utility",
        name: "Activate Avatar of the Void",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

/* ------------------------------------------------------------------ */
/*  2. Cunning Strikes (15)                                           */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Cunning Strikes (15) ---");

// CS 1: Vanish (Cost: 1d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-vanish.json",
  createFeat({
    id: "CstVanish0000001",
    name: "Cunning Strike: Vanish",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die)</em></p><p>You melt into the shadows instantly upon striking. You gain the Invisible condition until the start of your next turn, or until you make an attack roll, execute a nanoprogram, or a creature succeeds on a contested Wisdom (Perception) check against your Dexterity (Stealth) check. While invisible in this way, your movement does not provoke opportunity attacks, even from creatures with blindsight or tremorsense.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstVanish0001: {
        _id: "actCstVanish0001",
        type: "utility",
        name: "Vanish into Shadows",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// CS 2: Trip (Cost: 1d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-trip.json",
  createFeat({
    id: "CstTrip000000001",
    name: "Cunning Strike: Trip",
    img: "icons/skills/melee/unarmed-punch-fist.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die)</em></p><p>You sweep the target's legs or sever kinetic stabilization. A Large or smaller target must succeed on a Dexterity saving throw against your Program Save DC or fall Prone.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstTrip000001: {
        _id: "actCstTrip000001",
        type: "save",
        name: "Trip Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["dex"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 3: Leech (Cost: 1d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-leech.json",
  createFeat({
    id: "CstLeech00000001",
    name: "Cunning Strike: Leech",
    img: "icons/magic/life/heart-hand-gold-green.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die)</em></p><p>You harvest kinetic residue and somatic bio-energy from the wound. You gain temporary hit points equal to your Wisdom modifier + your Shade level (minimum 1).</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstLeech00001: {
        _id: "actCstLeech00001",
        type: "heal",
        name: "Leech Temporary HP",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        healing: {
          types: ["temphp"],
          custom: { enabled: true, formula: "@abilities.wis.mod + @classes.shade.levels" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
    },
  })
);

// CS 4: Vital Siphon (Cost: 1d6 + 1 NP)
write(
  "src/features/shade/cunning-strikes/cunning-strike-vital-siphon.json",
  createFeat({
    id: "CstVitalSiphon01",
    name: "Cunning Strike: Vital Siphon",
    img: "icons/magic/life/cross-beam-green.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die + 1 Nanopool Point)</em></p><p>You siphon living vitality directly into your tissue. You regain hit points equal to <code>1d6 + @abilities.wis.mod</code>.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstVitalSiph1: {
        _id: "actCstVitalSiph1",
        type: "heal",
        name: "Vital Siphon Healing",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6 + 1 NP)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        consumption: {
          targets: [
            {
              type: "value",
              value: "1",
              scaling: { mode: "", formula: "" },
            },
          ],
          scaling: { allowed: false, max: "" },
        },
        healing: {
          types: ["healing"],
          custom: { enabled: true, formula: "1d6 + @abilities.wis.mod" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
    },
  })
);

// CS 5: Poison (Cost: 1d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-poison.json",
  createFeat({
    id: "CstPoison0000001",
    name: "Cunning Strike: Poison",
    img: "icons/magic/nature/poison-bottle-skull-green.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die)</em></p><p>You inject neurotoxic nanites into the strike. The target must succeed on a Constitution saving throw against your Program Save DC or be <strong>Poisoned</strong> for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstPoison0001: {
        _id: "actCstPoison0001",
        type: "save",
        name: "Poison Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6)",
        },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["con"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 6: Withdraw (Cost: 1d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-withdraw.json",
  createFeat({
    id: "CstWithdraw00001",
    name: "Cunning Strike: Withdraw",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Cunning Strike (Cost: 1d6 Sneak Attack Die)</em></p><p>Immediately after dealing damage, you move up to half your Speed without provoking opportunity attacks.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstWithdraw01: {
        _id: "actCstWithdraw01",
        type: "utility",
        name: "Withdraw Movement",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 1d6)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// CS 7: Obscure (Cost: 2d6)
write(
  "src/features/shade/cunning-strikes/cunning-strike-obscure.json",
  createFeat({
    id: "CstObscure000001",
    name: "Cunning Strike: Obscure",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p><em>Cunning Strike (Cost: 2d6 Sneak Attack Dice)</em></p><p>You discharge a cloud of sensor-blinding micro-particles. The target must succeed on a Dexterity saving throw against your Program Save DC or be <strong>Blinded</strong> until the end of your next turn.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 2",
    activities: {
      actCstObscure001: {
        _id: "actCstObscure001",
        type: "save",
        name: "Obscure Dex Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 2d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["dex"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 8: Daze (Cost: 2d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-daze.json",
  createFeat({
    id: "CstDaze000000001",
    name: "Cunning Strike: Daze",
    img: "icons/magic/stun/shock-ring-teal.webp",
    description:
      "<p><em>Cunning Strike (Cost: 2d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>You strike a jarring nerve plexus. The target must succeed on a Constitution saving throw against your Program Save DC or be Dazed until the end of its next turn: on that turn, it can move OR take an Action OR take a Bonus Action, not more than one of the three.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstDaze000001: {
        _id: "actCstDaze000001",
        type: "save",
        name: "Daze Con Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 2d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["con"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 9: Nano Siphon (Cost: 3d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-nano-siphon.json",
  createFeat({
    id: "CstNanoSiphon001",
    name: "Cunning Strike: Nano Siphon",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p><em>Cunning Strike (Cost: 3d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>You sever an opponent's nanite feedback loop. The target loses 1 Nanopool point (or highest spell slot if it has no Nanopool), and you regain 1 expended Nanopool point. A single creature can be siphoned in this way only once per Long Rest.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstNanoSiphon: {
        _id: "actCstNanoSiphon",
        type: "utility",
        name: "Nano Siphon",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 3d6)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// CS 10: Synaptic Severance (Cost: 4d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-synaptic-severance.json",
  createFeat({
    id: "CstSynapticSev01",
    name: "Cunning Strike: Synaptic Severance",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    description:
      "<p><em>Cunning Strike (Cost: 4d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>You deliver a paralyzing shock into the target's cranial link. The target must succeed on a Constitution saving throw against your Program Save DC or become Deafened and unable to execute nanoprograms, cast spells, or speak verbally until the end of its next turn.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstSynapticSe: {
        _id: "actCstSynapticSe",
        type: "save",
        name: "Synaptic Severance Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 4d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["con"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 11: Demoralizing Strike (Cost: 2d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-demoralizing.json",
  createFeat({
    id: "CstDemoralizing1",
    name: "Cunning Strike: Demoralizing Strike",
    img: "icons/magic/death/skull-horned-goat-pentagram-red.webp",
    description:
      "<p><em>Cunning Strike (Cost: 2d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>Your shadowy visage radiates existential dread. The target must succeed on a Wisdom saving throw against your Program Save DC or be <strong>Frightened</strong> of you until the end of your next turn.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstDemoralize: {
        _id: "actCstDemoralize",
        type: "save",
        name: "Demoralizing Wis Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 2d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["wis"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 12: Diverting Strike (Cost: 2d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-diverting.json",
  createFeat({
    id: "CstDiverting0001",
    name: "Cunning Strike: Diverting Strike",
    img: "icons/skills/melee/parry-block-shield-gold.webp",
    description:
      "<p><em>Cunning Strike (Cost: 2d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>You divert the enemy's momentum and unbalance their aim. Roll 2 Sneak Attack dice (2d6). The next damage dealt by the target before the start of your next turn is reduced by the total rolled.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstDiverting1: {
        _id: "actCstDiverting1",
        type: "utility",
        name: "Diverting Damage Reduction",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 2d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "2d6", name: "Damage Reduction" },
      },
    },
  })
);

// CS 13: Warmonger Strike (Cost: 2d6, Req: L5)
write(
  "src/features/shade/cunning-strikes/cunning-strike-warmonger.json",
  createFeat({
    id: "CstWarmonger0001",
    name: "Cunning Strike: Warmonger Strike",
    img: "icons/skills/melee/strike-sword-blood-red.webp",
    description:
      "<p><em>Cunning Strike (Cost: 2d6 Sneak Attack Dice, Prerequisite: Shade Level 5)</em></p><p>You mark the target for lethal retribution. If the target attacks you or an ally within 5 feet of you before the start of your next turn, you can use your reaction to make a melee weapon attack against the target.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 5",
    activities: {
      actCstWarmonger1: {
        _id: "actCstWarmonger1",
        type: "utility",
        name: "Warmonger Retribution Trigger",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 2d6)",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// CS 14: Knock Out (Cost: 6d6, Req: L11)
write(
  "src/features/shade/cunning-strikes/cunning-strike-knock-out.json",
  createFeat({
    id: "CstKnockOut00001",
    name: "Cunning Strike: Knock Out",
    img: "icons/magic/control/sleep-bubble-purple.webp",
    description:
      "<p><em>Cunning Strike (Cost: 6d6 Sneak Attack Dice, Prerequisite: Shade Level 11)</em></p><p>You strike with devastating concussive force. The target must succeed on a Constitution saving throw against your Program Save DC or be <strong>Unconscious</strong> for 1 minute, or until it takes damage. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 11",
    activities: {
      actCstKnockOut01: {
        _id: "actCstKnockOut01",
        type: "save",
        name: "Knock Out Con Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 6d6)",
        },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["con"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// CS 15: Flicker (Cost: 4d6, Req: L11)
write(
  "src/features/shade/cunning-strikes/cunning-strike-flicker.json",
  createFeat({
    id: "CstFlicker000001",
    name: "Cunning Strike: Flicker",
    img: "icons/magic/movement/trail-streak-zigzag-blue.webp",
    description:
      "<p><em>Cunning Strike (Cost: 4d6 Sneak Attack Dice, Prerequisite: Shade Level 11)</em></p><p>You phase out of existence immediately upon hitting your primary target, gaining the Invisible condition and teleporting up to 30 feet to an unoccupied space adjacent to a second creature. You can immediately make one melee weapon attack against that second creature; on a hit, it deals the weapon's damage plus the 4d6 Sneak Attack damage you forgone on the initial strike.</p>",
    subtype: "cunning-strike",
    requirements: "Shade 11",
    activities: {
      actCstFlicker001: {
        _id: "actCstFlicker001",
        type: "attack",
        name: "Flicker Secondary Strike",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage (Cost: 4d6)",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "30", units: "ft" },
        attack: {
          ability: "dex",
          bonus: "",
          critical: { threshold: null },
          flat: false,
          type: { value: "melee", classification: "weapon" },
        },
        damage: {
          critical: { allow: true, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "4d6" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["piercing"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

/* ------------------------------------------------------------------ */
/*  3. Novictum Inscriptions (23)                                     */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Novictum Inscriptions (23) ---");

// 1. Umbral Shroud (Level 2)
write(
  "src/features/shade/inscriptions/inscription-umbral-shroud.json",
  createFeat({
    id: "InscUmbralShroud",
    name: "Inscription: Umbral Shroud",
    img: "icons/magic/defensive/armor-stone-skin.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>Your skin takes on a dull, light-absorbing obsidian sheen. While you are not wearing armor and not wielding a shield, your base Armor Class equals 10 + your Dexterity modifier + your Wisdom modifier.</p><p>Additionally, your lungs and epidermal layers become hermetically sealed: you are immune to the environmental hazards of hard vacuum, rapid decompression, and extreme planetary radiation, surviving without an EVA environmental suit.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 2. Ghostwire (Level 2)
write(
  "src/features/shade/inscriptions/inscription-ghostwire.json",
  createFeat({
    id: "InscGhostwire001",
    name: "Inscription: Ghostwire",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>Microscopic nanite monofilaments weave through your fingertips and soles. You gain a climbing speed equal to your walking speed, and nonmagical difficult terrain costs you no extra movement.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 3. Voidwalker (Level 2)
write(
  "src/features/shade/inscriptions/inscription-voidwalker.json",
  createFeat({
    id: "InscVoidwalker01",
    name: "Inscription: Voidwalker",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>The range of your Darkvision extends to 120 feet. Additionally, you can see normally through both magical and paracausal darkness, as well as through nano-smoke and aerosol obscurant clouds.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 4. Whispering Shroud (Level 2)
write(
  "src/features/shade/inscriptions/inscription-whispering-shroud.json",
  createFeat({
    id: "InscWhisperShrou",
    name: "Inscription: Whispering Shroud",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>Your gear and footsteps produce zero ambient acoustic noise. Thermal scanners, acoustic sensors, and biometric detectors cannot perceive you, and you have Advantage on Dexterity (Stealth) checks made against security cameras and sensor grids.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 5. Acoustic Dissonance (Level 2)
write(
  "src/features/shade/inscriptions/inscription-acoustic-dissonance.json",
  createFeat({
    id: "InscAcousticDiss",
    name: "Inscription: Acoustic Dissonance",
    img: "icons/magic/sonic/scream-wail-shout-teal.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>When an electronic ping, motion sensor, radar sweep, or detection nanoprogram attempts to locate you, you can use your reaction to scramble the return telemetry. You can choose to appear on their sensors as background static, an inanimate piece of machinery, or a harmless local fauna.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
    activities: {
      actInscAcoustDis: {
        _id: "actInscAcoustDis",
        type: "utility",
        name: "Scramble Sensor Ping",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Targeted by sensor scan, electronic ping, or detection program",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 6. Grave Stride (Level 2)
write(
  "src/features/shade/inscriptions/inscription-grave-stride.json",
  createFeat({
    id: "InscGraveStride1",
    name: "Inscription: Grave Stride",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>Your jump distance is doubled. Furthermore, gravitational dampers embedded in your frame cushion your descents: you take no damage from falling 30 feet or less.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 7. Bloodhound Resonance (Level 2)
write(
  "src/features/shade/inscriptions/inscription-bloodhound-resonance.json",
  createFeat({
    id: "InscBloodhoundRe",
    name: "Inscription: Bloodhound Resonance",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: None)</em></p><p>Your senses resonate with spilled bio-matter and disrupted energy shields. You have Advantage on Wisdom (Perception) and Wisdom (Survival) checks to track or pinpoint any creature that has lost hit points within the past 24 hours.</p>",
    subtype: "inscription",
    requirements: "Shade 2",
  })
);

// 8. Leeching Fang (Level 5)
write(
  "src/features/shade/inscriptions/inscription-leeching-fang.json",
  createFeat({
    id: "InscLeechFang001",
    name: "Inscription: Leeching Fang",
    img: "icons/magic/life/cross-beam-green.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>When you score a critical hit with a Sneak Attack and apply the <em>Vital Siphon</em> Cunning Strike, you do not need to spend a Nanopool point to activate it.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 9. Piercing Spite (Level 5)
write(
  "src/features/shade/inscriptions/inscription-piercing-spite.json",
  createFeat({
    id: "InscPiercingSpit",
    name: "Inscription: Piercing Spite",
    img: "icons/magic/death/skull-energy-purple.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>Whenever you hit with a weapon attack or unarmed strike, you can cause the attack and your Sneak Attack damage to deal Necrotic damage instead of its normal damage type. Additionally, your Sneak Attack damage ignores resistance to Necrotic damage.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 10. Mnemonic Siphon (Level 5)
write(
  "src/features/shade/inscriptions/inscription-mnemonic-siphon.json",
  createFeat({
    id: "InscMnemonicSiph",
    name: "Inscription: Mnemonic Siphon",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>When you reduce a creature with an Intelligence score of 6 or higher to 0 hit points with a Sneak Attack, you instantly siphon one piece of actionable tactical knowledge from its neural network, such as a security password, an access code, a patrol schedule, or a building layout.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 11. Null-Field Conduit (Level 5)
write(
  "src/features/shade/inscriptions/inscription-null-field-conduit.json",
  createFeat({
    id: "InscNullFieldCon",
    name: "Inscription: Null-Field Conduit",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>Your neuro-pathways are grounded by void currents. You have Advantage on saving throws against the Charmed, Frightened, and Stunned conditions.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 12. Echoing Rupture (Level 5)
write(
  "src/features/shade/inscriptions/inscription-echoing-rupture.json",
  createFeat({
    id: "InscEchoingRupt1",
    name: "Inscription: Echoing Rupture",
    img: "icons/magic/fire/projectile-fireball-smoke-orange.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>When you spend two or more banked Sneak Attack dice to hit an enemy and reduce that creature to 0 hit points, 1 of the expended banked dice is immediately restored to your Siphon Banking reserve.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 13. Shadow Weft (Level 5)
write(
  "src/features/shade/inscriptions/inscription-shadow-weft.json",
  createFeat({
    id: "InscShadowWeft01",
    name: "Inscription: Shadow Weft",
    img: "icons/magic/movement/trail-streak-zigzag-blue.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 5)</em></p><p>Your Shadow Step feature's teleportation distance increases by 15 feet, allowing you to teleport up to 30 feet in dim light or darkness.</p>",
    subtype: "inscription",
    requirements: "Shade 5",
  })
);

// 14. Novictum Carapace (Level 7)
write(
  "src/features/shade/inscriptions/inscription-novictum-carapace.json",
  createFeat({
    id: "InscNovictCarapa",
    name: "Inscription: Novictum Carapace",
    img: "icons/magic/defensive/armor-stone-skin.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 7)</em></p><p>When you reduce a hostile creature to 0 hit points, you can use your reaction to solidify a sheath of crystallized Novictum armor over yourself, gaining temporary hit points equal to <code>1d8 + @abilities.wis.mod + @classes.shade.levels</code>.</p>",
    subtype: "inscription",
    requirements: "Shade 7",
    activities: {
      actInscNovictCar: {
        _id: "actInscNovictCar",
        type: "heal",
        name: "Carapace Temp HP",
        activation: {
          type: "reaction",
          value: 1,
          condition: "On reducing a hostile creature to 0 HP",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        healing: {
          types: ["temphp"],
          custom: { enabled: true, formula: "1d8 + @abilities.wis.mod + @classes.shade.levels" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
    },
  })
);

// 15. Phantom Tether (Level 7)
write(
  "src/features/shade/inscriptions/inscription-phantom-tether.json",
  createFeat({
    id: "InscPhantomTethe",
    name: "Inscription: Phantom Tether",
    img: "icons/magic/symbols/rune-sigil-hook-white-blue.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 7)</em></p><p>When you deal Sneak Attack damage to an Isolated Prey, you anchor its shadow to the physical plane. The target must succeed on a Strength saving throw against your Program Save DC or have its Speed halved and be unable to move more than 30 feet away from that space until the end of its next turn.</p>",
    subtype: "inscription",
    requirements: "Shade 7",
    activities: {
      actInscPhanTethe: {
        _id: "actInscPhanTethe",
        type: "save",
        name: "Phantom Tether Str Save",
        activation: {
          type: "special",
          value: null,
          condition: "On dealing Sneak Attack damage to an Isolated Prey",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        save: {
          ability: ["str"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// 16. Umbral Veil (Level 7)
write(
  "src/features/shade/inscriptions/inscription-umbral-veil.json",
  createFeat({
    id: "InscUmbralVeil01",
    name: "Inscription: Umbral Veil",
    img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 7)</em></p><p>You can execute either the <em>Invisibility</em> or <em>Darkness</em> nanoprogram once without expending Nanopool points. You regain this use when you finish a Short or Long Rest.</p>",
    subtype: "inscription",
    requirements: "Shade 7",
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actInscUmbralVei: {
        _id: "actInscUmbralVei",
        type: "utility",
        name: "Umbral Veil (Invisibility or Darkness)",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "minute", value: "10" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 17. Cold-Iron Synthesis (Level 9)
write(
  "src/features/shade/inscriptions/inscription-cold-iron-synthesis.json",
  createFeat({
    id: "InscColdIronSynt",
    name: "Inscription: Cold-Iron Synthesis",
    img: "icons/skills/melee/strike-dagger-white.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 9)</em></p><p>Your weapons smell of chilled void matter. When you attack a creature that has less than half its maximum hit points remaining, your weapon attacks score a critical hit on a roll of 19 or 20 (or expand your existing critical threat range by 1).</p>",
    subtype: "inscription",
    requirements: "Shade 9",
  })
);

// 18. Vaporous Form (Level 9)
write(
  "src/features/shade/inscriptions/inscription-vaporous-form.json",
  createFeat({
    id: "InscVaporousForm",
    name: "Inscription: Vaporous Form",
    img: "icons/magic/air/fog-gas-smoke-dense-gray.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 9)</em></p><p>When you take the Disengage action using your Cunning Action, your body temporarily shifts into vaporous nanite smog. You gain a flying speed equal to your walking speed until the end of your current turn, and you can move through the space of other creatures as if it were difficult terrain.</p>",
    subtype: "inscription",
    requirements: "Shade 9",
    activities: {
      actInscVaporForm: {
        _id: "actInscVaporForm",
        type: "utility",
        name: "Vaporous Shift",
        activation: {
          type: "special",
          value: null,
          condition: "When taking Cunning Action: Disengage",
        },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 19. Spatial Inversion (Level 13)
write(
  "src/features/shade/inscriptions/inscription-spatial-inversion.json",
  createFeat({
    id: "InscSpatialInver",
    name: "Inscription: Spatial Inversion",
    img: "icons/magic/movement/portal-vortex-teal.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 13)</em></p><p>You can execute the <em>Grid Step</em> (Phasewalk) nanoprogram once without expending Nanopool points. You regain this use when you finish a Short or Long Rest.</p>",
    subtype: "inscription",
    requirements: "Shade 13",
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "1",
    },
    activities: {
      actInscSpatialIn: {
        _id: "actInscSpatialIn",
        type: "utility",
        name: "Grid Step / Phasewalk",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 20. Ethereal Extractor (Level 13)
write(
  "src/features/shade/inscriptions/inscription-ethereal-extractor.json",
  createFeat({
    id: "InscEtherealExtr",
    name: "Inscription: Ethereal Extractor",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 13)</em></p><p>Your strikes rip directly into isolated bio-signatures. Whenever you force a creature to make a saving throw from a Cunning Strike while that creature qualifies as Isolated Prey, it has Disadvantage on the saving throw.</p>",
    subtype: "inscription",
    requirements: "Shade 13",
  })
);

// 21. Gravitational Collapse (Level 13)
write(
  "src/features/shade/inscriptions/inscription-gravitational-collapse.json",
  createFeat({
    id: "InscGravitCollap",
    name: "Inscription: Gravitational Collapse",
    img: "icons/magic/space/black-hole-cosmos-star-purple.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 13)</em></p><p>When you trigger your <em>In All This Confusion</em> reaction, the space you vacated implodes in a localized micro-singularity. Each creature within 5 feet of that vacated space must make a Strength saving throw against your Program Save DC. On a failed save, a creature is pulled into the vacated space and knocked Prone.</p>",
    subtype: "inscription",
    requirements: "Shade 13",
    activities: {
      actInscGravitCol: {
        _id: "actInscGravitCol",
        type: "save",
        name: "Micro-Singularity Pull & Prone",
        activation: {
          type: "special",
          value: null,
          condition: "When triggering In All This Confusion",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "5", units: "ft" },
        save: {
          ability: ["str"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// 22. Entropic Singularity (Level 17)
write(
  "src/features/shade/inscriptions/inscription-entropic-singularity.json",
  createFeat({
    id: "InscEntropicSing",
    name: "Inscription: Entropic Singularity",
    img: "icons/magic/death/skull-energy-purple.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 17)</em></p><p>When you roll Initiative and have 0 banked Sneak Attack dice in your Siphon Banking reserve, you immediately gain 2 banked dice in your reserve.</p>",
    subtype: "inscription",
    requirements: "Shade 17",
  })
);

// 23. Untethered Soul (Level 17)
write(
  "src/features/shade/inscriptions/inscription-untethered-soul.json",
  createFeat({
    id: "InscUntetherSoul",
    name: "Inscription: Untethered Soul",
    img: "icons/magic/movement/trail-streak-zigzag-blue.webp",
    description:
      "<p><em>Novictum Inscription (Prerequisite: Shade Level 17)</em></p><p>You gain a permanent hovering speed equal to your walking speed. You can move through solid walls, shields, and structures up to 5 feet thick as if they were difficult terrain.</p><p>If you end your turn inside an object or barrier, you are safely shunted to the nearest unoccupied space you last occupied and take 1d10 Force damage.</p>",
    subtype: "inscription",
    requirements: "Shade 17",
  })
);

/* ------------------------------------------------------------------ */
/*  4. Class Document: Shade                                          */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Class Document ---");

const shadeClass = {
  _id: "ShadeClass000001",
  name: "Shade",
  type: "class",
  img: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
  system: {
    description: {
      value:
        "<p>Stalkers of the void, assassins of corporate despots, and living conduits of alien Novictum matter, Shades walk the liminal boundary between physical reality and paracausal shadows. Armed with tactical Cunning Strikes, siphon banking reserves, and etched bio-inscriptions, a Shade eliminates isolated prey with lethal, surgical silence.</p>",
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "shade",
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
      progression: "third",
      ability: "wis",
    },
    advancement: [
      {
        _id: "advShdHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      {
        _id: "advShdSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:dex", "saves:int"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Saving Throws",
      },
      {
        _id: "advShdArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Armor Training",
      },
      {
        _id: "advShdWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [
            "weapons:sim",
            "weapons:martial-melee-finesse",
            "weapons:sourceweapon-finesse",
          ],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Weapon Proficiencies",
      },
      {
        _id: "advShdToolProf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: ["tools:specialist-kit", "tools:thieves", "tools:slicer"],
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
        _id: "advShdSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["skills:ste"],
          choices: [
            {
              count: 3,
              pool: [
                "skills:acr",
                "skills:ani",
                "skills:arc",
                "skills:ath",
                "skills:dec",
                "skills:his",
                "skills:ins",
                "skills:itm",
                "skills:inv",
                "skills:med",
                "skills:nat",
                "skills:prc",
                "skills:prf",
                "skills:per",
                "skills:rel",
                "skills:slt",
                "skills:sur",
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
        _id: "advShdScSnkAtk01",
        type: "ScaleValue",
        configuration: {
          identifier: "sneak-attack",
          type: "dice",
          scale: {
            1: { number: 1, faces: 6 },
            3: { number: 2, faces: 6 },
            5: { number: 3, faces: 6 },
            7: { number: 4, faces: 6 },
            9: { number: 5, faces: 6 },
            11: { number: 6, faces: 6 },
            13: { number: 7, faces: 6 },
            15: { number: 8, faces: 6 },
            17: { number: 9, faces: 6 },
            19: { number: 10, faces: 6 },
          },
        },
        value: {},
        level: 1,
        title: "Sneak Attack",
      },
      {
        _id: "advShdScNanopl01",
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
      {
        _id: "advShdScInscKn01",
        type: "ScaleValue",
        configuration: {
          identifier: "inscriptions-known",
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
        title: "Inscriptions Known",
      },
      {
        _id: "advShdScSiphCap1",
        type: "ScaleValue",
        configuration: {
          identifier: "siphon-bank-cap",
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
        title: "Siphon Banking Cap",
      },
      // Level 1 Grants
      {
        _id: "advShdItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdShadowTrain01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdSneakAttack01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdNanoProg00001",
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
      // Level 2 Grants
      {
        _id: "advShdItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdCunningActn01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdCunningStrk01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdNovictumInsc1",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.CstVanish0000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.CstTrip000000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.CstLeech00000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.CstVitalSiphon01",
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
      // Level 3 Subclass & Feature
      {
        _id: "advShdSubclass01",
        type: "Subclass",
        configuration: {
          identifier: "shade-practice",
        },
        value: {},
        level: 3,
        title: "Shade Practice",
      },
      {
        _id: "advShdItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdHesitatDefeat",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Level 3 Features",
      },
      // Level 4 ASI
      {
        _id: "advShdASILvl0401",
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
      // Level 5 Grants
      {
        _id: "advShdItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdOnTheMark0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdInAllThisConf",
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
      // Level 7 Grants
      {
        _id: "advShdItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdEvasion000001",
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
        _id: "advShdASILvl0801",
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
      // Level 9 Grants
      {
        _id: "advShdItmGrLvl09",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdNovictAnchor1",
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
      // Level 10 ASI
      {
        _id: "advShdASILvl1001",
        type: "AbilityScoreImprovement",
        configuration: {
          points: 2,
          fixed: {},
          cap: 2,
        },
        value: {
          type: "asi",
        },
        level: 10,
        title: "Ability Score Improvement",
      },
      // Level 11 Grants
      {
        _id: "advShdItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdImpCunningSt1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Level 11 Features",
      },
      // Level 12 ASI
      {
        _id: "advShdASILvl1201",
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
      // Level 14 Grants
      {
        _id: "advShdItmGrLvl14",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdRuthlessExpl1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Level 14 Features",
      },
      // Level 15 Grants
      {
        _id: "advShdItmGrLvl15",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdSlipperyMind1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 15,
        title: "Level 15 Features",
      },
      // Level 16 ASI
      {
        _id: "advShdASILvl1601",
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
      // Level 18 Grants
      {
        _id: "advShdItmGrLvl18",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdElusive000001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 18,
        title: "Level 18 Features",
      },
      // Level 19 ASI
      {
        _id: "advShdASILvl1901",
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
      // Level 20 Grants
      {
        _id: "advShdItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.ShdAvatarOfVoid1",
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
  _key: "!items!ShadeClass000001",
};

write("src/classes/shade.json", shadeClass);

console.log("\n=======================================================");
console.log("  Shade class build complete (55 documents).");
console.log("=======================================================\n");
