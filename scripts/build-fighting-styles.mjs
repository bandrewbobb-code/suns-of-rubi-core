import fs from "fs";
import path from "path";
import crypto from "crypto";

const STYLES_DIR = path.join("src", "feats", "styles");
const COMMON_DIR = path.join("src", "features", "common");

[STYLES_DIR, COMMON_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function generateId(prefix, name) {
  return crypto.createHash("md5").update(prefix + name).digest("hex").slice(0, 16);
}

// =========================================================================
// 19 INDIVIDUAL FIGHTING STYLES (src/feats/styles/)
// =========================================================================
const fightingStyles = [
  {
    name: "Akimbo Style",
    slug: "akimbo-style",
    desc: "<p>While wielding separate ranged weapons in each hand with which you are proficient: when you engage in Two-Weapon Fighting, you add your ability modifier to the extra attack granted by the Light property; reloading a sidearm or ranged weapon no longer requires a free hand.</p>",
    activities: {}
  },
  {
    name: "Berserk Style",
    slug: "berserk-style",
    desc: "<p>When you hit with a melee weapon attack using Strength, you deal additional damage equal to your Strength modifier if that creature dealt damage to you since the start of your last turn.</p>",
    activities: {}
  },
  {
    name: "Blind Fighting",
    slug: "blind-fighting",
    desc: "<p>You gain Blindsight out to 10 feet. Within that range, you can effectively see anything that is not behind total cover, even if you are blinded or in darkness. You can also detect invisible creatures within this range unless they are successfully hidden.</p>",
    activities: {}
  },
  {
    name: "Brawling",
    slug: "brawling",
    desc: "<p>You utilize brute mass and close-quarters leverage: gain proficiency with improvised weapons; unarmed strike damage die increases by one step (1 -> 1d4 -> 1d6 -> 1d8 -> 1d10 -> 1d12); when you hit a creature with an unarmed strike, natural weapon, or one-handed improvised weapon, or attempt to grapple/shove on your turn, you can use a Bonus Action to make an additional unarmed strike, grapple, or shove against the same target.</p>",
    activities: {
      brawlingBonus: {
        type: "utility",
        name: "Bonus Action Strike / Grapple / Shove",
        activation: { type: "bonus", value: 1, condition: "After hitting with unarmed strike, natural weapon, 1H improvised weapon, or grapple/shove" }
      }
    }
  },
  {
    name: "Close-Quarters Shooting",
    slug: "close-quarters-shooting",
    desc: "<p>Making a ranged weapon attack while within 5 feet of a hostile creature does not impose disadvantage on the attack roll; your ranged attacks ignore half cover against targets within 15 feet; you gain a +1 bonus to attack rolls made with ranged weapons.</p>",
    activities: {}
  },
  {
    name: "Covert Style",
    slug: "covert-style",
    desc: "<p>While operating from shadows and unexpected angles: you can take the Hide action as a Bonus Action. If you can already Hide as a Bonus Action, you can instead Hide as a Reaction when gaining cover or obscuration on your turn; creatures you have damaged since the start of your last turn have disadvantage on Wisdom (Perception) checks made to find you.</p>",
    activities: {
      covertBonusHide: {
        type: "utility",
        name: "Bonus Action Hide",
        activation: { type: "bonus", value: 1 }
      },
      covertReactionHide: {
        type: "utility",
        name: "Reaction Hide (Gaining Cover)",
        activation: { type: "reaction", value: 1, condition: "When gaining cover or obscuration on your turn" }
      }
    }
  },
  {
    name: "Defense Style",
    slug: "defense-style",
    desc: "<p>You gain a +1 bonus to Armor Class while wearing light armor, medium armor, or heavy armor; you have advantage on ability checks and saving throws to avoid being moved against your will.</p>",
    activities: {}
  },
  {
    name: "Disruption Style",
    slug: "disruption-style",
    desc: "<p>You specialize in breaking enemy casting routines: when you force a creature to make a Constitution saving throw to maintain concentration and it succeeds, you can use a Bonus Action to force it to reroll the save, using the new result; once per round, when an enemy within 5 feet attempts to execute a nanoprogram, it must succeed on a Constitution save (DC = 10 + program tier) or the program fails and its Nanopool points are wasted.</p>",
    activities: {
      disruptionReroll: {
        type: "utility",
        name: "Bonus Action Concentration Reroll",
        activation: { type: "bonus", value: 1, condition: "When a target succeeds on a concentration save you forced" }
      },
      disruptionTrigger: {
        type: "save",
        name: "Nanoprogram Disruption",
        activation: { type: "reaction", value: 1, condition: "When an enemy within 5 ft attempts to execute a nanoprogram" },
        save: {
          ability: ["con"],
          dc: { calculation: "", formula: "10 + @tier" }
        }
      }
    }
  },
  {
    name: "Dueling Style",
    slug: "dueling-style",
    desc: "<p>When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.</p>",
    activities: {}
  },
  {
    name: "Equilibrium Style",
    slug: "equilibrium-style",
    desc: "<p>While wearing no armor and not wielding a medium or heavy shield: you gain a +1 bonus to Armor Class; you gain a +1 bonus to attack rolls made with unarmed strikes and melee weapons.</p>",
    activities: {}
  },
  {
    name: "Formfighting Style",
    slug: "formfighting-style",
    desc: "<p>You master the basics of enhanced weapon stances: you learn three Forms from the Fighting Forms directory; once on each of your turns, you can draw or stow a melee weapon without using an object interaction.</p>",
    activities: {}
  },
  {
    name: "Great Weapon Fighting",
    slug: "great-weapon-fighting",
    desc: "<p>When wielding a melee weapon in two hands with which you are proficient: when you roll a 1 or 2 on a damage die, you treat the roll as a 3 instead; when you hit with a two-handed melee attack using Strength, you deal additional damage equal to half your Strength modifier (rounded up, minimum of +1).</p>",
    activities: {}
  },
  {
    name: "Marksmanship",
    slug: "marksmanship",
    desc: "<p>While wielding a ranged weapon with which you are proficient, you gain a +2 bonus to attack rolls with ranged weapons.</p>",
    activities: {}
  },
  {
    name: "Sentinel Fighting",
    slug: "sentinel-fighting",
    desc: "<p>While wielding a melee weapon with which you are proficient, you can use a Bonus Action to enter a defensive stance until the start of your next turn. While in this stance, you can make a number of Opportunity Attacks equal to your Proficiency Bonus without using your Reaction, and you can use your Reaction to attack a creature that moves more than 5 feet while within your reach.</p>",
    activities: {
      sentinelStance: {
        type: "utility",
        name: "Bonus Action Defensive Stance",
        activation: { type: "bonus", value: 1 }
      },
      sentinelReachAtk: {
        type: "utility",
        name: "Reaction Reach Attack",
        activation: { type: "reaction", value: 1, condition: "When a creature moves > 5 ft while within your reach" }
      }
    }
  },
  {
    name: "Shielding",
    slug: "shielding",
    desc: "<p>While wielding a shield with which you are proficient: when a creature you can see attacks a target other than you within 5 feet, you can use your Reaction to impose disadvantage on the attack roll; when you take the Attack action with a melee weapon, you can use a Bonus Action to make a shield bash attack (1d4 kinetic damage, uses the primary attack's ability modifier); wielding a Heavy Shield no longer requires you to hold a Light weapon in your other hand.</p>",
    activities: {
      shieldingProtect: {
        type: "utility",
        name: "Reaction Impose Disadvantage",
        activation: { type: "reaction", value: 1, condition: "When a creature you can see attacks another target within 5 ft" }
      },
      shieldingBash: {
        type: "damage",
        name: "Bonus Action Shield Bash",
        activation: { type: "bonus", value: 1, condition: "When you take the Attack action with a melee weapon" },
        damage: {
          parts: [
            {
              formula: "1d4 + @mod",
              types: ["bludgeoning"]
            }
          ]
        }
      }
    }
  },
  {
    name: "Throwing",
    slug: "throwing",
    desc: "<p>While wielding a weapon with the Thrown property with which you are proficient: you gain a +2 bonus to damage rolls with a thrown weapon; when you make a ranged attack with a thrown weapon, you can draw another weapon as part of the attack; when you throw a weapon, you can move up to 5 feet without provoking opportunity attacks.</p>",
    activities: {}
  },
  {
    name: "Two-Weapon Fighting",
    slug: "two-weapon-fighting",
    desc: "<p>When you engage in Two-Weapon Fighting with separate weapons or a double weapon, you add your ability modifier to the extra attack granted by the Light property; in addition, when you make an opportunity attack, you can strike with both equipped weapons simultaneously.</p>",
    activities: {}
  },
  {
    name: "Versatile Fighting",
    slug: "versatile-fighting",
    desc: "<p>While wielding a weapon with the Versatile property in one hand and no other weapons: you gain a +1 bonus to attack rolls when wielding the weapon in one hand, and a +2 bonus to attack rolls when wielding it in two hands; once per turn, when attacking a target wielding a shield while your off-hand is empty, you can pull down their shield (no action required), denying them its AC bonus against that attack.</p>",
    activities: {}
  },
  {
    name: "War Caster Fighting",
    slug: "war-caster-fighting",
    desc: "<p>You learn two At-Will nanoprograms of your choice from any class list; you can perform the somatic components of nanoprograms even when holding weapons or a shield in one or both hands.</p>",
    activities: {}
  }
];

const styleUuids = [];

console.log("Writing 19 Fighting Styles in src/feats/styles/...");
fightingStyles.forEach(style => {
  const id = generateId("sor-fstyle-", style.slug);
  const uuid = `Compendium.suns-of-rubi-core.feats.Item.${id}`;
  styleUuids.push(uuid);

  const doc = {
    _id: id,
    _key: `!items!${id}`,
    name: style.name,
    type: "feat",
    img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
    system: {
      description: {
        value: style.desc,
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
        value: "fightingStyle",
        subtype: ""
      },
      prerequisites: {
        level: null
      },
      properties: [],
      requirements: "",
      activities: {},
      identifier: style.slug
    }
  };

  for (const [key, act] of Object.entries(style.activities)) {
    const actId = generateId("act-fs-", `${style.slug}-${key}`);
    const activityObj = {
      _id: actId,
      type: act.type || "utility",
      name: act.name,
      activation: {
        type: act.activation.type || "action",
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

    if (act.type === "save") {
      activityObj.save = {
        ability: act.save?.ability || ["con"],
        dc: act.save?.dc || { calculation: "", formula: "10 + @tier" }
      };
    }

    if (act.type === "damage") {
      activityObj.damage = act.damage || { parts: [] };
    }

    doc.system.activities[actId] = activityObj;
  }

  const filePath = path.join(STYLES_DIR, `${style.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf8");
});

// =========================================================================
// MASTER FEATURE: Fighting Style (src/features/common/fighting-style.json)
// =========================================================================
console.log("Writing Master Fighting Style feature in src/features/common/fighting-style.json...");
const masterId = generateId("sor-feat-", "fighting-style-master");
const advId = "advFightStyle001";

const masterDoc = {
  _id: masterId,
  _key: `!items!${masterId}`,
  name: "Fighting Style",
  type: "feat",
  img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
  system: {
    description: {
      value: "<p>You adopt a particular style of fighting as your specialty. Choose one Fighting Style from the compendium.</p>",
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
      level: null
    },
    properties: [],
    requirements: "",
    activities: {},
    identifier: "fighting-style",
    advancement: [
      {
        _id: advId,
        type: "ItemChoice",
        configuration: {
          choices: {
            "0": {
              count: 1,
              pool: styleUuids
            }
          },
          allowDrops: true,
          type: "feat",
          restriction: {
            type: "fightingStyle"
          }
        },
        title: "Fighting Style Choice",
        icon: "icons/skills/melee/weapons-crossed-swords-yellow.webp"
      }
    ]
  }
};

const masterPath = path.join(COMMON_DIR, "fighting-style.json");
fs.writeFileSync(masterPath, JSON.stringify(masterDoc, null, 2), "utf8");

console.log(`Generated all 19 Fighting Styles and master Fighting Style feature successfully.`);
