import fs from "fs";
import path from "path";
import crypto from "crypto";

const MASTERIES_DIR = path.join("src", "feats", "masteries");
const COMMON_DIR = path.join("src", "features", "common");

[MASTERIES_DIR, COMMON_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function generateId(prefix, name) {
  return crypto.createHash("md5").update(prefix + name).digest("hex").slice(0, 16);
}

function makeAsiAdvancement(advId, allowedAbilities, titleHint) {
  const allAbilities = ["str", "dex", "con", "int", "wis", "cha"];
  const locked = allAbilities.filter(a => !allowedAbilities.includes(a));
  return {
    _id: advId,
    type: "AbilityScoreImprovement",
    configuration: {
      cap: 1,
      fixed: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
      locked: locked,
      points: 1
    },
    value: { type: "asi" },
    level: 0,
    title: "Ability Score Improvement",
    hint: titleHint
  };
}

// =========================================================================
// 17 INDIVIDUAL FIGHTING MASTERIES (src/feats/masteries/)
// =========================================================================
const fightingMasteries = [
  {
    name: "Akimbo Mastery",
    slug: "akimbo-mastery",
    abilities: ["dex"],
    asiHint: "Increase your Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Suppressing Fire:</strong> When you roll maximum damage on a weapon damage die against a creature, that creature suffers a 1d4 penalty on the first attack roll it makes before the start of your next turn.</li>
  <li><strong>Heavy Akimbo:</strong> You can engage in Two-Weapon Fighting even when the weapons you are wielding lack the Light property. (Note: You cannot benefit from the Nick weapon mastery unless both weapons possess the Light property).</li>
  <li><strong>Synchronized Reload:</strong> You can reload two weapons simultaneously when you would normally only be able to reload one.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Brawling Mastery",
    slug: "brawling-mastery",
    abilities: ["str", "con"],
    asiHint: "Increase your Strength or Constitution score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Constitution score by 1, to a maximum of 20.</li>
  <li><strong>Street Fighter:</strong> Your improvised weapons use a d6 for damage and gain the Versatile (2d4) property. You gain a +1 bonus to attack and damage rolls made with unarmed strikes.</li>
  <li><strong>Heavyweight:</strong> Your speed isn’t halved by carrying a grappled creature who is the same size category as you or smaller.</li>
  <li><strong>Kinetic Momentum:</strong> Once per turn, when you hit a creature with an unarmed strike or an improvised weapon, you deal extra damage equal to your Proficiency Bonus.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Close-Quarters Shooting Mastery",
    slug: "close-quarters-shooting-mastery",
    abilities: ["dex"],
    asiHint: "Increase your Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Breacher:</strong> Your ranged weapon attacks ignore half cover against targets within 30 feet of you.</li>
  <li><strong>Aggressive Positioning:</strong> Other creatures provoke an opportunity attack from you when they move to within 15 feet of you while you are wielding a ranged weapon.</li>
  <li><strong>Point-Blank Execution:</strong> Once per turn, when you hit a creature within 15 feet of you with a ranged weapon attack, you can add your Proficiency Bonus to the damage roll.</li>
</ul>`,
    activities: {
      aggressivePos: {
        type: "utility",
        name: "Aggressive Positioning (OA)",
        activation: { type: "reaction", value: 1, condition: "When a creature moves to within 15 ft of you while wielding a ranged weapon" }
      }
    }
  },
  {
    name: "Defense Mastery",
    slug: "defense-mastery",
    abilities: ["str", "dex", "con"],
    asiHint: "Increase your Strength, Dexterity, or Constitution score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength, Dexterity, or Constitution score by 1, to a maximum of 20.</li>
  <li><strong>Hardened Plates:</strong> Critical hits made against you are treated as normal hits.</li>
  <li><strong>Repel:</strong> When a creature makes a melee attack against you and misses, you can use your Reaction to attempt to shove that creature up to 10 feet directly away from you.</li>
</ul>`,
    activities: {
      repel: {
        type: "utility",
        name: "Repel (Reaction Shove)",
        activation: { type: "reaction", value: 1, condition: "When a creature makes a melee attack against you and misses" }
      }
    }
  },
  {
    name: "Disruption Mastery",
    slug: "disruption-mastery",
    abilities: ["int", "wis", "cha"],
    asiHint: "Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.</li>
  <li><strong>Interrupt:</strong> When a creature within 30 feet of you that you can see executes a nanoprogram, they provoke an opportunity attack from you.</li>
  <li><strong>Concussive Feedback:</strong> Whenever you force a creature to make a saving throw to maintain concentration, the DC for the saving throw increases by an amount equal to your Proficiency Bonus.</li>
  <li><strong>System Resistance:</strong> You have advantage on saving throws against nanoprograms executed by creatures you’ve dealt damage to since the start of your last turn.</li>
</ul>`,
    activities: {
      interrupt: {
        type: "utility",
        name: "Interrupt (OA)",
        activation: { type: "reaction", value: 1, condition: "When a creature within 30 ft that you can see executes a nanoprogram" }
      }
    }
  },
  {
    name: "Dueling Mastery",
    slug: "dueling-mastery",
    abilities: ["str", "dex"],
    asiHint: "Increase your Strength or Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Flawless Parry:</strong> When a creature hits you with a melee attack, you can use your Reaction to add your Proficiency Bonus to your AC for that attack, potentially causing the attack to miss you.</li>
  <li><strong>Precision Strike:</strong> Once per turn, when you hit a target with a melee weapon attack that had Advantage, you can add 1d8 to the weapon’s damage roll.</li>
</ul>`,
    activities: {
      flawlessParry: {
        type: "utility",
        name: "Flawless Parry (+PB to AC)",
        activation: { type: "reaction", value: 1, condition: "When a creature hits you with a melee attack" }
      }
    }
  },
  {
    name: "Equilibrium Mastery",
    slug: "equilibrium-mastery",
    abilities: ["dex", "wis"],
    asiHint: "Increase your Dexterity or Wisdom score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Dexterity or Wisdom score by 1, to a maximum of 20.</li>
  <li><strong>Fluid Riposte:</strong> When a creature misses you with a weapon attack, you can use your Reaction to make an unarmed strike or weapon attack against that creature.</li>
  <li><strong>Deflect:</strong> When a creature hits you with a weapon attack, you can use your Reaction to impose a penalty to the attack roll equal to your Proficiency Bonus, potentially causing the attack to miss.</li>
  <li><strong>Nimble Recovery:</strong> If you are disarmed, you can use your Reaction to immediately catch the weapon.</li>
</ul>`,
    activities: {
      fluidRiposte: {
        type: "utility",
        name: "Fluid Riposte",
        activation: { type: "reaction", value: 1, condition: "When a creature misses you with a weapon attack" }
      },
      deflect: {
        type: "utility",
        name: "Deflect (-PB penalty)",
        activation: { type: "reaction", value: 1, condition: "When a creature hits you with a weapon attack" }
      },
      nimbleRecovery: {
        type: "utility",
        name: "Nimble Recovery (Catch Weapon)",
        activation: { type: "reaction", value: 1, condition: "If you are disarmed" }
      }
    }
  },
  {
    name: "Formfighting Mastery",
    slug: "formfighting-mastery",
    abilities: ["str", "dex", "con", "int", "wis", "cha"],
    asiHint: "Increase one ability score of your choice by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase one ability score of your choice by 1, to a maximum of 20.</li>
  <li><strong>Expanded Stances:</strong> You learn three Rubicon Bladeforms. If you already know at least three, you instead learn seven.</li>
  <li><strong>Fluid Shift:</strong> Once on each of your turns, you can enter a Bladeform without expending your Bonus Action.</li>
  <li><strong>Stance Superiority:</strong> The saving throw DC for your Bladeforms increases by 1.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Great Weapon Mastery",
    slug: "great-weapon-mastery",
    abilities: ["str"],
    asiHint: "Increase your Strength score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength score by 1, to a maximum of 20.</li>
  <li><strong>Momentum Cleave:</strong> On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 Hit Points with one, you can make one melee weapon attack as a Bonus Action.</li>
  <li><strong>Devastating Strike:</strong> Once per turn, when you hit a creature with a Heavy melee weapon, you can add extra damage equal to your Proficiency Bonus.</li>
</ul>`,
    activities: {
      momentumCleave: {
        type: "utility",
        name: "Momentum Cleave Attack",
        activation: { type: "bonus", value: 1, condition: "On your turn when scoring a crit or dropping a creature to 0 HP" }
      }
    }
  },
  {
    name: "Polearm Mastery",
    slug: "polearm-mastery",
    abilities: ["str"],
    asiHint: "Increase your Strength score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength score by 1, to a maximum of 20.</li>
  <li><strong>Control the Field:</strong> Once per turn, when you hit a creature with a halberd, quarterstaff, vibro-spear, or pike, you can move it 5 feet into an unoccupied space, provided the target is no more than one size larger than you.</li>
  <li><strong>Zone of Threat:</strong> While wielding a reach weapon, other creatures provoke an opportunity attack from you when they enter your reach.</li>
</ul>`,
    activities: {
      zoneOfThreat: {
        type: "utility",
        name: "Zone of Threat (OA)",
        activation: { type: "reaction", value: 1, condition: "When a creature enters your reach while wielding a reach weapon" }
      }
    }
  },
  {
    name: "Sentinel Mastery",
    slug: "sentinel-mastery",
    abilities: ["str", "dex"],
    asiHint: "Increase your Strength or Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Lockdown:</strong> When you hit a creature of a size no more than one size larger than you with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn.</li>
  <li><strong>Inescapable:</strong> Creatures within 5 feet of you provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.</li>
  <li><strong>Protector:</strong> When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your Reaction to make a melee weapon attack against the attacking creature.</li>
</ul>`,
    activities: {
      protector: {
        type: "utility",
        name: "Protector Attack",
        activation: { type: "reaction", value: 1, condition: "When a creature within 5 ft attacks a target other than you" }
      }
    }
  },
  {
    name: "Sharpshooting Mastery",
    slug: "sharpshooting-mastery",
    abilities: ["dex"],
    asiHint: "Increase your Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Sniper's Optics:</strong> Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls.</li>
  <li><strong>Cover Penetration:</strong> Your ranged weapon attacks ignore half cover and three-quarters cover.</li>
  <li><strong>Tactical Precision:</strong> Once per turn, when you hit a target with a ranged weapon attack that had Advantage, you can add 1d8 to the weapon’s damage roll.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Shielding Mastery",
    slug: "shielding-mastery",
    abilities: ["str", "con"],
    asiHint: "Increase your Strength or Constitution score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Constitution score by 1, to a maximum of 20.</li>
  <li><strong>Shield Bash:</strong> If you take the Attack action on your turn and hit a creature with a weapon attack, you can use a Bonus Action to shove that creature within 5 feet of you with your shield.</li>
  <li><strong>Phalanx Wall:</strong> If you aren’t incapacitated, you and allies within 5 feet of you can add your shield’s AC bonus to any Dexterity saving throw made against a nanoprogram or harmful area effect.</li>
</ul>`,
    activities: {
      shieldShove: {
        type: "utility",
        name: "Shield Shove",
        activation: { type: "bonus", value: 1, condition: "When you take the Attack action on your turn and hit with a weapon attack" }
      }
    }
  },
  {
    name: "Throwing Mastery",
    slug: "throwing-mastery",
    abilities: ["str", "dex"],
    asiHint: "Increase your Strength or Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Deadly Trajectory:</strong> You gain a +1 bonus to ranged attack rolls you make with thrown weapons, and attacking at long range doesn’t impose disadvantage.</li>
  <li><strong>Flowing Strike:</strong> When you hit a creature with a ranged weapon attack using a thrown weapon, you have advantage on your next melee weapon attack against that creature before the end of your next turn.</li>
  <li><strong>Heavy Throw:</strong> You can engage in Two-Weapon Fighting even when the melee weapons you are wielding aren’t Light, provided at least one of them has the Thrown property.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Two-Weapon Mastery",
    slug: "two-weapon-mastery",
    abilities: ["str", "dex"],
    asiHint: "Increase your Strength or Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Blade Dance:</strong> While wielding separate weapons in each hand, you gain a +1 bonus to AC.</li>
  <li><strong>Lethal Flourish:</strong> While wielding a double weapon, when you roll a 1 on a weapon damage die, you can reroll the die and must use the new roll.</li>
  <li><strong>Fluid Deployment:</strong> You can draw or stow two weapons when you would normally be able to draw or stow only one.</li>
</ul>`,
    activities: {}
  },
  {
    name: "Versatile Mastery",
    slug: "versatile-mastery",
    abilities: ["str", "dex"],
    asiHint: "Increase your Strength or Dexterity score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Strength or Dexterity score by 1, to a maximum of 20.</li>
  <li><strong>Punish the Gap:</strong> When you are the target of a melee weapon attack, you can use your Reaction to make a melee weapon attack against the target. On a hit, you impose disadvantage on the attack roll made against you.</li>
  <li><strong>Adaptive Recovery:</strong> Once per turn, if you miss an attack while wielding a weapon in two hands, you can immediately make an attack roll against the same target using one hand.</li>
  <li><strong>Forceful Pivot:</strong> Once per turn, if you miss an attack while wielding a weapon in one hand, you can immediately attempt to shove that creature up to 5 feet directly away from you.</li>
</ul>`,
    activities: {
      punishTheGap: {
        type: "utility",
        name: "Punish the Gap (Reaction Attack)",
        activation: { type: "reaction", value: 1, condition: "When you are the target of a melee weapon attack" }
      }
    }
  },
  {
    name: "War Caster Mastery",
    slug: "war-caster-mastery",
    abilities: ["int", "wis", "cha"],
    asiHint: "Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.",
    desc: `<p><strong>Prerequisite:</strong> Level 4</p>
<ul>
  <li><strong>Ability Score Increase:</strong> Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.</li>
  <li><strong>Iron Focus:</strong> You have advantage on Constitution saving throws that you make to maintain your concentration on a Nanoprogram when you take damage.</li>
  <li><strong>Reactive Execution:</strong> When a hostile creature's movement provokes an opportunity attack from you, you can use your Reaction to execute a Nanoprogram at the creature, rather than making an opportunity attack. The Nanoprogram must have an execution time of 1 Action and must target only that creature.</li>
</ul>`,
    activities: {
      reactiveExecution: {
        type: "utility",
        name: "Reactive Execution",
        activation: { type: "reaction", value: 1, condition: "When a hostile creature's movement provokes an opportunity attack from you" }
      }
    }
  }
];

const masteryUuids = [];

console.log("Writing 17 Fighting Masteries in src/feats/masteries/...");
fightingMasteries.forEach(mastery => {
  const id = generateId("sor-fmstr-", mastery.slug);
  const uuid = `Compendium.suns-of-rubi-core.feats.Item.${id}`;
  masteryUuids.push(uuid);

  const asiAdv = makeAsiAdvancement(
    generateId("adv-asi-", mastery.slug),
    mastery.abilities,
    mastery.asiHint
  );

  const doc = {
    _id: id,
    _key: `!items!${id}`,
    name: mastery.name,
    type: "feat",
    img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
    system: {
      description: {
        value: mastery.desc,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      uses: {
        spent: 0,
        recovery: [],
        max: ""
      },
      type: {
        value: "mastery",
        subtype: ""
      },
      prerequisites: {
        level: 4
      },
      properties: [],
      requirements: "Level 4",
      activities: {},
      identifier: mastery.slug,
      advancement: [asiAdv]
    }
  };

  for (const [key, act] of Object.entries(mastery.activities)) {
    const actId = generateId("act-fm-", `${mastery.slug}-${key}`);
    const activityObj = {
      _id: actId,
      type: act.type || "utility",
      name: act.name,
      activation: {
        type: act.activation.type || "reaction",
        value: act.activation.value || 1,
        condition: act.activation.condition || ""
      },
      duration: {
        units: "inst",
        value: ""
      },
      target: {
        template: { contiguous: false, units: "ft" },
        affix: false
      },
      roll: { prompt: false, visible: false },
      uses: { spent: 0, recovery: [], max: "" }
    };

    doc.system.activities[actId] = activityObj;
  }

  const filePath = path.join(MASTERIES_DIR, `${mastery.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf8");
});

// =========================================================================
// MASTER FEATURE: Fighting Mastery (src/features/common/fighting-mastery.json)
// =========================================================================
console.log("Writing Master Fighting Mastery feature in src/features/common/fighting-mastery.json...");
const masterId = generateId("sor-feat-", "fighting-mastery-master");
const advId = "advFightMstr001";

const masterDoc = {
  _id: masterId,
  _key: `!items!${masterId}`,
  name: "Fighting Mastery",
  type: "feat",
  img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
  system: {
    description: {
      value: "<p>You unlock deep kinetic mastery and muscle memory with a chosen combat style. Choose one Fighting Mastery from the compendium.</p>",
      chat: ""
    },
    source: {
      custom: "Suns of Rubi",
      book: "Suns of Rubi Core Rulebook",
      rules: "2024"
    },
    uses: {
      spent: 0,
      recovery: [],
      max: ""
    },
    type: {
      value: "class",
      subtype: ""
    },
    prerequisites: {
      level: 4
    },
    properties: [],
    requirements: "Level 4",
    activities: {},
    identifier: "fighting-mastery",
    advancement: [
      {
        _id: advId,
        type: "ItemChoice",
        configuration: {
          choices: {
            "0": {
              count: 1,
              pool: masteryUuids
            }
          },
          allowDrops: true,
          type: "feat",
          restriction: {
            type: "mastery"
          }
        },
        title: "Fighting Mastery Choice",
        icon: "icons/skills/melee/weapons-crossed-swords-yellow.webp"
      }
    ]
  }
};

const masterPath = path.join(COMMON_DIR, "fighting-mastery.json");
fs.writeFileSync(masterPath, JSON.stringify(masterDoc, null, 2), "utf8");

console.log(`Generated all 17 Fighting Masteries and master Fighting Mastery feature successfully.`);
