/**
 * scripts/build-species.mjs
 *
 * Deterministic build script generating:
 * - 35 Standalone Species Feature items in src/features/species/ (type: "feat", system.type.value: "race")
 * - 10 Playable Species items in src/species/ (type: "race")
 *
 * Adheres strictly to AGENTS.md:
 * - Unique 16-character alphanumeric _id for every document and embedded advancement
 * - _key: "!items!" + _id
 * - Modern Foundry v12/v14 system.activities and advancement schema
 * - Compendium UUID format: Compendium.suns-of-rubi-core.species-features.<_id>
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function write(relPath, obj) {
  const abs = join(ROOT, relPath);
  ensureDir(dirname(abs));

  if (obj._id && !obj._key) {
    obj._key = `!items!${obj._id}`;
  }

  writeFileSync(abs, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`  ✔  ${relPath} [${obj._id}]`);
}

// ---------------------------------------------------------------------------
// 1. SPECIES FEATURES DEFINITIONS (35 features across 10 species)
// ---------------------------------------------------------------------------
const SPECIES_FEATURES = [
  // --- Solitus Features ---
  {
    id: "SpcSolDeepReser1",
    name: "Deep Reserves",
    species: "Solitus",
    file: "deep-reserves.json",
    img: "icons/skills/wounds/heart-beat-lifeline-red.webp",
    description: `
<p>You possess a pool of bonus Hit Dice (d8s) equal to your Proficiency Bonus. You can expend these Hit Dice during a Short Rest to regain hit points just like your class Hit Dice, or use them to fuel specific Solitus lineage abilities.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@prof"
    },
    activities: {
      actDeepReserves1: {
        _id: "actDeepReserves1",
        type: "utility",
        name: "Deep Reserves",
        activation: { type: "special", value: null, condition: "During Short Rest or when spending bonus Hit Dice" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcSolBloodSwt01",
    name: "Blood and Sweat",
    species: "Solitus",
    file: "blood-and-sweat.json",
    img: "icons/skills/movement/body-turn-flexibility-red.webp",
    description: `
<p>When you fail an ability check, you can use your Reaction to expend 1 Hit Die from your pool (including from Deep Reserves). Roll the die and add the number rolled to the total, potentially turning the failure into a success.</p>
`.trim(),
    activities: {
      actBloodSweat001: {
        _id: "actBloodSweat001",
        type: "utility",
        name: "Blood and Sweat",
        activation: { type: "reaction", value: 1, condition: "When you fail an ability check" },
        consumption: {
          scaling: { allowed: false },
          spellSlot: true,
          targets: [
            {
              type: "itemUses",
              target: "",
              value: "1",
              scaling: {}
            }
          ]
        },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcSolUnmodEqui1",
    name: "Unmodified Equilibrium",
    species: "Solitus",
    file: "unmodified-equilibrium.json",
    img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
    description: `
<p>As the baseline genetic template of humanity, your natural immune and biological systems are remarkably balanced:</p>
<ul>
  <li>You have Advantage on saving throws against biological diseases and cellular degeneration.</li>
  <li>Your body never rejects cybernetic augmentations, nanotech symbionts, or neural implants.</li>
</ul>
`.trim(),
    activities: {}
  },

  // --- Opifex Features ---
  {
    id: "SpcOpiZeroGAcc01",
    name: "Zero-G Acclimation",
    species: "Opifex",
    file: "zero-g-acclimation.json",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description: `
<p>Engineered for high-altitude orbital shipyards, microgravity construction rigs, and narrow conduits, you possess extraordinary kinetic balance:</p>
<ul>
  <li>You have a Climbing speed equal to your walking speed, and you can climb magnetic or metallic surfaces vertically and across ceilings without an ability check.</li>
  <li>You ignore movement penalties, difficult terrain, and disadvantage on attacks or checks caused by zero-gravity or microgravity environments.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcOpiSynapTwit1",
    name: "Synaptic Twitch",
    species: "Opifex",
    file: "synaptic-twitch.json",
    img: "icons/magic/lightning/bolt-strike-blue.webp",
    description: `
<p>Your hyper-accelerated nervous system allows you to surge across distances in sudden bursts of speed. Once during your turn, you can double your walking speed until the end of that turn. Once you use this trait, you can't use it again until you move 0 feet on one of your subsequent turns.</p>
`.trim(),
    activities: {
      actSynapTwitch01: {
        _id: "actSynapTwitch01",
        type: "utility",
        name: "Synaptic Twitch",
        activation: { type: "special", value: null, condition: "On your turn; recharges when moving 0 ft" },
        duration: { units: "turn", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcOpiFlexFrame1",
    name: "Flexible Frame",
    species: "Opifex",
    file: "flexible-frame.json",
    img: "icons/skills/movement/figure-running-gray.webp",
    description: `
<p>Your slim silhouette and hyper-flexible joint articulation grant you the following benefits:</p>
<ul>
  <li>You can squeeze through spaces large enough for a Small creature without expending extra movement or suffering disadvantage.</li>
  <li>You have Advantage on Acrobatics checks and saving throws made to escape grapples, slip through physical restraints, or avoid the Paralyzed or Restrained conditions.</li>
</ul>
`.trim(),
    activities: {}
  },

  // --- Nanomage Features ---
  {
    id: "SpcNanInnatePrg1",
    name: "Innate Nanoprogramming",
    species: "Nanomage",
    file: "innate-nanoprogramming.json",
    img: "icons/magic/lightning/fist-glow-energy-teal.webp",
    description: `
<p>Deeply integrated with Rubi-Ka's ambient Notum grid, your nervous system naturally channels nano-programs:</p>
<ul>
  <li>At 1st level, you know two At-Will nanoprograms of your choice.</li>
  <li>At 3rd level, you learn one 1st-level nanoprogram. You can cast it once without spending Nanopool points or spell slots, regaining the ability when you finish a Long Rest.</li>
  <li>At 5th level, you learn one 2nd-level nanoprogram. You can cast it once without spending Nanopool points or spell slots, regaining the ability when you finish a Long Rest.</li>
  <li>You can cast these programs using your choice of Intelligence, Wisdom, or Charisma as your nanocasting ability (chosen when you select this species), or by expending class Nanopool points.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcNanNotumAttn1",
    name: "Notum Attunement",
    species: "Nanomage",
    file: "notum-attunement.json",
    img: "icons/magic/symbols/rune-sigil-teal.webp",
    description: `
<p>Your cells are suffused with micro-crystallized Notum. You have Advantage on saving throws against all nanoprograms, force discharges, and environmental Notum hazards (such as Notum sinkholes and field discharges).</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcNanLivDataBs1",
    name: "Living Data-Bus",
    species: "Nanomage",
    file: "living-data-bus.json",
    img: "icons/commodities/tech/circuit-board-blue.webp",
    description: `
<p>Your brain architecture functions as a biological motherboard. You gain innate proficiency in the Technology skill.</p>
`.trim(),
    activities: {},
    advancement: [
      {
        _id: "advNanDataBus001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["skills:tec"],
          choices: []
        },
        value: { chosen: [] },
        level: 0,
        title: "Living Data-Bus",
        hint: "Grants proficiency in the Technology skill."
      }
    ]
  },

  // --- Atrox Features ---
  {
    id: "SpcAtxTitanVit01",
    name: "Titan's Vitality",
    species: "Atrox",
    file: "titans-vitality.json",
    img: "icons/skills/wounds/heart-beat-lifeline-red.webp",
    description: `
<p>Engineered for brutal subterranean mining and structural combat, your physical durability is unmatched. Your maximum Hit Points increase by +1, and increase by an additional +1 whenever you gain a character level.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcAtxIndustFrm1",
    name: "Industrial Frame",
    species: "Atrox",
    file: "industrial-frame.json",
    img: "icons/magic/control/buff-strength-muscle-damage-orange.webp",
    description: `
<p>You have a massive, hyper-dense skeletal structure. You count as one size larger (Large) when determining your carrying capacity and the weight you can push, drag, or lift.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcAtxMetabEffi1",
    name: "Metabolic Efficiency",
    species: "Atrox",
    file: "metabolic-efficiency.json",
    img: "icons/consumables/food/rations-meat-bone-brown.webp",
    description: `
<p>Your engineered metabolism can function on synthetic nutrient slurry and minimal hydration. You can endure twice as many days without food or water before suffering levels of exhaustion.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcAtxHeavyHand1",
    name: "Heavy-Handed",
    species: "Atrox",
    file: "heavy-handed.json",
    img: "icons/skills/melee/unarmed-punch-fist.webp",
    description: `
<p>Your enormous fists are natural weapons that you can use to make unarmed strikes. On a hit, they deal 1d6 + your Strength modifier in kinetic (bludgeoning) damage instead of the standard unarmed strike damage.</p>
`.trim(),
    activities: {
      actHeavyHandAtk1: {
        _id: "actHeavyHandAtk1",
        type: "attack",
        name: "Heavy-Handed Strike",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        range: { units: "ft", value: "5" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, count: 1, type: "creature" },
        attack: {
          ability: "str",
          bonus: "",
          critical: { threshold: 20 },
          flat: false,
          type: { value: "melee", classification: "weapon" }
        },
        damage: {
          critical: { bonus: "" },
          includeBase: true,
          parts: [
            {
              number: 1,
              denomination: 6,
              bonus: "@abilities.str.mod",
              types: ["bludgeoning"],
              custom: { enabled: false, formula: "" },
              scaling: { mode: "whole", number: null, formula: "" }
            }
          ]
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcAtxMongoRage1",
    name: "Mongo Blood Rage",
    species: "Atrox",
    file: "mongo-blood-rage.json",
    img: "icons/skills/wounds/blood-splatter-spray-red.webp",
    description: `
<p>When you are reduced to 0 Hit Points, your autonomic combat stim-glands rupture, triggering a 1-minute blind adrenaline rage instead of falling unconscious:</p>
<ul>
  <li>Your concentration on nanoprograms immediately ends.</li>
  <li>You are immune to the Charmed and Frightened conditions.</li>
  <li>On your turns, you can only take the Attack action or Dash action.</li>
  <li>You still make death saving throws at the start of your turns as normal; however, rolled successes remove existing death save failures.</li>
  <li>The rage ends early if you regain hit points, if you neither make an attack roll nor take damage during your turn, or after 1 minute has elapsed. If you have accumulated 4 or more death saving throw failures when the rage ends, you die.</li>
  <li>Once you enter a Mongo Blood Rage, you can't do so again until you finish a Long Rest.</li>
</ul>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1"
    },
    activities: {
      actMongoBloodRg1: {
        _id: "actMongoBloodRg1",
        type: "utility",
        name: "Mongo Blood Rage",
        activation: { type: "special", value: null, condition: "When reduced to 0 HP" },
        duration: { units: "minute", value: "1" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },

  // --- Cyborg Features ---
  {
    id: "SpcCybComposPlt1",
    name: "Composite Plating",
    species: "Cyborg",
    file: "composite-plating.json",
    img: "icons/equipment/chest/breastplate-metal-banded-grey.webp",
    description: `
<p>Your dermal layers are reinforced with subcutaneous titanium mesh and ballistic composite ceramic. You gain a permanent +1 bonus to Armor Class.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcCybConstPhys1",
    name: "Constructed Physiology",
    species: "Cyborg",
    file: "constructed-physiology.json",
    img: "icons/commodities/tech/sensor-red.webp",
    description: `
<p>Your cybernetically hybridized biology provides the following defenses:</p>
<ul>
  <li>You have Advantage on saving throws against the Poisoned condition.</li>
  <li>You have Resistance to Poison damage.</li>
  <li>You are immune to biological diseases.</li>
  <li>You do not need to sleep. Instead, you enter an inactive sentry standby mode for 4 hours each day, remaining conscious and alert to surroundings.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcCybBioHarvest",
    name: "Bio-Tech Harvesting",
    species: "Cyborg",
    file: "bio-tech-harvesting.json",
    img: "icons/commodities/biological/organ-heart-purple.webp",
    description: `
<p>You can harvest mechanical components, fluid recyclers, or biological tissue from fallen organic or construct creatures:</p>
<ul>
  <li>As an Action, you can scavenge a corpse within 5 feet to gain Temporary Hit Points equal to 1d8 + your Constitution modifier + your Character Level.</li>
  <li>During a Short Rest, harvesting a fresh corpse allows you to regain 1d8 Hit Points without expending a Hit Die.</li>
  <li>You can use this trait a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.</li>
</ul>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@prof"
    },
    activities: {
      actBioHarvest001: {
        _id: "actBioHarvest001",
        type: "heal",
        name: "Bio-Tech Harvesting",
        activation: { type: "action", value: 1, condition: "Corpse of organic/construct within 5 ft" },
        duration: { units: "inst", value: "" },
        range: { units: "ft", value: "5" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, count: 1, type: "creature" },
        healing: {
          number: null,
          denomination: null,
          types: ["temphp"],
          custom: { enabled: true, formula: "1d8 + @abilities.con.mod + @details.level" },
          scaling: { mode: "whole", number: null, formula: "" }
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcCybIntegHard1",
    name: "Integrated Hardware",
    species: "Cyborg",
    file: "integrated-hardware.json",
    img: "icons/equipment/hand/glove-exoskeleton-grey.webp",
    description: `
<p>You have one simple one-handed weapon or one tool kit directly built into your forearm chassis. You can deploy or retract this hardware as a Free Action on your turn. While integrated, the item cannot be disarmed, dropped, or removed against your will.</p>
`.trim(),
    activities: {
      actIntegHardware1: {
        _id: "actIntegHardware1",
        type: "utility",
        name: "Deploy/Retract Hardware",
        activation: { type: "special", value: null, condition: "Free Action on your turn" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },

  // --- Drakken Features ---
  {
    id: "SpcDraBioPlasma1",
    name: "Bio-Plasma Breath",
    species: "Drakken",
    file: "bio-plasma-breath.json",
    img: "icons/magic/fire/breath-acid-fire-cone-yellow.webp",
    description: `
<p>When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of thermal plasma:</p>
<ul>
  <li>Shape: Choose a 15-foot Cone or a 30-foot Line that is 5 feet wide.</li>
  <li>Damage: Each creature in the area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your Proficiency Bonus). A creature takes 1d10 Fire or Cold damage (chosen when you select your lineage) on a failed save, or half as much on a successful one.</li>
  <li>Scaling: The damage increases to 2d10 at 5th level, 3d10 at 11th level, and 4d10 at 17th level.</li>
  <li>Uses: You can use this breath weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.</li>
</ul>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "@prof"
    },
    activities: {
      actBioPlasmaBr01: {
        _id: "actBioPlasmaBr01",
        type: "save",
        name: "Bio-Plasma Breath",
        activation: { type: "special", value: null, condition: "Replaces one attack on your turn" },
        duration: { units: "inst", value: "" },
        target: {
          template: { contiguous: false, units: "ft", type: "cone", size: "15" },
          affix: false
        },
        save: {
          ability: ["dex"],
          dc: { calculation: "", formula: "8 + @abilities.con.mod + @prof" }
        },
        damage: {
          parts: [
            {
              number: 1,
              denomination: 10,
              bonus: "",
              types: ["fire"],
              custom: { enabled: false, formula: "" },
              scaling: { mode: "whole", number: 1, formula: "" }
            }
          ]
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcDraUltraGlid1",
    name: "Ultralight Frame & Glide",
    species: "Drakken",
    file: "ultralight-frame-glide.json",
    img: "icons/skills/movement/feet-winged-sandals-gold.webp",
    description: `
<p>Your hollow-bone anatomy and vestigial gliding patagia grant you superior aerial mobility:</p>
<ul>
  <li>Your long and high jump distances are doubled.</li>
  <li>When falling, you can use your Reaction to extend your patagia. You negate all falling damage and can glide horizontally up to 10 feet for every 5 feet you descend.</li>
</ul>
`.trim(),
    activities: {
      actGlideReaction1: {
        _id: "actGlideReaction1",
        type: "utility",
        name: "Reaction Glide",
        activation: { type: "reaction", value: 1, condition: "When falling" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcDraThermInsu1",
    name: "Thermal Insulation",
    species: "Drakken",
    file: "thermal-insulation.json",
    img: "icons/magic/defensive/barrier-shield-dome-blue.webp",
    description: `
<p>Your scales provide innate thermal insulation. You have Resistance to Fire damage or Cold damage (matching the energy type chosen for your Bio-Plasma Breath).</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcDraSkelDisso1",
    name: "Skeletal Dissolution",
    species: "Drakken",
    file: "skeletal-dissolution.json",
    img: "icons/magic/death/skeleton-skull-pile-grey.webp",
    description: `
<p>To prevent genetic harvesting and predatory desecration, your cellular biology activates an autonomic enzymatic meltdown upon true death. Your body and skeletal remains dissolve into harmless inert powder within 10 minutes of your death.</p>
`.trim(),
    activities: {}
  },

  // --- Galadon Features ---
  {
    id: "SpcGalMultiLimb1",
    name: "Multi-Limbed Physiology",
    species: "Galadon",
    file: "multi-limbed-physiology.json",
    img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
    description: `
<p>You have four fully functional arms—two primary arms and two smaller secondary arms:</p>
<ul>
  <li>Two-handed weapons require one primary arm and one secondary arm to wield.</li>
  <li>Your secondary arms can manipulate light objects, interact with doors and terminals, reload weapons, use tools, or wield weapons with the Light property.</li>
  <li>Secondary arms cannot wield shields or non-Light weapons.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcGalOlfactSen1",
    name: "Olfactory Senses",
    species: "Galadon",
    file: "olfactory-senses.json",
    img: "icons/creatures/mammals/wolf-head-howling-blue.webp",
    description: `
<p>Your acute chemosensory chelicerae and nasal pits grant you Advantage on Wisdom (Perception) checks that rely on smell or airborne chemical tracking.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcGalSkirmishF1",
    name: "Skirmisher Form",
    species: "Galadon",
    file: "skirmisher-form.json",
    img: "icons/skills/movement/running-shadow-figure-purple.webp",
    description: `
<p>You were born into the agile hunter-scout caste of the Galadon:</p>
<ul>
  <li>You have a Climbing speed of 30 feet. You can scale vertical surfaces and move across ceilings without making an ability check.</li>
  <li>When you fail a Dexterity saving throw, you can use your Reaction to reroll it, potentially turning failure into success. Once you use this reaction, you can't use it again until you finish a Long Rest.</li>
</ul>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1"
    },
    activities: {
      actGalSkirmishSv1: {
        _id: "actGalSkirmishSv1",
        type: "utility",
        name: "Skirmisher Reflexes",
        activation: { type: "reaction", value: 1, condition: "When you fail a Dexterity saving throw" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcGalCommander1",
    name: "Commander Form",
    species: "Galadon",
    file: "commander-form.json",
    img: "icons/skills/social/intimidation-impressing.webp",
    description: `
<p>You were born into the hulking martial leadership caste of the Galadon:</p>
<ul>
  <li>You gain proficiency in your choice of the Intimidation or Persuasion skill.</li>
  <li><strong>Relentless Stand.</strong> When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once you use this trait, you can't do so again until you finish a Long Rest.</li>
  <li><strong>House War-Cry (1/LR).</strong> As an Action, you unleash a resonant acoustic battle roar. Choose one of the following effects:
    <ul>
      <li><em>Terrifying Bellow:</em> Each hostile creature within 30 feet must succeed on a Wisdom saving throw (DC = 8 + your Charisma modifier + your Proficiency Bonus) or be Frightened of you for 1 minute (save ends at end of turn).</li>
      <li><em>Emboldening Cry:</em> Allies within 60 feet who hear you become immune to the Charmed and Frightened conditions for 1 minute and can add 1d4 to one attack roll or saving throw within that duration.</li>
    </ul>
  </li>
</ul>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1"
    },
    activities: {
      actWarCryBellow1: {
        _id: "actWarCryBellow1",
        type: "save",
        name: "War-Cry: Terrifying Bellow",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "minute", value: "1" },
        target: {
          template: { contiguous: false, units: "ft", type: "radius", size: "30" },
          affix: false
        },
        save: {
          ability: ["wis"],
          dc: { calculation: "", formula: "8 + @abilities.cha.mod + @prof" }
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      },
      actWarCryEmbold1: {
        _id: "actWarCryEmbold1",
        type: "utility",
        name: "War-Cry: Emboldening Cry",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "minute", value: "1" },
        range: { units: "ft", value: "60" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, type: "ally" },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },

  // --- Yuttos Features ---
  {
    id: "SpcYutPrecognit1",
    name: "Precognition",
    species: "Yuttos",
    file: "precognition.json",
    img: "icons/magic/perception/orb-crystal-purple.webp",
    description: `
<p>Your third eye and temporal Notum sensitivity grant flashes of impending probability. When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.</p>
`.trim(),
    activities: {
      actYuttoPrecogn1: {
        _id: "actYuttoPrecogn1",
        type: "utility",
        name: "Precognitive Reroll",
        activation: { type: "special", value: null, condition: "When you roll a 1 on a d20" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcYutInscrutab1",
    name: "Inscrutable",
    species: "Yuttos",
    file: "inscrutable.json",
    img: "icons/magic/control/silhouette-hold-change-blue.webp",
    description: `
<p>Your enigmatic demeanor, layered robes, and complex biological resonance shield your true thoughts:</p>
<ul>
  <li>Wisdom (Insight) checks made against you are made with Disadvantage.</li>
  <li>You have Advantage on saving throws against having your mind read, memories extracted, or emotional state discerned through psychic or nanotech scans.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcYutCareAncKn1",
    name: "Caretakers of Ancient Knowledge",
    species: "Yuttos",
    file: "caretakers-ancient-knowledge.json",
    img: "icons/sundries/books/book-embossed-gold-purple.webp",
    description: `
<p>You possess ancestral memories handed down from the oldest custodians of Rubi-Ka:</p>
<ul>
  <li>You gain proficiency in the Lore skill.</li>
  <li>You add double your Proficiency Bonus to any check regarding ancient precursor history, alien glyphs, and forgotten archaeological ruins.</li>
</ul>
`.trim(),
    activities: {},
    advancement: [
      {
        _id: "advYutLoreSkl001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["skills:lor"],
          choices: []
        },
        value: { chosen: [] },
        level: 0,
        title: "Caretakers of Ancient Knowledge",
        hint: "Grants proficiency in the Lore skill."
      }
    ]
  },

  // --- Krenari Features ---
  {
    id: "SpcKreCellClot01",
    name: "Cellular Clotting",
    species: "Krenari",
    file: "cellular-clotting.json",
    img: "icons/skills/wounds/blood-drip-red.webp",
    description: `
<p>When you take damage (and are not reduced to 0 hit points), you can use your Reaction to expend 1 Hit Die. Roll the die and add your Constitution modifier; you immediately regain that many hit points.</p>
<p>You can use this reaction a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@prof"
    },
    activities: {
      actCellClotting1: {
        _id: "actCellClotting1",
        type: "heal",
        name: "Cellular Clotting",
        activation: { type: "reaction", value: 1, condition: "When taking damage (not reduced to 0 HP)" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, type: "self" },
        healing: {
          number: null,
          denomination: null,
          types: ["healing"],
          custom: { enabled: true, formula: "1d8 + @abilities.con.mod" },
          scaling: { mode: "whole", number: null, formula: "" }
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcKreQuadStalk1",
    name: "Quadrupedal Stalker",
    species: "Krenari",
    file: "quadrupedal-stalker.json",
    img: "icons/creatures/mammals/wolf-howl-silhouette-gray.webp",
    description: `
<p>Your lupine/feline skeletal build excels at rapid bounding strides:</p>
<ul>
  <li>You have Advantage on Constitution saving throws against exhaustion caused by a forced march.</li>
  <li>When both of your hands are empty and you take the Dash action, your walking speed increases by an additional 15 feet for that turn as you drop to all fours.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "SpcKreKeenHear01",
    name: "Keen Hearing and Smell",
    species: "Krenari",
    file: "keen-hearing-smell.json",
    img: "icons/creatures/eyes/feline-cat-green.webp",
    description: `
<p>You have Advantage on Wisdom (Perception) checks that rely on hearing or smell.</p>
`.trim(),
    activities: {}
  },
  {
    id: "SpcKreToothClaw1",
    name: "Tooth and Claw",
    species: "Krenari",
    file: "tooth-and-claw.json",
    img: "icons/skills/melee/unarmed-slash-claws.webp",
    description: `
<p>Your sharp fangs and retractable carbon-composite claws are natural weapons that you can use to make unarmed strikes. On a hit, they deal 1d6 + your Strength modifier in slashing or piercing damage instead of standard unarmed damage.</p>
`.trim(),
    activities: {
      actToothClawAtk1: {
        _id: "actToothClawAtk1",
        type: "attack",
        name: "Tooth and Claw Strike",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        range: { units: "ft", value: "5" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, count: 1, type: "creature" },
        attack: {
          ability: "str",
          bonus: "",
          critical: { threshold: 20 },
          flat: false,
          type: { value: "melee", classification: "weapon" }
        },
        damage: {
          critical: { bonus: "" },
          includeBase: true,
          parts: [
            {
              number: 1,
              denomination: 6,
              bonus: "@abilities.str.mod",
              types: ["slashing"],
              custom: { enabled: false, formula: "" },
              scaling: { mode: "whole", number: null, formula: "" }
            }
          ]
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },

  // --- Hiisi Features ---
  {
    id: "SpcHiiAdrenRush1",
    name: "Adrenaline Rush",
    species: "Hiisi",
    file: "adrenaline-rush.json",
    img: "icons/magic/movement/trail-streak-zigzag-yellow.webp",
    description: `
<p>You can take the Dash action as a Bonus Action. When you take this bonus action, you gain Temporary Hit Points equal to your Proficiency Bonus.</p>
<p>You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "sr", type: "recoverAll" }],
      max: "@prof"
    },
    activities: {
      actAdrenRush0001: {
        _id: "actAdrenRush0001",
        type: "heal",
        name: "Adrenaline Rush",
        activation: { type: "bonus", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false, type: "self" },
        healing: {
          number: null,
          denomination: null,
          types: ["temphp"],
          custom: { enabled: true, formula: "@prof" },
          scaling: { mode: "whole", number: null, formula: "" }
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "SpcHiiRelentEnd1",
    name: "Relentless Endurance",
    species: "Hiisi",
    file: "relentless-endurance.json",
    img: "icons/skills/wounds/injury-face-scar-red.webp",
    description: `
<p>When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't use it again until you finish a Long Rest.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "1"
    },
    activities: {
      actHiisiEnduran1: {
        _id: "actHiisiEnduran1",
        type: "utility",
        name: "Relentless Endurance",
        activation: { type: "special", value: null, condition: "When reduced to 0 HP" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  }
];

// ---------------------------------------------------------------------------
// 2. PLAYABLE SPECIES DATA DEFINITIONS (10 Species)
// ---------------------------------------------------------------------------
const SPECIES_DATA = [
  {
    id: "RaceSolitus00001",
    name: "Solitus",
    file: "solitus.json",
    img: "icons/commodities/biological/eye-blue-red.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Solitus",
    speed: { walk: 30, climb: null },
    senses: { darkvision: null, special: "" },
    featureIds: [
      "SpcSolDeepReser1",
      "SpcSolBloodSwt01",
      "SpcSolUnmodEqui1"
    ],
    languages: "Solitus trade dialects",
    lore: `
<p>The <strong>Solitus</strong> represent the unspecialized, standard genetic template of baseline humanity. Without radical physical alterations or environmental nanite acclimation, Solitus thrive through sheer grit, adaptability, and versatility.</p>
<h3>Biology &amp; Cybernetic Harmony</h3>
<p>Because their cellular physiology is unmodified by extreme gene-tailoring, Solitus bodies never reject artificial cybernetics, prosthetic limbs, or experimental nanotech implants. Their deep biological reserves allow them to push through exhaustion where specialized breeds falter.</p>
<h3>Solitus Names</h3>
<p>Solitus naming conventions span ancient Earth lineage names, corporate-assigned designations, and frontier colonist monikers.</p>
<ul>
  <li><em>Male Names:</em> Sean, Marcus, Jack, Aaron, Viktor, Dennis, Kevin.</li>
  <li><em>Female Names:</em> Elena, Sarah, Chloe, Maya, Valerie, Jennifer, Rebecca.</li>
  <li><em>Family/Clan Names:</em> Bradley, Mercer, Thorne, Ross, Vance, Sterling.</li>
</ul>
`.trim()
  },
  {
    id: "RaceOpifex000001",
    name: "Opifex",
    file: "opifex.json",
    img: "icons/equipment/head/hood-cloth-grey.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Opifex",
    speed: { walk: 35, climb: 35 },
    senses: { darkvision: 60, special: "" },
    featureIds: [
      "SpcOpiZeroGAcc01",
      "SpcOpiSynapTwit1",
      "SpcOpiFlexFrame1"
    ],
    languages: "Opifex dialect",
    lore: `
<p>The <strong>Opifex</strong> are lean, lithe, and hyper-agile post-humans genetically engineered for high-altitude orbital shipyards, zero-gravity manufacturing rings, and intricate nano-circuit assembly.</p>
<h3>Agile Physiology</h3>
<p>Possessing an elongated skeletal frame and hyper-efficient reflex arcs, an Opifex moves with startling speed and fluidity. Their eyes are bio-luminescent, granting them clear vision in dark maintenance shafts and the blackness of orbital space.</p>
<h3>Opifex Names</h3>
<p>Opifex names tend to be short, melodic, and fast on the tongue, often featuring sibilant syllables and clicking vocal tones.</p>
<ul>
  <li><em>Names:</em> Syl, Kaelen, Nix, Zephyr, Rasia, Vesper, Lyra, Jinx, Skyler.</li>
  <li><em>Surnames:</em> Quickwire, Vane, Vector, Shift, Driftwood, Apex.</li>
</ul>
`.trim()
  },
  {
    id: "RaceNanomage0001",
    name: "Nanomage",
    file: "nanomage.json",
    img: "icons/magic/light/orbs-hand-floating-teal.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Nanomage",
    speed: { walk: 30, climb: null },
    senses: { darkvision: null, special: "" },
    featureIds: [
      "SpcNanInnatePrg1",
      "SpcNanNotumAttn1",
      "SpcNanLivDataBs1"
    ],
    languages: "Nanomage matrix glyphs",
    lore: `
<p>The <strong>Nanomage</strong> are an enigmatic, ethereal species created directly on Rubi-Ka. Their physiology is intimately bonded with ambient Notum, turning their cellular matrix into a living computational network.</p>
<h3>Notum Symbiosis</h3>
<p>Nanomages possess frail, pale bodies with faint traces of glowing Notum veining their skin. While physically less robust than other breeds, their mental processing power and instinctive mastery of nanoprogramming surpass all others.</p>
<h3>Nanomage Names</h3>
<p>Nanomage designations often sound archaic, mathematical, or philosophical, combining classical scholar titles with numeric suffixes.</p>
<ul>
  <li><em>Names:</em> Solon, Thalor, Elyon, Morzan, Astra, Vespera, Mnemosyne, Valen.</li>
  <li><em>Cognomens:</em> Zero, Prime, Notum-Touched, Null, Synthet, Axiom.</li>
</ul>
`.trim()
  },
  {
    id: "RaceAtrox0000001",
    name: "Atrox",
    file: "atrox.json",
    img: "icons/magic/control/buff-strength-muscle-damage-orange.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Atrox",
    speed: { walk: 30, climb: null },
    senses: { darkvision: null, special: "" },
    featureIds: [
      "SpcAtxTitanVit01",
      "SpcAtxIndustFrm1",
      "SpcAtxMetabEffi1",
      "SpcAtxHeavyHand1",
      "SpcAtxMongoRage1"
    ],
    languages: "Atrox colloquial cant",
    lore: `
<p>The <strong>Atrox</strong> are massive, genderless humanoids engineered by Omni-Tek for heavy labor in deep subterranean Notum mines and brutal industrial construction. They possess immense muscle mass, dense bone structures, and profound resilience.</p>
<h3>Heart of Gold, Fists of Steel</h3>
<p>Though initially bred as unthinking laborers, the Atrox developed a strong oral tradition, profound sense of fraternity, and deep emotional bonds with their comrades. When cornered, their autonomic glands trigger the legendary Mongo Blood Rage, allowing them to fight on past mortal thresholds.</p>
<h3>Atrox Names</h3>
<p>Atrox adopt simple, evocative names based on physical traits, industrial machinery, or humorous nicknames given by their fellows.</p>
<ul>
  <li><em>Names:</em> Bumper, Hammer, Stone, Crag, Mongo, Bulk, Gasket, Anvil, Tank, Beef.</li>
</ul>
`.trim()
  },
  {
    id: "RaceCyborg000001",
    name: "Cyborg",
    file: "cyborg.json",
    img: "icons/commodities/tech/sensor-red.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Cyborg",
    speed: { walk: 30, climb: null },
    senses: { darkvision: null, special: "" },
    featureIds: [
      "SpcCybComposPlt1",
      "SpcCybConstPhys1",
      "SpcCybBioHarvest",
      "SpcCybIntegHard1"
    ],
    languages: "Binary machine code / Trade",
    lore: `
<p>The <strong>Cyborgs</strong> of Rubi-Ka are the product of extensive military and industrial augmentation—renegade combat units, reconstructed survivors, and cybernetically ascended outlaws whose flesh has been heavily replaced with steel and silicon.</p>
<h3>Constructed Synergy</h3>
<p>With integrated armor plating, toxic resistance, and internal hydraulic actuators, Cyborgs can field-strip enemy machines and fallen foes for parts, repairing their own systems mid-engagement.</p>
<h3>Cyborg Designations</h3>
<p>Cyborgs often carry alphanumeric military serials, factory model designations, or adopted hacker callsigns.</p>
<ul>
  <li><em>Callsigns:</em> Unit-77, Iron-Eye, Splicer, Rust, Glitch, Chronos, Vector-9, Chrome.</li>
</ul>
`.trim()
  },
  {
    id: "RaceDrakken00001",
    name: "Drakken",
    file: "drakken.json",
    img: "icons/creatures/reptiles/lizard-horned-striped-green.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Drakken",
    speed: { walk: 30, climb: null },
    senses: { darkvision: 60, special: "Thermal Optics" },
    featureIds: [
      "SpcDraBioPlasma1",
      "SpcDraUltraGlid1",
      "SpcDraThermInsu1",
      "SpcDraSkelDisso1"
    ],
    languages: "Draconic-Trade cant",
    lore: `
<p>The <strong>Drakken</strong> are reptilian humanoid warriors engineered for extreme planetary environments, volcanic mining calderas, and atmospheric orbital re-entry zones.</p>
<h3>Plasma Glands &amp; Gliding Patagia</h3>
<p>Covered in heat-dissipating scales, Drakken can unleash bursts of volatile bio-plasma from internal thermal glands. Their hollow-bone anatomy and flexible skin membranes allow them to glide gracefully across wide chasms and drop safely from immense heights.</p>
<h3>Drakken Names</h3>
<p>Drakken names feature harsh consonants, hissed sibilants, and volcanic descriptors.</p>
<ul>
  <li><em>Names:</em> Kaelis, Vraxis, Skarren, Ignis, Thrax, Zhar, Pyra, Ashor.</li>
</ul>
`.trim()
  },
  {
    id: "RaceGaladon00001",
    name: "Galadon",
    file: "galadon.json",
    img: "icons/creatures/invertebrates/spider-striped-grey.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Galadon",
    speed: { walk: 30, climb: null },
    senses: { darkvision: 60, special: "" },
    featureIds: [
      "SpcGalMultiLimb1",
      "SpcGalOlfactSen1"
    ],
    choiceAdvancement: {
      id: "advGaladonChoice",
      title: "Galadon Caste Form",
      hint: "Choose between the agile Skirmisher Form or the commanding Commander Form.",
      pool: [
        { uuid: "Compendium.suns-of-rubi-core.species-features.SpcGalSkirmishF1" },
        { uuid: "Compendium.suns-of-rubi-core.species-features.SpcGalCommander1" }
      ]
    },
    languages: "Galadon hive-cant",
    lore: `
<p>The <strong>Galadon</strong> are a four-armed, chitinous species possessing a rigid feudal caste structure. Renowned as lethal skirmishers and unflinching tactical commanders, they view combat as an exacting art form.</p>
<h3>Four Arms &amp; Pheromone Senses</h3>
<p>Their multi-limbed physiology allows them to operate complex heavy weapon systems, reload sidearms, or wield multiple vibro-blades simultaneously while tracking targets through acute olfactory chemoreceptors.</p>
<h3>Galadon Names</h3>
<p>Galadon names combine hard clicks and guttural clan lineage titles.</p>
<ul>
  <li><em>Names:</em> Krix, Vorn, Xylar, Gresh, Malok, Qirra, T'Kalon, Draxar.</li>
  <li><em>House Titles:</em> House Vorn, House Krell, House Skaar.</li>
</ul>
`.trim()
  },
  {
    id: "RaceYuttos000001",
    name: "Yuttos",
    file: "yuttos.json",
    img: "icons/magic/perception/orb-crystal-purple.webp",
    sizes: ["sm", "med"],
    creatureType: "humanoid",
    subtype: "Yuttos",
    speed: { walk: 30, climb: null },
    senses: { darkvision: null, special: "" },
    featureIds: [
      "SpcYutPrecognit1",
      "SpcYutInscrutab1",
      "SpcYutCareAncKn1"
    ],
    languages: "Ancient Yutto cant",
    lore: `
<p>The <strong>Yuttos</strong> are the ancient, robed caretakers of Rubi-Ka. Little is known of their biological origins, as they remain perpetually concealed beneath layered garments, cowls, and intricate filtration masks.</p>
<h3>Keepers of Precursor Lore</h3>
<p>Possessing an innate precognitive awareness of impending disaster and deep knowledge of precursor ruins, Yuttos offer cryptic guidance to travelers, wandering the desert wastes as solitary hermits or in small communal conclaves.</p>
<h3>Yuttos Names</h3>
<p>Yuttos take names derived from natural planetary phenomena, seasonal stars, and ancient proverbs.</p>
<ul>
  <li><em>Names:</em> One-Who-Watches, Dust-Drifter, Sage-of-the-Oasis, Whisper, Oru, Yut-Tek.</li>
</ul>
`.trim()
  },
  {
    id: "RaceKrenari00001",
    name: "Krenari",
    file: "krenari.json",
    img: "icons/creatures/mammals/wolf-howl-silhouette-gray.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Krenari",
    speed: { walk: 30, climb: null },
    senses: { darkvision: 60, special: "" },
    featureIds: [
      "SpcKreCellClot01",
      "SpcKreQuadStalk1",
      "SpcKreKeenHear01",
      "SpcKreToothClaw1"
    ],
    languages: "Krenari pack-dialect",
    lore: `
<p>The <strong>Krenari</strong> are predatory beast-folk with keen canine and feline traits, bred for harsh wilderness reconnaissance, tracking fugitive targets across frozen tundra, and desert survival.</p>
<h3>Primal Pack Instincts</h3>
<p>With razor-sharp claws, acute hearing, and the ability to drop onto all fours for rapid overland pursuits, Krenari are fiercely loyal to their chosen companions, treating their adventuring party as an indivisible pack.</p>
<h3>Krenari Names</h3>
<p>Krenari names are guttural and energetic, often earned through hunting feats.</p>
<ul>
  <li><em>Names:</em> Fenris, Korr, Varg, Kira, Luna, Talon, Fang, Shadow-Stalker.</li>
</ul>
`.trim()
  },
  {
    id: "RaceHiisi0000001",
    name: "Hiisi",
    file: "hiisi.json",
    img: "icons/creatures/magical/humanoid-silhouette-glowing-pink.webp",
    sizes: ["med"],
    creatureType: "humanoid",
    subtype: "Hiisi",
    speed: { walk: 30, climb: null },
    senses: { darkvision: 120, special: "Superior Darkvision" },
    featureIds: [
      "SpcHiiAdrenRush1",
      "SpcHiiRelentEnd1"
    ],
    languages: "Hiisi underground cant",
    lore: `
<p>The <strong>Hiisi</strong> are tough, subterranean scavengers and skirmishers who dwell in the volcanic tunnels, abandoned mining shafts, and subterranean caverns deep below the surface of Rubi-Ka.</p>
<h3>Subterranean Tenacity</h3>
<p>Accustomed to pitch-black darkness, Hiisi possess superior darkvision and explosive adrenaline glands. When cornered, their fierce survival instinct kicks in, allowing them to sprint out of danger or shrug off mortal blows that would fell an ordinary soldier.</p>
<h3>Hiisi Names</h3>
<p>Hiisi names are sharp, quick, and informal, often emphasizing survival instincts.</p>
<ul>
  <li><em>Names:</em> Skitt, Razz, Grendel, Tusk, Snarl, Vex, Grime, Klink.</li>
</ul>
`.trim()
  }
];

// ---------------------------------------------------------------------------
// 3. EXECUTION
// ---------------------------------------------------------------------------
console.log("=== Building Suns of Rubi: Species Features ===");
ensureDir("src/features/species");

for (const feat of SPECIES_FEATURES) {
  const doc = {
    _id: feat.id,
    name: feat.name,
    type: "feat",
    img: feat.img,
    system: {
      description: {
        value: feat.description,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      uses: feat.uses ?? {
        spent: 0,
        recovery: [],
        max: ""
      },
      type: {
        value: "race",
        subtype: ""
      },
      prerequisites: {
        level: null
      },
      properties: [],
      requirements: feat.species,
      activities: feat.activities ?? {},
      identifier: feat.file.replace(".json", "")
    }
  };

  if (feat.advancement) {
    doc.system.advancement = feat.advancement;
  }

  write(`src/features/species/${feat.file}`, doc);
}

console.log("\n=== Building Suns of Rubi: Species Items ===");
ensureDir("src/species");

for (const sp of SPECIES_DATA) {
  const advancements = [];

  // 1. Size Advancement
  advancements.push({
    _id: `${sp.id.slice(0, 12)}Siz1`,
    type: "Size",
    configuration: {
      sizes: sp.sizes
    },
    level: 0,
    title: "Size",
    hint: `Your size is ${sp.sizes.includes("sm") ? "Small or Medium" : "Medium"}.`,
    value: {}
  });

  // 2. Trait: Senses (if darkvision exists)
  if (sp.senses.darkvision) {
    advancements.push({
      _id: `${sp.id.slice(0, 12)}Sen1`,
      type: "Trait",
      configuration: {
        mode: "default",
        allowReplacements: false,
        grants: ["senses:darkvision"],
        choices: []
      },
      value: { chosen: [] },
      level: 0,
      title: "Darkvision",
      hint: `You have Darkvision with a range of ${sp.senses.darkvision} feet.`
    });
  }

  // 3. Trait: Languages
  advancements.push({
    _id: `${sp.id.slice(0, 12)}Lng1`,
    type: "Trait",
    configuration: {
      mode: "default",
      allowReplacements: false,
      grants: ["languages:standard:common"],
      choices: [
        {
          count: 1,
          pool: ["languages:standard:*"]
        }
      ]
    },
    value: { chosen: [] },
    level: 0,
    title: "Languages",
    hint: `You speak Galactic Trade (Common) and one additional language such as ${sp.languages}.`
  });

  // 4. ItemGrant: Species Features
  advancements.push({
    _id: `${sp.id.slice(0, 12)}Fgt1`,
    type: "ItemGrant",
    configuration: {
      items: sp.featureIds.map(fid => ({
        uuid: `Compendium.suns-of-rubi-core.species-features.${fid}`,
        optional: false
      })),
      optional: false,
      spell: null
    },
    value: {},
    level: 0,
    title: `${sp.name} Traits`,
    hint: `Grants the innate traits of the ${sp.name}.`
  });

  // 5. ItemChoice: If species has choice (Galadon)
  if (sp.choiceAdvancement) {
    advancements.push({
      _id: `${sp.id.slice(0, 12)}Chc1`,
      type: "ItemChoice",
      configuration: {
        choices: {
          "0": {
            count: 1,
            replacement: false
          }
        },
        allowDrops: false,
        type: "feat",
        pool: sp.choiceAdvancement.pool,
        spell: null,
        restriction: {}
      },
      value: {
        added: {},
        replaced: {}
      },
      level: 0,
      title: sp.choiceAdvancement.title,
      hint: sp.choiceAdvancement.hint
    });
  }

  const doc = {
    _id: sp.id,
    name: sp.name,
    type: "race",
    img: sp.img,
    system: {
      description: {
        value: sp.lore,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      identifier: sp.file.replace(".json", ""),
      movement: {
        burrow: null,
        climb: sp.speed.climb,
        fly: null,
        swim: null,
        walk: sp.speed.walk,
        units: "ft",
        hover: false
      },
      senses: {
        darkvision: sp.senses.darkvision,
        blindsight: null,
        tremorsense: null,
        truesight: null,
        units: "ft",
        special: sp.senses.special
      },
      type: {
        value: sp.creatureType,
        subtype: sp.subtype,
        custom: ""
      },
      advancement: advancements
    }
  };

  write(`src/species/${sp.file}`, doc);
}

console.log("\n✔ Species and Species Features build complete.");
