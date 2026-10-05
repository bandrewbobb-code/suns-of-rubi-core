import fs from "fs";
import path from "path";
import crypto from "crypto";

const FEATS_DIR = path.join("src", "feats");
const BG_DIR = path.join("src", "backgrounds");

[FEATS_DIR, BG_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function generateId(prefix, name) {
  return crypto.createHash("md5").update(prefix + name).digest("hex").slice(0, 16);
}

// =========================================================================
// 1. THE 14 HOMEWORLD ORIGIN FEATS (STRICT 5e / SOR SCHEMA)
// =========================================================================
const homeworldFeats = [
  {
    name: "Adamant Origin",
    biome: "Rocky, Subterranean, or Mountain Homeworld",
    desc: "You have adapted to high-density crusts, crushing subterranean depths, and mountainous gravity.<ul><li><strong>Solid Foundation:</strong> You have Advantage on saving throws against being knocked Prone or moved against your will.</li><li><strong>Subdermal Density:</strong> You know the <em>Deflection</em> Tier 0 At-Will nanoprogram. You can execute it without requiring an NCU deck or somatic gestures. Intelligence, Wisdom, or Charisma is your nanocasting ability for it (chosen when you gain this feat).</li></ul>"
  },
  {
    name: "Airy Origin",
    biome: "Gas Giant Station, Aerial Colony, or Stormworld",
    desc: "You grew up navigating thin atmospheres, orbital drop-shafts, and atmospheric weather storms.<ul><li><strong>Atmospheric Resistance:</strong> You have Resistance to falling damage, Lightning damage, or Thunder/Sonic damage (chosen when you select this feat).</li><li><strong>Low-Oxygen Conditioning:</strong> You can hold your breath for a number of hours equal to 3 plus your Constitution modifier (minimum of 1 hour).</li></ul>"
  },
  {
    name: "Aquatic Origin",
    biome: "Ocean World or Sub-Surface Ice Moon",
    desc: "Conditioned by pelagic pressures and abyssal trenches.<ul><li><strong>Amphibious:</strong> You can breathe both air and water.</li><li><strong>Aquatic Locomotion:</strong> You gain a swimming speed equal to your walking speed. If you already have a swimming speed, it increases by 10 feet.</li><li><strong>Thermal Insulation:</strong> You have Resistance to Cold damage, and you suffer no penalties from extreme deep-sea pressure or freezing water.</li></ul>"
  },
  {
    name: "Awakened Mind Origin",
    biome: "High-Notum Anomaly, Eldritch, or Psychic Homeworld",
    desc: "Exposure to planetary Notum resonance or psionic fauna has expanded your neural conduits.<ul><li><strong>Psychic Shielding:</strong> You have Resistance to Psychic damage.</li><li><strong>Mental Bastion:</strong> You have Advantage on saving throws made to avoid or end the Charmed or Frightened conditions.</li></ul>"
  },
  {
    name: "Blazing Origin",
    biome: "Scorching, Desert, or Volcanic Homeworld",
    desc: "Hardened under blistering suns, thermal vents, and arid wastes.<ul><li><strong>Thermal Dissipation:</strong> You have Resistance to Fire damage.</li><li><strong>Arid Acclimatization:</strong> You require only half the normal water consumption for your size category. If you are subjected to an effect that causes you to start burning, you can make a DC 15 Constitution saving throw; on a success, the flames immediately extinguish.</li></ul>"
  },
  {
    name: "Brilliant Origin",
    biome: "Luminous, Binary-Star, or High-Albedo Homeworld",
    desc: "Raised on tidally locked worlds of blinding light or radiant crystal fields.<ul><li><strong>Radiant Deflection:</strong> When you take Radiant damage, you can use your Reaction to gain Resistance to Radiant damage until the end of the turn. You can use this reaction a number of times equal to your Proficiency Bonus, regaining all uses after a Long Rest.</li><li><strong>Soothing Radiance:</strong> As an Action, you can modulate a light source you are holding to emit a calming frequency. One friendly creature that rests in the light for 1 minute gains Heroic Inspiration. Once you use this feature, you cannot do so again until you finish a Short or Long Rest.</li></ul>",
    activity: { type: "utility", activation: { type: "action", value: 1 } }
  },
  {
    name: "Corrosive Origin",
    biome: "Acidic, Radioactive, or Toxic Wasteland Homeworld",
    desc: "Conditioned by chemical plumes, slag yards, and irradiated atmosphere filters.<ul><li><strong>Contaminant Resistance:</strong> You have Resistance to the damage type that matches your homeworld: Acid (Acidic), Necrotic (Radioactive), or Poison (Toxic).</li><li><strong>Bio-Filter Prowess:</strong> You have Advantage on saving throws to avoid or end the Poisoned condition.</li></ul>"
  },
  {
    name: "Cosmic Origin",
    biome: "Deep Orbit, Pulsar Station, or Temporal Rift Homeworld",
    desc: "You grew up along the fringe of galactic space where gravitational and temporal distortions bleed into everyday life.<ul><li><strong>Telemetry Aptitude:</strong> You gain proficiency in the Lore, Technology, or Insight skill.</li><li><strong>Telemetry Forecast:</strong> You can execute the <em>Telemetry Forecast</em> (Augury) program once without an NCU deck or expending Nanopool points, regaining the ability after a Long Rest. Intelligence, Wisdom, or Charisma is your nanocasting ability for it.</li></ul>",
    activity: { type: "utility", activation: { type: "minute", value: 1 } }
  },
  {
    name: "Discordant Origin",
    biome: "Lawless Station, Industrial Cacophony, or Warp World",
    desc: "Raised amid crushing urban anarchy, mechanical screech, and systemic corruption.<ul><li><strong>Sensory Dampeners:</strong> You have Resistance to Acid, Cold, Lightning, or Psychic damage (chosen when you select this feat).</li><li><strong>Static Interference:</strong> You can execute the <em>Demotivational Speech</em> program once without expending Nanopool points, regaining the ability after a Long Rest. Intelligence, Wisdom, or Charisma is your nanocasting ability for it.</li></ul>",
    activity: { type: "save", activation: { type: "action", value: 1 } }
  },
  {
    name: "Flourishing Origin",
    biome: "Verdant, Overgrown, or Untamed Jungle Homeworld",
    desc: "Tuned to the relentless, aggressive bio-rhythms of wild frontier biospheres.<ul><li><strong>Cellular Regrowth:</strong> The first time you would expend a Hit Point Die during a Short Rest to regain Hit Points, that die is not expended. You regain this benefit after a Long Rest.</li><li><strong>Sure Step:</strong> When you take the Dash action, moving through Difficult Terrain does not cost you extra movement until the end of that turn.</li></ul>"
  },
  {
    name: "Frozen Origin",
    biome: "Glacial, Cryo-Tundra, or Outer Belt Icefield Homeworld",
    desc: "Conditioned by sub-zero survival drills, permafrost, and glacial drifts.<ul><li><strong>Thermal Insulation:</strong> You have Resistance to Cold damage.</li><li><strong>Glacial Stride:</strong> You ignore Difficult Terrain caused by snow, ice, or loose cryo-gravel. While in physical contact with ice or frozen ground, you gain Tremorsense out to a range of 30 feet.</li></ul>"
  },
  {
    name: "Technologic Origin",
    biome: "Cyber-Megacity, Forge World, or Automated Shipyard",
    desc: "Raised in the heart of dense network server grids, automated manufacturing lines, and machine infrastructure.<ul><li><strong>Insulated Conduits:</strong> You have Resistance to Lightning (Ion) damage.</li><li><strong>Tech-Native:</strong> You gain proficiency in the Technology skill or with Slicer's Tools, and you can fluently read, write, and transmit SIGNAL (machine binary packet code).</li></ul>"
  },
  {
    name: "Tenebrous Origin",
    biome: "Tidally Locked Eclipse World, Void Wreck, or Shadow Moon",
    desc: "Acclimated to absolute light deprivation and the dim fringes of dead sectors.<ul><li><strong>Necrotic Insulator:</strong> You have Resistance to Necrotic damage.</li><li><strong>Shadow Stalker:</strong> You have Advantage on Death Saving Throws, and you can attempt to take the Hide action while in a Lightly Obscured area, even while in a creature's line of sight.</li></ul>"
  },
  {
    name: "Voidborn Origin",
    biome: "Deep Space Transit Fleet, Asteroid Habitat, or Zero-G Outpost",
    desc: "Raised in rotating habitats and unpressurized zero-gravity environments.<ul><li><strong>Zero-G Maneuvering:</strong> Moving through zero-gravity environments or vacuum does not cost you extra movement, and you gain a climbing speed equal to your walking speed when traversing exterior starship hulls or scaffolding.</li><li><strong>Recycled Metabolism:</strong> You can survive on half the normal rations and water before requiring saving throws against malnutrition or dehydration.</li><li><strong>Pressurization Resilience:</strong> When you make a Constitution saving throw against decompression, atmospheric toxicity, or Exhaustion, you can roll a 1d4 and add the number rolled to the save.</li></ul>"
  }
];

const featUuids = [];

console.log("Writing 14 Homeworld Origin Feats...");
homeworldFeats.forEach(feat => {
  const slug = feat.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const id = generateId("sor-feat-", slug);
  const actId = generateId("act-", slug);
  const uuid = `Compendium.suns-of-rubi-core.feats.Item.${id}`;
  featUuids.push(uuid);

  const doc = {
    _id: id,
    _key: `!items!${id}`,
    name: feat.name,
    type: "feat",
    img: "icons/magic/symbols/star-solid-gold.webp",
    system: {
      description: {
        value: `<p><strong>Prerequisite:</strong> ${feat.biome}</p><p>${feat.desc}</p>`
      },
      source: { custom: "Suns of Rubi Core" },
      type: {
        value: "origin",
        subtype: ""
      },
      prerequisites: {
        level: 1
      },
      requirements: feat.biome,
      activities: {}
    }
  };

  if (feat.activity) {
    doc.system.activities[actId] = {
      _id: actId,
      type: feat.activity.type || "utility",
      activation: feat.activity.activation || { type: "action", value: 1 },
      name: feat.name
    };
  }

  fs.writeFileSync(path.join(FEATS_DIR, `${slug}.json`), JSON.stringify(doc, null, 2), "utf8");
});

// =========================================================================
// 2. CREATE SAMPLE / CUSTOMIZABLE BACKGROUND WITH ITEMCHOICE ADVANCEMENT
// =========================================================================
console.log("Generating Customizable Outrunner Background with Feat Pool...");

const bgId = generateId("sor-bg-", "frontier-drifter");
const advChoiceId = generateId("adv-", "origin-feat-choice");

const backgroundDoc = {
  _id: bgId,
  _key: `!items!${bgId}`,
  name: "Frontier Outrunner",
  type: "background",
  img: "icons/environment/wilderness/camp-tent-night.webp",
  system: {
    description: {
      value: "<p>You have carved out a living along the lawless fringes of the galaxy. Whether traveling between orbital platforms, scavenging ancient derelicts, or trading along fringe outposts, your planetary upbringing has left an indelible mark on your survival conditioning.</p>"
    },
    source: { custom: "Suns of Rubi Core" },
    advancement: [
      {
        _id: advChoiceId,
        type: "ItemChoice",
        configuration: {
          choices: {
            "0": {
              count: 1,
              pool: featUuids
            }
          },
          allowDrops: true,
          type: "feat",
          restriction: {
            type: "origin"
          }
        },
        title: "Homeworld Origin Feat",
        icon: "icons/magic/symbols/star-solid-gold.webp"
      }
    ]
  }
};

fs.writeFileSync(path.join(BG_DIR, "frontier-outrunner.json"), JSON.stringify(backgroundDoc, null, 2), "utf8");
console.log("Background created successfully with 14 Origin Feat options configured!");
