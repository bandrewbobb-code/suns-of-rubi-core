import fs from "fs";
import path from "path";
import crypto from "crypto";

const FORMS_DIR = path.join("src", "feats", "forms");
const COMMON_DIR = path.join("src", "features", "common");

[FORMS_DIR, COMMON_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function generateId(prefix, name) {
  return crypto.createHash("md5").update(prefix + name).digest("hex").slice(0, 16);
}

// =========================================================================
// 20 SOURCE WEAPON FIGHTING FORMS (src/feats/forms/)
// =========================================================================
const fightingForms = [
  {
    name: "Aban Form [Replaces Shien Form]",
    slug: "aban-form",
    desc: "<p>Before the end of your next turn, you can add half your Wisdom or Charisma modifier (minimum of +1) to your AC against one incoming attack.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Aban Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Arashi Form [Replaces Ataru Form]",
    slug: "arashi-form",
    desc: "<p>As a part of the bonus action to adopt this form, you can leap up to 15 feet to an unoccupied space you can see without provoking opportunity attacks.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Arashi Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Aztur Form [Replaces Juyo Form]",
    slug: "aztur-form",
    desc: "<p>Until the start of your next turn, your weapon attack critical hit range increases by 1.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Aztur Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Beast Form [Replaces Twilight Form]",
    slug: "beast-form",
    desc: "<p>As a part of the bonus action to adopt this form, make a Dexterity (Stealth) check contested by a Wisdom (Perception) check of a creature within 5 feet. On a success, you become invisible to that creature until the start of your next turn, or until you make an attack roll, execute a nanoprogram, or take a hostile action.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Beast Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Cama Form [Replaces Ishu Form]",
    slug: "cama-form",
    desc: "<p>If there is a friendly creature within 15 feet of you, you can move up to 10 feet without provoking opportunity attacks, provided you end this movement within 5 feet of that ally.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Cama Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Dalja Form [Replaces Ysannite Form]",
    slug: "dalja-form",
    desc: "<p>Until the end of your next turn, you do not have disadvantage on ranged weapon attack rolls while within 5 feet of a hostile creature. When you hit a creature within 5 feet of you with a ranged attack, their speed is reduced by 10 feet until the start of your next turn (stacks with the Slow mastery).</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Dalja Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Enel Form [Replaces Soresu Form]",
    slug: "enel-form",
    desc: "<p>The first time you take kinetic, energy, or ion damage from a weapon before the end of your next turn, that damage is reduced by half.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Enel Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Ergo Form [Replaces Niman Form]",
    slug: "ergo-form",
    desc: "<p>Until the end of your next turn, you can use Wisdom or Charisma instead of Strength or Dexterity for the attack and damage rolls of your melee weapon attacks. If you utilize the Nick mastery for an extra attack, you also use this modifier for that attack.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Ergo Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Galahad Form (Relentless) [Replaces Vaapad Form]",
    slug: "galahad-form",
    desc: "<p>You can forgo Advantage on one melee weapon attack this turn. If you do so and the attack hits, you can immediately make one additional melee weapon attack against the same target. Limit: Once per turn.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Galahad Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Gilthar Form [Replaces Jar'Kai Form]",
    slug: "gilthar-form",
    desc: "<p>Moving 5 feet after hitting a creature on this turn doesn't provoke opportunity attacks from that target. If you utilize the Nick or Cleave weapon mastery on this turn, your rapid footwork grants you a +2 bonus to AC until the start of your next turn.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Gilthar Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Hezak Form [Replaces Bakuuni Hand Form]",
    slug: "hezak-form",
    desc: "<p>If you took the Attack action, you can make one Unarmed Strike as part of the bonus action to adopt this form. Whenever you hit a target with an Unarmed Strike or a weapon utilizing the Graze mastery while in this form, the target takes additional kinetic damage equal to your Proficiency Bonus.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Hezak Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Lien Form [Replaces Drallig Form]",
    slug: "lien-form",
    desc: "<p>Until the start of your next turn, you gain a special Reaction. When a creature enters your reach or moves while within your reach, you can use this special Reaction to leap to an unoccupied space you can see within 10 feet without provoking opportunity attacks.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Lien Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      },
      {
        name: "Lien Leap",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When a creature enters reach or moves within reach" }
      }
    ]
  },
  {
    name: "Mordeth Form [Replaces Djem So Form]",
    slug: "mordeth-form",
    desc: "<p>Before the end of your next turn, you can add half your Wisdom or Charisma modifier (minimum of +1) to one ability check or attack roll you make using Strength.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Mordeth Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Ocra Form [Replaces Trakata Form]",
    slug: "ocra-form",
    desc: "<p>As a part of the bonus action to adopt this form, flourish your weapon to distract an enemy. Make a Dexterity (Sleight of Hand) or Charisma (Deception) check contested by a Wisdom (Perception) check of one creature within 5 feet. On a success, it has disadvantage on its next attack against you.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Ocra Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Roch Form [Replaces Shii-Cho Form]",
    slug: "roch-form",
    desc: "<p>When you successfully push a creature or knock it prone (such as via the Push or Topple masteries), you can immediately move up to 10 feet into an unoccupied space without provoking opportunity attacks.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Roch Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Shere Form [Replaces Trispzest Form]",
    slug: "shere-form",
    desc: "<p>Once before the start of your next turn, you have advantage on a melee weapon attack against a creature that is frightened of you.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Shere Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Sipius Form [Replaces Vonil Form]",
    slug: "sipius-form",
    desc: "<p>If you took the Attack action before adopting this form, choose a friendly creature that can see or hear you within 5 feet of a target you hit. That ally can immediately use its Reaction to make one weapon attack against the same target.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Sipius Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Vanya Form [Replaces Makashi Form]",
    slug: "vanya-form",
    desc: "<p>Until the start of your next turn, you gain a special Reaction. When a creature makes a melee weapon attack against you and misses, you can use this special Reaction to make an opportunity attack against them.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Vanya Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      },
      {
        name: "Vanya Riposte",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When a creature makes a melee attack against you and misses" }
      }
    ]
  },
  {
    name: "Xan Form [Replaces Aqinos Form]",
    slug: "xan-form",
    desc: "<p><strong>Prerequisite:</strong> The ability to execute nanoprograms.</p><p>As a part of the bonus action to adopt this form, if you execute a nanoprogram of 1st level or higher as your action (no higher than half your Max Power Level), you can make one melee weapon attack.</p>",
    requirements: "Source Weapon Proficiency, Ability to execute nanoprograms",
    activities: [
      {
        name: "Adopt Xan Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      }
    ]
  },
  {
    name: "Yutto Form / Yuttocra Form [Replaces Sokan Form]",
    slug: "yuttocra-form",
    desc: "<p>Until the start of your next turn, you ignore difficult terrain. Additionally, when a hostile creature makes a melee attack against you, you can use your Reaction to move to another space within 5 feet of that creature without provoking opportunity attacks, imposing disadvantage on the triggering roll.</p>",
    requirements: "Source Weapon Proficiency",
    activities: [
      {
        name: "Adopt Yuttocra Form",
        type: "utility",
        activation: { type: "bonus", value: 1 }
      },
      {
        name: "Fluid Evasion",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When a hostile creature makes a melee attack against you" }
      }
    ]
  }
];

const formUuids = [];

console.log("Writing 20 Source Weapon Fighting Forms in src/feats/forms/...");
fightingForms.forEach(form => {
  const id = generateId("sor-form-", form.slug);
  const uuid = `Compendium.suns-of-rubi-core.feats.Item.${id}`;
  formUuids.push(uuid);

  const doc = {
    _id: id,
    _key: `!items!${id}`,
    name: form.name,
    type: "feat",
    img: "icons/weapons/swords/sword-energy-glowing-blue.webp",
    system: {
      description: {
        value: form.desc,
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
        value: "form",
        subtype: ""
      },
      prerequisites: {
        level: null
      },
      properties: [],
      requirements: form.requirements,
      activities: {},
      identifier: form.slug
    }
  };

  form.activities.forEach(act => {
    const actId = generateId("act-form-", `${form.slug}-${act.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
    doc.system.activities[actId] = {
      _id: actId,
      type: act.type || "utility",
      name: act.name,
      activation: {
        type: act.activation.type || "bonus",
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
  });

  const filePath = path.join(FORMS_DIR, `${form.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf8");
});

// =========================================================================
// MASTER FEATURE: Fighting Forms (src/features/common/fighting-forms.json)
// =========================================================================
console.log("Writing Master Fighting Forms feature in src/features/common/fighting-forms.json...");
const masterId = generateId("sor-feat-", "fighting-forms-master");
const advId = "advFightForm001";

const masterDoc = {
  _id: masterId,
  _key: `!items!${masterId}`,
  name: "Fighting Forms",
  type: "feat",
  img: "icons/weapons/swords/sword-energy-glowing-blue.webp",
  system: {
    description: {
      value: "<p>You have learned specialized Source Weapon Fighting Forms. You can assume a Fighting Form using a Bonus Action on your turn, maintaining its benefits until your following turn begins.</p><p><strong>Form Save DC:</strong> 8 + Proficiency Bonus + your Wisdom or Charisma Modifier (your choice).</p>",
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
    requirements: "Source Weapon Proficiency",
    activities: {},
    identifier: "fighting-forms",
    advancement: [
      {
        _id: advId,
        type: "ItemChoice",
        configuration: {
          choices: {
            "0": {
              count: 1,
              pool: formUuids
            }
          },
          allowDrops: true,
          type: "feat",
          restriction: {
            type: "form"
          }
        },
        title: "Fighting Form Selection",
        icon: "icons/weapons/swords/sword-energy-glowing-blue.webp"
      }
    ]
  }
};

const masterPath = path.join(COMMON_DIR, "fighting-forms.json");
fs.writeFileSync(masterPath, JSON.stringify(masterDoc, null, 2), "utf8");

console.log(`Generated all 20 Fighting Forms and master Fighting Forms feature successfully.`);
