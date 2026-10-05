#!/usr/bin/env node
/**
 * build-martial-artist.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Martial Artist class package:
 *   • src/features/martial-artist/             – 18 Core Class Features
 *   • src/features/martial-artist/finishers/   – 7 Finishers
 *   • src/features/martial-artist/techniques/  – 25 Martial Techniques
 *   • src/classes/martial-artist.json          – Martial Artist Class Document
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

/** Standard feat scaffold for Martial Artist features, finishers, and techniques */
function createFeat({
  id,
  name,
  img = "icons/skills/melee/unarmed-punch-fist.webp",
  description,
  subtype = "",
  requirements = "Martial Artist 1",
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
/*  1. Core Class Features (18)                                       */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Core Features (18) ---");

// 1. Nanoprogramming (Level 1)
write(
  "src/features/martial-artist/nanoprogramming.json",
  createFeat({
    id: "MaNanoProg000001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p>You learn to focus your internal bio-electrical flow through nanotech augmentation, deploying utilitarian combat programs to alter kinetic impact and bodily physiology.</p><p><strong>Progression:</strong> You follow a 1/3-caster progression (Tiers 1–4).</p><p><strong>Wisdom Nanocasting:</strong> Wisdom is your nanocasting ability for your martial nanoprograms.</p><p><strong>Programs Known:</strong> You know 2 nanoprograms of 1st tier at 1st level.</p><p><strong>Nanopool Points:</strong> You possess a pool of Nanopool points equal to your Martial Artist Level + your Wisdom modifier. Expended Nanopool points are restored when you finish a Long Rest.</p><p><strong>Execution Requirement:</strong> Executing your martial nanoprograms requires at least one free hand to project nanites or channel somatic focal katas.</p>",
    requirements: "Martial Artist 1",
    activities: {
      actMaNanoPoolRec: {
        _id: "actMaNanoPoolRec",
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

// 2. Martial Arts (Level 1)
write(
  "src/features/martial-artist/martial-arts.json",
  createFeat({
    id: "MaMartialArts001",
    name: "Martial Arts",
    img: "icons/skills/melee/unarmed-punch-fist.webp",
    description:
      "<p>Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and Martial Artist weapons, which are proficient weapons with the Light or Finesse properties.</p><p>You gain the following benefits while you are unarmed or wielding only Martial Artist weapons and you aren't wearing armor or wielding a shield:</p><ul><li><strong>Dexterous Attacks:</strong> You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and Martial Artist weapons. You can also use your Dexterity modifier to determine the DC for Grapple and Shove attempts.</li><li><strong>Martial Arts Die:</strong> You can roll a d6 in place of the normal damage of your unarmed strike or Martial Artist weapon. This die changes as you gain Martial Artist levels: 1d6 at 1st level, 1d8 at 5th level, 1d10 at 11th level, and 1d12 at 17th level (@scale.martial-artist.martial-arts-die).</li><li><strong>Bonus Strike:</strong> When you use the Attack action on your turn with an unarmed strike or a Martial Artist weapon, you can make one unarmed strike as a Bonus Action.</li><li><strong>Unarmored Defense:</strong> While you are not wearing armor and not wielding a shield, your base Armor Class equals 10 + your Dexterity or Strength modifier + your Wisdom modifier.</li></ul>",
    requirements: "Martial Artist 1",
    activities: {
      actMaBonusStrike: {
        _id: "actMaBonusStrike",
        type: "utility",
        name: "Bonus Strike",
        activation: {
          type: "bonus",
          value: 1,
          condition: "After taking the Attack action with an unarmed strike or Martial Artist weapon",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 3. Bad Medicine (Level 1)
write(
  "src/features/martial-artist/bad-medicine.json",
  createFeat({
    id: "MaBadMedicine001",
    name: "Bad Medicine",
    img: "icons/skills/melee/strike-punch-fist-yellow.webp",
    description:
      "<p>Your kinetic blows strike directly at vital meridian junctions and systemic vulnerabilities. When you score a critical hit with an unarmed strike or a Martial Artist weapon, you roll additional Martial Arts dice equal to your Proficiency Bonus (<code>@scale.martial-artist.bad-medicine-dice</code>) and add them to the critical hit's extra damage.</p>",
    requirements: "Martial Artist 1",
    activities: {
      actMaBadMedBurst: {
        _id: "actMaBadMedBurst",
        type: "damage",
        name: "Bad Medicine Burst",
        activation: {
          type: "special",
          value: null,
          condition: "On scoring a critical hit with an unarmed strike or Martial Artist weapon",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: false, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "@scale.martial-artist.bad-medicine-dice" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["bludgeoning"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

// 4. Kinetic Combo (Level 2)
write(
  "src/features/martial-artist/kinetic-combo.json",
  createFeat({
    id: "MaKineticCombo01",
    name: "Kinetic Combo",
    img: "icons/skills/movement/body-turn-twist-blue.webp",
    description:
      "<p>Starting at 2nd level, you master the ebb and flow of kinetic momentum, entering a dynamic three-stage combat rhythm: <strong>Neutral State</strong>, <strong>Flow State</strong>, and <strong>Finisher Ready</strong>.</p><ul><li><strong>Opening Strike (Neutral State):</strong> When you hit a hostile creature with an unarmed strike or Martial Artist weapon while in Neutral State, you enter <strong>Flow State</strong>. If the d20 roll for your attack is a natural even number, you bypass Flow State and immediately become <strong>Finisher Ready</strong>.</li><li><strong>Flow State:</strong> While in Flow State, your critical hit range expands to 18–20. You also unlock dynamic Flow Bonus Actions:<ul><li><em>Flurry of Blows:</em> Immediately after you take the Attack action on your turn, you can make two unarmed strikes as a Bonus Action.</li><li><em>Step of the Wind:</em> You can take the Disengage or Dash action as a Bonus Action on your turn, and your jump distance is doubled for the turn.</li><li><em>Patient Defense:</em> You can take the Dodge action as a Bonus Action on your turn. Taking this action resets your combo rhythm back to Neutral State.</li></ul></li><li><strong>Finishing Strike (Finisher Ready):</strong> While Finisher Ready, your critical hit range expands to 16–20. Once per turn when you make an attack, you can execute a known <strong>Finisher</strong>. After the attack resolves (hit or miss), your combo rhythm resets to Neutral State.</li></ul><p>You automatically learn three baseline Finishers: <em>Roundhouse Kick</em>, <em>Discombobulate</em>, and <em>Snap Punch</em>.</p>",
    requirements: "Martial Artist 2",
    activities: {
      actMaFlurryOfBlow: {
        _id: "actMaFlurryOfBlow",
        type: "utility",
        name: "Flurry of Blows",
        activation: {
          type: "bonus",
          value: 1,
          condition: "In Flow State, after taking the Attack action",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actMaStepOfWind01: {
        _id: "actMaStepOfWind01",
        type: "utility",
        name: "Step of the Wind",
        activation: {
          type: "bonus",
          value: 1,
          condition: "In Flow State",
        },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
      actMaPatientDef01: {
        _id: "actMaPatientDef01",
        type: "utility",
        name: "Patient Defense (Resets to Neutral)",
        activation: {
          type: "bonus",
          value: 1,
          condition: "In Flow State; resets combo to Neutral State",
        },
        duration: { units: "round", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 5. Martial Techniques (Level 2)
write(
  "src/features/martial-artist/martial-techniques.json",
  createFeat({
    id: "MaTechniques0001",
    name: "Martial Techniques",
    img: "icons/magic/control/buff-strength-muscle-damage.webp",
    description:
      "<p>In your study of martial disciplines, you have unlocked Martial Techniques—specialized enhancements and biomechanical kata that alter your kinetic combat flow. At 2nd level, you gain two Martial Techniques of your choice. You gain additional techniques as shown in the Techniques Known column of the Martial Artist table (up to 10 at 18th level).</p><p>Whenever you gain a level in this class, you can choose one of the techniques you know and replace it with another technique that you could learn at that level.</p>",
    requirements: "Martial Artist 2",
  })
);

// 6. Deflect Attacks (Level 3)
write(
  "src/features/martial-artist/deflect-attacks.json",
  createFeat({
    id: "MaDeflectAttak01",
    name: "Deflect Attacks",
    img: "icons/skills/melee/parry-block-shield-gold.webp",
    description:
      "<p>You can use your reaction to deflect or catch attacks when you are hit by an attack that deals kinetic or energy damage. When you do so, the damage you take from the attack is reduced by <code>1d10 + @abilities.dex.mod + @classes.martial-artist.levels</code>.</p><p>If you reduce the damage to 0, you can redirect the deflected kinetic energy against a creature within 5 feet of you. That creature must succeed on a Dexterity saving throw against your Program DC or take damage equal to two rolls of your Martial Arts die + your unarmed strike modifier (<code>2@scale.martial-artist.martial-arts-die + @abilities.dex.mod</code>) of the triggering damage type.</p>",
    requirements: "Martial Artist 3",
    activities: {
      actMaDeflectAttak: {
        _id: "actMaDeflectAttak",
        type: "heal",
        name: "Deflect Attacks (Damage Reduction)",
        activation: {
          type: "reaction",
          value: 1,
          condition: "Hit by an attack dealing kinetic or energy damage",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        healing: {
          number: 1,
          denomination: 10,
          types: ["healing"],
          custom: { enabled: true, formula: "1d10 + @abilities.dex.mod + @classes.martial-artist.levels" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
      actMaRedirectAtk1: {
        _id: "actMaRedirectAtk1",
        type: "save",
        name: "Redirect Deflected Attack",
        activation: {
          type: "special",
          value: null,
          condition: "When damage is reduced to 0",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "5", units: "ft" },
        save: {
          ability: ["dex"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: {
          onSave: "none",
          parts: [
            {
              custom: { enabled: true, formula: "2@scale.martial-artist.martial-arts-die + @abilities.dex.mod" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["kinetic"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

// 7. Slowfall (Level 4)
write(
  "src/features/martial-artist/slowfall.json",
  createFeat({
    id: "MaSlowfall000001",
    name: "Slowfall",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p>You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your Martial Artist level (<code>5 * @classes.martial-artist.levels</code>).</p>",
    requirements: "Martial Artist 4",
    activities: {
      actMaSlowfall0001: {
        _id: "actMaSlowfall0001",
        type: "utility",
        name: "Slowfall",
        activation: {
          type: "reaction",
          value: 1,
          condition: "When you fall",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "5 * @classes.martial-artist.levels", name: "Damage Reduction" },
      },
    },
  })
);

// 8. Extra Attack (Level 5)
write(
  "src/features/martial-artist/extra-attack.json",
  createFeat({
    id: "MaExtraAttack001",
    name: "Extra Attack",
    img: "icons/skills/melee/strike-punch-fist-blue.webp",
    description:
      "<p>You can attack twice, instead of once, whenever you take the Attack action on your turn.</p>",
    requirements: "Martial Artist 5",
  })
);

// 9. Empowered Strikes (Level 6)
write(
  "src/features/martial-artist/empowered-strikes.json",
  createFeat({
    id: "MaEmpoweredStr01",
    name: "Empowered Strikes",
    img: "icons/magic/light/hand-sparks-glow-yellow.webp",
    description:
      "<p>Your unarmed strikes are infused with resonant paracybernetic energy. Whenever you hit with an unarmed strike, you can cause it to deal Force damage instead of its normal damage type.</p>",
    requirements: "Martial Artist 6",
  })
);

// 10. Evasion (Level 7)
write(
  "src/features/martial-artist/evasion.json",
  createFeat({
    id: "MaEvasion0000001",
    name: "Evasion",
    img: "icons/skills/movement/arrows-up-diverging-blue.webp",
    description:
      "<p>Your instinctive agility lets you dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>",
    requirements: "Martial Artist 7",
  })
);

// 11. Heightened Focus (Level 10)
write(
  "src/features/martial-artist/heightened-focus.json",
  createFeat({
    id: "MaHeightFocus001",
    name: "Heightened Focus",
    img: "icons/magic/perception/eye-tendril-web-purple.webp",
    description:
      "<p>At 10th level, your Flow State reaches unmatched kinetic refinement, granting enhanced benefits to your Flow Bonus Actions:</p><ul><li><strong>Flurry of Blows:</strong> When you activate Flurry of Blows, you can make three unarmed strikes instead of two.</li><li><strong>Patient Defense:</strong> When you activate Patient Defense, you gain temporary hit points equal to two rolls of your Martial Arts die (<code>2@scale.martial-artist.martial-arts-die</code>).</li><li><strong>Step of the Wind:</strong> When you activate Step of the Wind, you can bring one willing creature of Large size or smaller that is within 5 feet of you along with your movement until the end of your turn without provoking opportunity attacks.</li></ul>",
    requirements: "Martial Artist 10",
    activities: {
      actMaHeightFocusH: {
        _id: "actMaHeightFocusH",
        type: "heal",
        name: "Patient Defense Temp HP",
        activation: {
          type: "special",
          value: null,
          condition: "When activating Patient Defense in Flow State",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        healing: {
          types: ["temphp"],
          custom: { enabled: true, formula: "2@scale.martial-artist.martial-arts-die" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
    },
  })
);

// 12. Feedback Rhythm (Level 11)
write(
  "src/features/martial-artist/feedback-rhythm.json",
  createFeat({
    id: "MaFeedbackRhyth1",
    name: "Feedback Rhythm",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p>Your terminal strikes feed dynamic momentum back into your posture. When you score a critical hit with a Finishing Strike, your kinetic combo does not reset to Neutral State; instead, you immediately return to <strong>Flow State</strong>.</p>",
    requirements: "Martial Artist 11",
  })
);

// 13. Self-Restoration (Level 13)
write(
  "src/features/martial-artist/self-restoration.json",
  createFeat({
    id: "MaSelfRestorat01",
    name: "Self-Restoration",
    img: "icons/magic/life/cross-beam-green.webp",
    description:
      "<p>Your body harnesses restorative bio-currents. At the end of each of your turns, you can automatically end one condition on yourself from among Charmed, Frightened, or Poisoned. Additionally, you suffer no penalties or exhaustion from going without food or water.</p>",
    requirements: "Martial Artist 13",
    activities: {
      actMaSelfRestor01: {
        _id: "actMaSelfRestor01",
        type: "utility",
        name: "End Condition",
        activation: {
          type: "special",
          value: null,
          condition: "End of your turn",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 14. Disciplined Survivor (Level 14)
write(
  "src/features/martial-artist/disciplined-survivor.json",
  createFeat({
    id: "MaDisciplinedS01",
    name: "Disciplined Survivor",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p>Your absolute discipline grants you proficiency in all saving throws.</p><p>Additionally, whenever you make a saving throw and fail, you can spend 1 Nanopool point to roll your Martial Arts die and add the result to the saving throw, potentially turning the failure into a success.</p>",
    requirements: "Martial Artist 14",
    activities: {
      actMaDiscipSurv01: {
        _id: "actMaDiscipSurv01",
        type: "utility",
        name: "Disciplined Survivor Reroll",
        activation: {
          type: "special",
          value: null,
          condition: "When you fail a saving throw",
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
        roll: { formula: "1@scale.martial-artist.martial-arts-die", name: "Save Bonus" },
      },
    },
  })
);

// 15. Slippery Mind (Level 15)
write(
  "src/features/martial-artist/slippery-mind.json",
  createFeat({
    id: "MaSlipperyMind01",
    name: "Slippery Mind",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description:
      "<p>You have acquired greater mental strength and paracausal psychic resistance. You have Advantage on saving throws against effects that would charm, frighten, or mentally manipulate you, and you cannot be telepathically scanned or tracked against your will.</p>",
    requirements: "Martial Artist 15",
  })
);

// 16. Critical Resurgence (Level 17)
write(
  "src/features/martial-artist/critical-resurgence.json",
  createFeat({
    id: "MaCritResurg0001",
    name: "Critical Resurgence",
    img: "icons/magic/fire/projectile-fireball-smoke-orange.webp",
    description:
      "<p>Whenever you score a critical hit against a hostile creature while in Initiative, you immediately regain 1 expended Nanopool point (up to your maximum).</p>",
    requirements: "Martial Artist 17",
    activities: {
      actMaCritResurg01: {
        _id: "actMaCritResurg01",
        type: "utility",
        name: "Restore Nanopool Point",
        activation: {
          type: "special",
          value: null,
          condition: "On scoring a critical hit against a hostile creature while in Initiative",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 17. Superior Defense (Level 18)
write(
  "src/features/martial-artist/superior-defense.json",
  createFeat({
    id: "MaSuperiorDef001",
    name: "Superior Defense",
    img: "icons/magic/defensive/armor-stone-skin.webp",
    description:
      "<p>Your rooted defensive posture becomes nearly impenetrable. While you are NOT in Flow State (such as while in Neutral State or Finisher Ready), you gain Resistance to all damage except Force damage.</p>",
    requirements: "Martial Artist 18",
  })
);

// 18. Body and Mind (Level 20)
write(
  "src/features/martial-artist/body-and-mind.json",
  createFeat({
    id: "MaBodyAndMind001",
    name: "Body and Mind",
    img: "icons/magic/light/explosion-star-glow-silhouette.webp",
    description:
      "<p>You have attained the pinnacle of martial perfection. Your Dexterity, Strength, and Wisdom scores each increase by 2, and their maximums become 24.</p><p>Additionally, when you score a critical hit with a Finishing Strike, you can execute one additional Finishing Strike on your next attack during the same turn before resetting your combo rhythm back to Neutral State.</p>",
    requirements: "Martial Artist 20",
  })
);

/* ------------------------------------------------------------------ */
/*  2. Finishers (7)                                                  */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Finishers (7) ---");

// Finisher 1: Roundhouse Kick
write(
  "src/features/martial-artist/finishers/finisher-roundhouse-kick.json",
  createFeat({
    id: "FinRoundhouseKk1",
    name: "Finisher: Roundhouse Kick",
    img: "icons/skills/melee/strike-punch-fist-blue.webp",
    description:
      "<p><em>Finisher (Prerequisite: None)</em></p><p>You unleash a devastating rotational kick. Make an unarmed strike against a target. On a hit, you do not roll your base Unarmed Strike die; it automatically deals its maximum possible damage. If the attack is a critical hit, roll your Bad Medicine dice normally.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 2",
    activities: {
      actFinRoundhouseK: {
        _id: "actFinRoundhouseK",
        type: "damage",
        name: "Roundhouse Kick Max Damage",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Roundhouse Kick",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: true, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "@scale.martial-artist.martial-arts-die" },
              number: null,
              denomination: 0,
              bonus: "",
              types: ["bludgeoning"],
              scaling: { mode: "whole", number: null, formula: "" },
            },
          ],
        },
      },
    },
  })
);

// Finisher 2: Discombobulate
write(
  "src/features/martial-artist/finishers/finisher-discombobulate.json",
  createFeat({
    id: "FinDiscombobulat",
    name: "Finisher: Discombobulate",
    img: "icons/skills/melee/strike-punch-fist-white.webp",
    description:
      "<p><em>Finisher (Prerequisite: None)</em></p><p>You deliver an acoustic shockwave or disorienting strike directly to the target's auditory and neural sensors. Make an unarmed strike. On a hit, the target must make a Constitution saving throw against your Program DC. On a failed save, the target is Blinded, Deafened, or unable to speak (your choice) for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If the attack was a critical hit, the target has Disadvantage on saving throws against this effect.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 2",
    activities: {
      actFinDiscombob01: {
        _id: "actFinDiscombob01",
        type: "save",
        name: "Discombobulate Con Save",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Discombobulate",
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

// Finisher 3: Snap Punch
write(
  "src/features/martial-artist/finishers/finisher-snap-punch.json",
  createFeat({
    id: "FinSnapPunch0001",
    name: "Finisher: Snap Punch",
    img: "icons/skills/melee/strike-punch-fist-yellow.webp",
    description:
      "<p><em>Finisher (Prerequisite: None)</em></p><p>You strike with lightning-fast snap impact. Make an unarmed strike. On a hit, the target loses its reaction until the start of your next turn. If the attack was a critical hit, the target must also succeed on a Strength saving throw against your Program DC or drop one object of your choice that it is holding, which lands at your feet.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 2",
    activities: {
      actFinSnapPunch01: {
        _id: "actFinSnapPunch01",
        type: "save",
        name: "Snap Punch Disarm (on Critical Hit)",
        activation: {
          type: "special",
          value: null,
          condition: "Critical hit with Finisher: Snap Punch",
        },
        duration: { units: "inst", value: "" },
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

// Finisher 4: Stunning Strike
write(
  "src/features/martial-artist/finishers/finisher-stunning-strike.json",
  createFeat({
    id: "FinStunningStrk1",
    name: "Finisher: Stunning Strike",
    img: "icons/magic/stun/shock-ring-teal.webp",
    description:
      "<p><em>Finisher (Prerequisite: Martial Artist Level 5)</em></p><p>You disrupt the flow of bio-currents through the target's nervous framework. Make an unarmed strike or Martial Artist weapon attack. On a hit, the target must make a Constitution saving throw against your Program DC. On a failed save, the target is <strong>Stunned</strong> until the start of your next turn. On a successful save, the target's speed is halved until the start of your next turn, and the next attack roll made against it before the start of your next turn has Advantage.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 5",
    activities: {
      actFinStunningStr: {
        _id: "actFinStunningStr",
        type: "save",
        name: "Stunning Strike Con Save",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Stunning Strike",
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

// Finisher 5: Exposing Strike
write(
  "src/features/martial-artist/finishers/finisher-exposing-strike.json",
  createFeat({
    id: "FinExposingStrk1",
    name: "Finisher: Exposing Strike",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Finisher (Prerequisite: Martial Artist Level 7)</em></p><p>You shatter an opponent's guard and reveal critical systemic weaknesses. Make an unarmed strike. On a hit, the target must make a Dexterity saving throw against your Program DC. On a failed save, the target is <strong>Exposed</strong> until the end of your next turn: the next attack roll made against the target by you or an ally is an automatic Critical Hit if it hits.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 7",
    activities: {
      actFinExposingStr: {
        _id: "actFinExposingStr",
        type: "save",
        name: "Exposing Strike Dex Save",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Exposing Strike",
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

// Finisher 6: Meridian Disrupt
write(
  "src/features/martial-artist/finishers/finisher-meridian-disrupt.json",
  createFeat({
    id: "FinMeridianDisr1",
    name: "Finisher: Meridian Disrupt",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    description:
      "<p><em>Finisher (Prerequisite: Martial Artist Level 7)</em></p><p>You drive a concentrated pulse of nanite-disruptive force directly into an opponent's nanite channels. Make an unarmed strike. On a hit, the strike deals additional Force damage equal to two rolls of your Martial Arts die (<code>2@scale.martial-artist.martial-arts-die</code>), and the target cannot execute nanoprograms or cast spells until the end of its next turn.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 7",
    activities: {
      actFinMeridianDis: {
        _id: "actFinMeridianDis",
        type: "damage",
        name: "Meridian Disrupt Force Damage",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Meridian Disrupt",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        damage: {
          critical: { allow: true, bonus: "" },
          parts: [
            {
              custom: { enabled: true, formula: "2@scale.martial-artist.martial-arts-die" },
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
  })
);

// Finisher 7: Tornado Kick
write(
  "src/features/martial-artist/finishers/finisher-tornado-kick.json",
  createFeat({
    id: "FinTornadoKick01",
    name: "Finisher: Tornado Kick",
    img: "icons/skills/movement/body-turn-twist-blue.webp",
    description:
      "<p><em>Finisher (Prerequisite: None)</em></p><p>You launch into an explosive spinning kick that sends your foe flying. Make an unarmed strike. On a hit against a Large or smaller creature, the target is pushed up to 15 feet straight away from you, and you can immediately move up to 15 feet toward the target without provoking opportunity attacks.</p>",
    subtype: "finisher",
    requirements: "Martial Artist 2",
    activities: {
      actFinTornadoKick: {
        _id: "actFinTornadoKick",
        type: "utility",
        name: "Tornado Kick Push & Follow-Up",
        activation: {
          type: "special",
          value: null,
          condition: "Hit with Finisher: Tornado Kick",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

/* ------------------------------------------------------------------ */
/*  3. Martial Techniques (25)                                        */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Martial Techniques (25) ---");

// 1. Acrobatic Physics
write(
  "src/features/martial-artist/techniques/acrobatic-physics.json",
  createFeat({
    id: "TechAcrobaticPh1",
    name: "Acrobatic Physics",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You gain the ability to move along vertical surfaces and across liquids on your turn without falling during your movement, provided you aren't wearing armor or wielding a shield.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 2. Counter Pin
write(
  "src/features/martial-artist/techniques/counter-pin.json",
  createFeat({
    id: "TechCounterPin01",
    name: "Counter Pin",
    img: "icons/skills/melee/unarmed-punch-fist.webp",
    description:
      "<p><em>Martial Technique</em></p><p>While in Flow State, when a creature within 5 feet of you misses you with a melee attack, you can use your reaction to force that creature to make a Dexterity saving throw against your Program DC. On a failed save, the creature is knocked Prone.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechCounterPin: {
        _id: "actTechCounterPin",
        type: "save",
        name: "Counter Pin Save",
        activation: {
          type: "reaction",
          value: 1,
          condition: "In Flow State, when missed by a melee attack within 5 ft",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "5", units: "ft" },
        save: {
          ability: ["dex"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// 3. Defensive Guard
write(
  "src/features/martial-artist/techniques/defensive-guard.json",
  createFeat({
    id: "TechDefensiveGrd",
    name: "Defensive Guard",
    img: "icons/skills/melee/parry-block-shield-gold.webp",
    description:
      "<p><em>Martial Technique</em></p><p>While in Neutral State, you gain a +1 bonus to your Armor Class and have Advantage on saving throws and ability checks against effects that would shove you, knock you prone, or move you against your will.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 4. Deflection Technique
write(
  "src/features/martial-artist/techniques/deflection-technique.json",
  createFeat({
    id: "TechDeflectionT1",
    name: "Deflection Technique",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p><em>Martial Technique</em></p><p>Your Deflect Attacks reaction can now be used when you are targeted by ranged nanoprogram attacks or energy attacks, reducing their damage according to your normal Deflect Attacks formula.</p>",
    subtype: "technique",
    requirements: "Martial Artist 3",
  })
);

// 5. Fated Technique
write(
  "src/features/martial-artist/techniques/fated-technique.json",
  createFeat({
    id: "TechFatedTechn01",
    name: "Fated Technique",
    img: "icons/magic/symbols/runes-carved-stone-purple.webp",
    description:
      "<p><em>Martial Technique (Prerequisite: Martial Artist Level 7)</em></p><p>When you finish a Short or Long Rest, roll a d20 and record the number rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature within 5 feet of you with this fated roll once before your next rest. You must choose to do so before the roll is made.</p>",
    subtype: "technique",
    requirements: "Martial Artist 7",
    activities: {
      actTechFatedTech1: {
        _id: "actTechFatedTech1",
        type: "utility",
        name: "Roll Fated Die",
        activation: {
          type: "special",
          value: null,
          condition: "Finish a Short or Long Rest",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "1d20", name: "Fated Roll" },
      },
    },
  })
);

// 6. Feinting Opener
write(
  "src/features/martial-artist/techniques/feinting-opener.json",
  createFeat({
    id: "TechFeintingOpn1",
    name: "Feinting Opener",
    img: "icons/skills/movement/body-turn-twist-blue.webp",
    description:
      "<p><em>Martial Technique</em></p><p>When you make an Opening Strike while in Neutral State, you can choose to make the attack roll with Disadvantage. If the attack hits despite Disadvantage, you gain Advantage on all subsequent attacks you make until the end of your current turn.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechFeintingOp: {
        _id: "actTechFeintingOp",
        type: "utility",
        name: "Feinting Opener",
        activation: {
          type: "special",
          value: null,
          condition: "Making an Opening Strike in Neutral State",
        },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 7. Fighting Style
write(
  "src/features/martial-artist/techniques/fighting-style.json",
  createFeat({
    id: "TechFightingSty1",
    name: "Fighting Style",
    img: "icons/skills/melee/strike-sword-blood-red.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You adopt a particular style of fighting as your specialty. Choose one Fighting Style feature from Chapter 6.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 8. Flexible Attribute
write(
  "src/features/martial-artist/techniques/flexible-attribute.json",
  createFeat({
    id: "TechFlexibleAttr",
    name: "Flexible Attribute",
    img: "icons/magic/control/buff-strength-muscle-damage.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You can substitute your Wisdom modifier in place of Strength, Constitution, or Intelligence for your class features, saving throw DCs, nanocasting, and Unarmored Defense calculations.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 9. Fortitude
write(
  "src/features/martial-artist/techniques/fortitude.json",
  createFeat({
    id: "TechFortitude001",
    name: "Fortitude",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description:
      "<p><em>Martial Technique (Prerequisite: Martial Artist Level 7)</em></p><p>You can use an Action or a Bonus Action to flush optical and auditory implants, immediately ending the Blinded or Deafened condition on yourself.</p>",
    subtype: "technique",
    requirements: "Martial Artist 7",
    activities: {
      actTechFortitude1: {
        _id: "actTechFortitude1",
        type: "utility",
        name: "End Blinded or Deafened",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 10. Freedom
write(
  "src/features/martial-artist/techniques/freedom.json",
  createFeat({
    id: "TechFreedom00001",
    name: "Freedom",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You ignore ordinary difficult terrain. Additionally, escaping a grapple or freeing yourself from nonmagical restraints requires only a Bonus Action instead of an Action.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechFreedom001: {
        _id: "actTechFreedom001",
        type: "utility",
        name: "Escape Grapple / Restraints",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 11. Intuition
write(
  "src/features/martial-artist/techniques/intuition.json",
  createFeat({
    id: "TechIntuition001",
    name: "Intuition",
    img: "icons/magic/perception/eye-tendril-web-purple.webp",
    description:
      "<p><em>Martial Technique</em></p><p>Your sensory perception transcends sight. Attacking an unseen creature within 10 feet of you does not impose Disadvantage on your attack rolls, and unseen creatures within 10 feet do not gain Advantage on attack rolls against you as a result of being unseen.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 12. Limber Reach
write(
  "src/features/martial-artist/techniques/limber-reach.json",
  createFeat({
    id: "TechLimberReach1",
    name: "Limber Reach",
    img: "icons/skills/melee/unarmed-punch-fist.webp",
    description:
      "<p><em>Martial Technique</em></p><p>While in Flow State, the reach of your unarmed strikes increases by 5 feet as your kinetic movement extends your operational striking range.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 13. Nemesis Technique
write(
  "src/features/martial-artist/techniques/nemesis-technique.json",
  createFeat({
    id: "TechNemesisTech1",
    name: "Nemesis Technique",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Martial Technique (Prerequisite: Martial Artist Level 13)</em></p><p>As a Bonus Action, you can challenge a creature you can see within 30 feet of you. The target must make a Wisdom saving throw against your Program DC. On a failed save, the target has Disadvantage on attack rolls against creatures other than you, and must make another Wisdom saving throw each time it attempts to move more than 30 feet away from you; on a failure, its movement speed becomes 0 until the start of its next turn. This effect lasts for 1 minute or until you challenge another creature.</p>",
    subtype: "technique",
    requirements: "Martial Artist 13",
    activities: {
      actTechNemesisTec: {
        _id: "actTechNemesisTec",
        type: "save",
        name: "Challenge Nemesis",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "30", units: "ft" },
        save: {
          ability: ["wis"],
          dc: { calculation: "wis", formula: "" },
        },
        damage: { onSave: "none", parts: [] },
      },
    },
  })
);

// 14. Open Mind
write(
  "src/features/martial-artist/techniques/open-mind.json",
  createFeat({
    id: "TechOpenMind0001",
    name: "Open Mind",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You gain proficiency in one skill of your choice. Additionally, you can spend 1 Nanopool point and 10 minutes meditating to attune your cognitive pathways. For the next 8 hours, whenever you make an ability check using a skill in which you are proficient, you can add your Wisdom modifier to the check.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechOpenMind01: {
        _id: "actTechOpenMind01",
        type: "utility",
        name: "Cognitive Attunement",
        activation: {
          type: "minute",
          value: 10,
          condition: "",
        },
        duration: { units: "hour", value: "8" },
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
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 15. Predator's Opener
write(
  "src/features/martial-artist/techniques/predators-opener.json",
  createFeat({
    id: "TechPredatorsOp1",
    name: "Predator's Opener",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    description:
      "<p><em>Martial Technique</em></p><p>When you make an Opening Strike against a creature that is surprised or that hasn't taken a turn in combat yet, you have Advantage on the attack roll.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 16. Requital
write(
  "src/features/martial-artist/techniques/requital.json",
  createFeat({
    id: "TechRequital0001",
    name: "Requital",
    img: "icons/skills/melee/parry-block-shield-gold.webp",
    description:
      "<p><em>Martial Technique (Prerequisite: Martial Artist Level 13)</em></p><p>When you take the Dodge action (including via Patient Defense), if a creature misses you with a melee attack, you can use your reaction to make a melee weapon attack or unarmed strike against that creature.</p>",
    subtype: "technique",
    requirements: "Martial Artist 13",
    activities: {
      actTechRequital01: {
        _id: "actTechRequital01",
        type: "attack",
        name: "Requital Retaliation",
        activation: {
          type: "reaction",
          value: 1,
          condition: "While dodging, when missed by a melee attack",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "5", units: "ft" },
        attack: {
          ability: "dex",
          bonus: "",
          critical: { threshold: null },
          flat: false,
          type: { value: "melee", classification: "unarmed" },
        },
      },
    },
  })
);

// 17. Restoration
write(
  "src/features/martial-artist/techniques/restoration.json",
  createFeat({
    id: "TechRestoration1",
    name: "Restoration",
    img: "icons/magic/life/cross-beam-green.webp",
    description:
      "<p><em>Martial Technique</em></p><p>When you would make an unarmed strike, you can forgo the strike and spend 1 Nanopool point to touch a creature (including yourself) and restore hit points equal to one roll of your Martial Arts die + your Wisdom modifier (<code>1@scale.martial-artist.martial-arts-die + @abilities.wis.mod</code>). If you do so, your combo rhythm immediately resets to Neutral State.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechRestorati1: {
        _id: "actTechRestorati1",
        type: "heal",
        name: "Restorative Touch",
        activation: {
          type: "special",
          value: null,
          condition: "In place of an unarmed strike; resets combo to Neutral",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        range: { value: "5", units: "ft" },
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
          custom: { enabled: true, formula: "1@scale.martial-artist.martial-arts-die + @abilities.wis.mod" },
          scaling: { mode: "whole", number: null, formula: "" },
          bonus: "",
        },
      },
    },
  })
);

// 18. Self-Disciplined
write(
  "src/features/martial-artist/techniques/self-disciplined.json",
  createFeat({
    id: "TechSelfDiscipl1",
    name: "Self-Disciplined",
    img: "icons/magic/defensive/armor-stone-skin.webp",
    description:
      "<p><em>Martial Technique (Prerequisite: Martial Artist Level 7)</em></p><p>Your internal bio-currents purge alien disruptions. At the end of each of your turns, you automatically end one condition on yourself from among Charmed, Frightened, or Poisoned. Additionally, you do not suffer exhaustion from going without food or water.</p>",
    subtype: "technique",
    requirements: "Martial Artist 7",
  })
);

// 19. Sentry Armor
write(
  "src/features/martial-artist/techniques/sentry-armor.json",
  createFeat({
    id: "TechSentryArmor1",
    name: "Sentry Armor",
    img: "icons/magic/defensive/armor-stone-skin.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You gain proficiency with Light and Medium armor. You retain all benefits of Martial Arts and Unarmored Movement even while wearing Light or Medium armor, provided you are not wielding a shield.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 20. Serenity
write(
  "src/features/martial-artist/techniques/serenity.json",
  createFeat({
    id: "TechSerenity0001",
    name: "Serenity",
    img: "icons/magic/symbols/circle-outer-ring-cyan.webp",
    description:
      "<p><em>Martial Technique</em></p><p>Your meditative calm expands your internal reserve. Your maximum Nanopool points permanently increase by an amount equal to your Wisdom modifier (minimum of +1).</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 21. Slow Fall Technique
write(
  "src/features/martial-artist/techniques/slow-fall-technique.json",
  createFeat({
    id: "TechSlowFallTech",
    name: "Slow Fall Technique",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your Martial Artist level (<code>5 * @classes.martial-artist.levels</code>).</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechSlowFall01: {
        _id: "actTechSlowFall01",
        type: "utility",
        name: "Slow Fall Technique",
        activation: {
          type: "reaction",
          value: 1,
          condition: "When you fall",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "5 * @classes.martial-artist.levels", name: "Damage Reduction" },
      },
    },
  })
);

// 22. Spirit Strike
write(
  "src/features/martial-artist/techniques/spirit-strike.json",
  createFeat({
    id: "TechSpiritStrike",
    name: "Spirit Strike",
    img: "icons/magic/light/hand-sparks-glow-yellow.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You can use your Wisdom modifier instead of Strength or Dexterity for the attack and damage rolls of your unarmed strikes and Martial Artist weapons.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 23. Stillness of Mind
write(
  "src/features/martial-artist/techniques/stillness-of-mind.json",
  createFeat({
    id: "TechStillnessMnd",
    name: "Stillness of Mind",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You can use a Bonus Action on your turn to end one effect on yourself that is causing you to be Charmed or Frightened.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
    activities: {
      actTechStillMind1: {
        _id: "actTechStillMind1",
        type: "utility",
        name: "End Charmed or Frightened",
        activation: {
          type: "bonus",
          value: 1,
          condition: "",
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { formula: "", name: "" },
      },
    },
  })
);

// 24. Unarmored Movement
write(
  "src/features/martial-artist/techniques/unarmored-movement.json",
  createFeat({
    id: "TechUnarmoredMov",
    name: "Unarmored Movement",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description:
      "<p><em>Martial Technique</em></p><p>Your walking speed increases by +10 feet while you are not wearing armor and not wielding a shield. This bonus increases to +15 feet at 6th level, +20 feet at 10th level, and +25 feet at 14th level.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

// 25. Versatile Weapon
write(
  "src/features/martial-artist/techniques/versatile-weapon.json",
  createFeat({
    id: "TechVersatileWpn",
    name: "Versatile Weapon",
    img: "icons/skills/melee/strike-sword-blood-red.webp",
    description:
      "<p><em>Martial Technique</em></p><p>You can use a Martial Artist weapon in place of an unarmed strike for your Bonus Strike and Flurry of Blows attacks, using your Martial Arts die for the weapon's damage die.</p>",
    subtype: "technique",
    requirements: "Martial Artist 2",
  })
);

/* ------------------------------------------------------------------ */
/*  4. Class Document: Martial Artist                                 */
/* ------------------------------------------------------------------ */

console.log("\n--- Generating Class Document ---");

const martialArtistClass = {
  _id: "MartialArtCls001",
  name: "Martial Artist",
  type: "class",
  img: "icons/skills/melee/unarmed-punch-fist.webp",
  system: {
    description: {
      value:
        "<p>Masters of biomechanical body-optimization and somatic nanocasting, Martial Artists fuse traditional hand-to-hand disciplines with high-frequency kinetic overclocking. Through dynamic momentum loops of Neutral flow and devastating Finishers, they control the tempo of battle with lightning agility and absolute physical discipline.</p>",
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "martial-artist",
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
        _id: "advMaHitPoints001",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      {
        _id: "advMaSavesPrf0001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:dex", "saves:str"],
          choices: [],
        },
        value: {
          chosen: [],
        },
        level: 1,
        title: "Saving Throws",
      },
      {
        _id: "advMaArmorPrf0001",
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
        _id: "advMaWeaponPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [
            "weapons:simple-blaster",
            "weapons:simple-vibro",
            "weapons:martial-vibro-light",
            "weapons:sourceweapon",
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
        _id: "advMaToolProf0001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: ["tools:artisan", "tools:gaming"],
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
        _id: "advMaSkillPrf0001",
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
                "skills:ath",
                "skills:his",
                "skills:ins",
                "skills:med",
                "skills:prc",
                "skills:ste",
                "skills:sur",
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
        _id: "advMaScArtsDie001",
        type: "ScaleValue",
        configuration: {
          identifier: "martial-arts-die",
          type: "dice",
          scale: {
            1: { number: 1, faces: 6 },
            5: { number: 1, faces: 8 },
            11: { number: 1, faces: 10 },
            17: { number: 1, faces: 12 },
          },
        },
        value: {},
        level: 1,
        title: "Martial Arts Die",
      },
      {
        _id: "advMaScNanopl0001",
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
        _id: "advMaScBadMed0001",
        type: "ScaleValue",
        configuration: {
          identifier: "bad-medicine-dice",
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
        title: "Bad Medicine Dice",
      },
      {
        _id: "advMaScTechKn0001",
        type: "ScaleValue",
        configuration: {
          identifier: "techniques-known",
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
        title: "Techniques Known",
      },
      // Level 1 Item Grants
      {
        _id: "advMaItmGrLvl0101",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaNanoProg000001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaMartialArts001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaBadMedicine001",
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
      // Level 2 Item Grants (Kinetic Combo, Martial Techniques, and 3 baseline finishers)
      {
        _id: "advMaItmGrLvl0201",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaKineticCombo01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaTechniques0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FinRoundhouseKk1",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FinDiscombobulat",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.FinSnapPunch0001",
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
        _id: "advMaSubclass0001",
        type: "Subclass",
        configuration: {
          identifier: "martial-artist-order",
        },
        value: {},
        level: 3,
        title: "Martial Artist Order",
      },
      {
        _id: "advMaItmGrLvl0301",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaDeflectAttak01",
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
      // Level 4 ASI & Slowfall
      {
        _id: "advMaASILvl040001",
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
      {
        _id: "advMaItmGrLvl0401",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaSlowfall000001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 4,
        title: "Level 4 Features",
      },
      // Level 5 Extra Attack
      {
        _id: "advMaItmGrLvl0501",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaExtraAttack001",
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
      // Level 6 Empowered Strikes
      {
        _id: "advMaItmGrLvl0601",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaEmpoweredStr01",
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
      // Level 7 Evasion
      {
        _id: "advMaItmGrLvl0701",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaEvasion0000001",
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
        _id: "advMaASILvl080001",
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
      // Level 10 ASI & Heightened Focus
      {
        _id: "advMaASILvl100001",
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
      {
        _id: "advMaItmGrLvl1001",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaHeightFocus001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 10,
        title: "Level 10 Features",
      },
      // Level 11 Feedback Rhythm
      {
        _id: "advMaItmGrLvl1101",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaFeedbackRhyth1",
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
        _id: "advMaASILvl120001",
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
      // Level 13 Self-Restoration
      {
        _id: "advMaItmGrLvl1301",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaSelfRestorat01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 13,
        title: "Level 13 Features",
      },
      // Level 14 Disciplined Survivor
      {
        _id: "advMaItmGrLvl1401",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaDisciplinedS01",
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
      // Level 15 Slippery Mind
      {
        _id: "advMaItmGrLvl1501",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaSlipperyMind01",
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
        _id: "advMaASILvl160001",
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
      // Level 17 Critical Resurgence
      {
        _id: "advMaItmGrLvl1701",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaCritResurg0001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 17,
        title: "Level 17 Features",
      },
      // Level 18 Superior Defense
      {
        _id: "advMaItmGrLvl1801",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaSuperiorDef001",
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
        _id: "advMaASILvl190001",
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
      // Level 20 Body and Mind
      {
        _id: "advMaItmGrLvl2001",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.MaBodyAndMind001",
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
  _key: "!items!MartialArtCls001",
};

write("src/classes/martial-artist.json", martialArtistClass);

console.log("\n=======================================================");
console.log("  Martial Artist class build complete (51 documents).");
console.log("=======================================================\n");
