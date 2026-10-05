#!/usr/bin/env node
/**
 * build-adventurer.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Adventurer class package:
 *   • src/features/adventurer/              – 18 Core Class Features
 *   • src/features/adventurer/forms/        – 3 Bio-Morph Forms
 *   • src/features/adventurer/adaptations/  – 38 Survival Adaptations
 *   • src/classes/adventurer.json           – Adventurer Class Document
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

/** Standard feat scaffold for Adventurer features, forms, and adaptations */
function createFeat({
  id,
  name,
  img = "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  description,
  subtype = "",
  requirements = "Adventurer 1",
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
/*  1. Core Class Features (src/features/adventurer/)                  */
/* ================================================================== */

// 1. Bio-Morph (Level 1)
write(
  "src/features/adventurer/bio-morph.json",
  createFeat({
    id: "AdvBioMorph00001",
    name: "Bio-Morph",
    img: "icons/magic/nature/wolf-paw-glow-large-green.webp",
    requirements: "Adventurer 1",
    description: `<p>At 1st level, you can rewrite your cellular and genetic matrix on the fly using adaptable nanotech mutagens. As a <strong>Bonus Action</strong>, you can activate a Bio-Morph form of your choice (Ambush Form, Battle Form, or Swift Form). The transformation lasts for a number of hours equal to your <strong>Adventurer level</strong>, until you end it as a Bonus Action, or until you fall Unconscious.</p>
<h3>Passive Form Benefits</h3>
<p>While running any Bio-Morph protocol, you gain the following universal physical enhancements:</p>
<ul>
  <li><strong>Keen Senses:</strong> You gain Darkvision out to a range of <strong>60 feet</strong> (or +30 feet if you already have Darkvision). You have <strong>Advantage on Wisdom (Perception) and Wisdom (Survival) checks</strong> that rely on smell or hearing.</li>
  <li><strong>Harden Flesh:</strong> When you transform, you immediately gain temporary hit points equal to your <strong>Adventurer level + your Wisdom modifier</strong>.</li>
</ul>
<h3>Uses & Recovery</h3>
<p>You can use this feature a number of times equal to your <strong>Proficiency Bonus</strong> (\`@prof\`). You regain one expended use when you finish a <strong>Short Rest</strong>, and all expended uses when you finish a <strong>Long Rest</strong>.</p>`,
    uses: {
      spent: 0,
      recovery: [
        { period: "sr", type: "recoverAll" },
        { period: "lr", type: "recoverAll" },
      ],
      max: "@scale.adventurer.biomorph-uses",
    },
    activities: {
      actActivateBio001: {
        _id: "actActivateBio001",
        type: "utility",
        activation: { type: "bonus", value: 1 },
        duration: { value: "@classes.adventurer.levels", units: "hour" },
        target: { affects: { count: "1", type: "self" } },
        name: "Activate Bio-Morph Form",
      },
    },
  })
);

// 2. Pathfinder (Level 1)
write(
  "src/features/adventurer/pathfinder.json",
  createFeat({
    id: "AdvPathfinder001",
    name: "Pathfinder",
    img: "icons/tools/navigation/compass-brass-blue.webp",
    requirements: "Adventurer 1",
    description: `<p>At 1st level, you are an expert navigator and survivor of the hostile wilderness across Rubi-Ka:</p>
<ul>
  <li>Difficult terrain doesn't slow your group's travel.</li>
  <li>Your group cannot become lost except by exotic or reality-warping means.</li>
  <li>Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.</li>
  <li>If you are traveling alone, you can move stealthily at a normal pace.</li>
  <li>When you forage, you find twice as much food and water as you normally would.</li>
</ul>`,
  })
);

// 3. Nanoprogramming (Level 1)
write(
  "src/features/adventurer/nanoprogramming.json",
  createFeat({
    id: "AdvNanoProg00001",
    name: "Nanoprogramming",
    img: "icons/magic/symbols/circuit-board-glowing-blue.webp",
    requirements: "Adventurer 1",
    description: `<p>Your biological cybernetics allow you to compile biological and environmental subroutines from the Adventurer Operating System (OS). You follow a <strong>Half-Caster progression</strong> (scaling up to Tier 5 programs).</p>
<h3>Nanopool Points</h3>
<p>Your capacity to execute nanoprograms is fueled by your Nanopool. Your maximum Nanopool points equal your value from the Adventurer table plus your <strong>Wisdom modifier</strong>. You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>
<h3>Nanoprograms Known</h3>
<p>At 2nd level, you know four 1st-tier nanoprograms of your choice from the Adventurer OS.</p>
<h3>Nanocasting Ability</h3>
<p><strong>Wisdom</strong> is your nanocasting ability for your Adventurer nanoprograms, reflecting your attunement to planetary biological rhythms and raw survival instincts.</p>
<ul>
  <li><strong>Nanoprogram Save DC</strong> = 8 + your Proficiency Bonus + your Wisdom modifier</li>
  <li><strong>Nanoprogram Attack Modifier</strong> = your Proficiency Bonus + your Wisdom modifier</li>
</ul>
<h3>Somatic Interface</h3>
<p>You must have at least one hand free to access your bio-console or wristpad.</p>`,
  })
);

// 4. Weapon Mastery (Level 1)
write(
  "src/features/adventurer/weapon-mastery.json",
  createFeat({
    id: "AdvWpnMastery001",
    name: "Weapon Mastery",
    img: "icons/skills/melee/weapons-crossed-daggers-orange.webp",
    requirements: "Adventurer 1",
    description: `<p>Your training with weapons allows you to use the mastery properties of <strong>two kinds of weapons</strong> of your choice with which you have proficiency (such as Nick, Vex, or Slow). Whenever you finish a <strong>Long Rest</strong>, you can change the kinds of weapons you have chosen.</p>`,
  })
);

// 5. Field Triage (Level 2)
write(
  "src/features/adventurer/field-triage.json",
  createFeat({
    id: "AdvFieldTriage01",
    name: "Field Triage",
    img: "icons/magic/life/cross-worn-green.webp",
    requirements: "Adventurer 2",
    description: `<p>At 2nd level, you carry a reserve of regenerative biomonitors and triage nanites. You have a pool of healing dice represented by a number of <strong>d8s equal to your Adventurer level</strong>.</p>
<p>As a <strong>Bonus Action</strong>, you can heal yourself or one willing creature you can see within <strong>30 feet</strong>. Spend any number of dice from your pool up to your <strong>Proficiency Bonus</strong> (\`@prof\`). Roll the dice: the target immediately regains hit points equal to the total rolled.</p>
<p>You regain all expended Field Triage dice when you finish a <strong>Long Rest</strong>.</p>`,
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "@scale.adventurer.field-triage-dice",
    },
    activities: {
      actFieldTriage01: {
        _id: "actFieldTriage01",
        type: "heal",
        activation: { type: "bonus", value: 1 },
        range: { value: "30", units: "ft" },
        target: { affects: { count: "1", type: "creature", special: "Self or willing creature" } },
        healing: {
          number: 1,
          denomination: 8,
          bonus: "",
          types: ["healing"],
          custom: { enabled: true, formula: "1d8" },
        },
        name: "Field Triage",
      },
    },
  })
);

// 6. Fighting Style (Level 2)
write(
  "src/features/adventurer/fighting-style.json",
  createFeat({
    id: "AdvFightStyle001",
    name: "Fighting Style",
    img: "icons/skills/melee/hand-to-hand-fighting-stance.webp",
    requirements: "Adventurer 2",
    description: `<p>At 2nd level, you adopt a particular style of fighting as your specialty. Choose one Fighting Style from Chapter 6. Whenever you gain an Adventurer level, you can replace the chosen style with another one of your choice.</p>`,
  })
);

// 7. Survival Adaptations (Level 2)
write(
  "src/features/adventurer/survival-adaptations.json",
  createFeat({
    id: "AdvSurvAdapt0001",
    name: "Survival Adaptations",
    img: "icons/magic/nature/leaf-glow-green.webp",
    requirements: "Adventurer 2",
    description: `<p>At 2nd level, your genetic mutations branch into specialized adaptations. You gain two Survival Adaptations of your choice.</p>
<p>The Adaptations Known column of the Adventurer table shows when you learn more adaptations (scaling to 10 at 18th level). Whenever you gain an Adventurer level, you can replace one adaptation you know with another eligible adaptation of your choice.</p>`,
  })
);

// 8. Extra Attack (Level 5)
write(
  "src/features/adventurer/extra-attack.json",
  createFeat({
    id: "AdvExtraAttack01",
    name: "Extra Attack",
    img: "icons/skills/melee/weapons-crossed-swords-yellow.webp",
    requirements: "Adventurer 5",
    description: `<p>Starting at 5th level, you can attack twice, instead of once, whenever you take the <strong>Attack action</strong> on your turn.</p>`,
  })
);

// 9. Callias's Bio-Morph (Level 5)
write(
  "src/features/adventurer/callias-biomorph.json",
  createFeat({
    id: "AdvCalliasBio001",
    name: "Callias's Bio-Morph",
    img: "icons/magic/nature/wolf-paw-glow-large-green.webp",
    requirements: "Adventurer 5",
    description: `<p>At 5th level, your bio-morph triggers synchronize with your nanite reservoirs:</p>
<ul>
  <li>Once per turn, if you have no uses of Bio-Morph remaining, you can expend <strong>2 Nanopool points</strong> to gain one use of Bio-Morph (no action required).</li>
  <li>Whenever you finish a Long Rest, you can convert any unexpended uses of Bio-Morph into Nanopool points at a rate of <strong>2 Nanopool points per use</strong>.</li>
</ul>`,
  })
);

// 10. Expertise (Level 6 & 14)
write(
  "src/features/adventurer/expertise.json",
  createFeat({
    id: "AdvExpertise0001",
    name: "Expertise",
    img: "icons/tools/scribal/magnifying-glass.webp",
    requirements: "Adventurer 6",
    description: `<p>At 6th level, choose two of your skill or tool proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>
<p>At <strong>14th level</strong>, you choose two more of your proficiencies to gain this benefit.</p>`,
  })
);

// 11. Seasoned Hunter (Level 6)
write(
  "src/features/adventurer/seasoned-hunter.json",
  createFeat({
    id: "AdvSeasonHunt001",
    name: "Seasoned Hunter",
    img: "icons/skills/targeting/crosshair-arrow-blue.webp",
    requirements: "Adventurer 6",
    description: `<p>At 6th level, your instincts against predatory xenofauna and apex threats sharpen significantly. You have <strong>Advantage on saving throws against poison, disease, and being Frightened</strong>, and hostile creatures cannot gain Advantage on attack rolls against you simply by being hidden or unseen.</p>`,
  })
);

// 12. Feral Instincts (Level 7)
write(
  "src/features/adventurer/feral-instincts.json",
  createFeat({
    id: "AdvFeralInstnc01",
    name: "Feral Instincts",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    requirements: "Adventurer 7",
    description: `<p>At 7th level, your biological reflexes operate on pure instinct:</p>
<ul>
  <li>You have <strong>Advantage on Initiative rolls</strong>.</li>
  <li>If you are surprised at the start of combat and aren't Incapacitated, you can act normally on your first turn, but only if you enter a Bio-Morph form before doing anything else on that turn.</li>
</ul>`,
  })
);

// 13. Environmental Mastery (Level 10)
write(
  "src/features/adventurer/environmental-mastery.json",
  createFeat({
    id: "AdvEnvMastery001",
    name: "Environmental Mastery",
    img: "icons/magic/nature/barrier-tree-roots-green.webp",
    requirements: "Adventurer 10",
    description: `<p>At 10th level, your cellular structure adapts instantly to hostile biospheres. You are completely immune to the effects of <strong>extreme planetary temperatures (cold and heat)</strong>, planetary radiation, and nonmagical airborne toxins or spores.</p>`,
  })
);

// 14. Adaptive Mutagen (Level 11)
write(
  "src/features/adventurer/adaptive-mutagen.json",
  createFeat({
    id: "AdvAdaptMutagen1",
    name: "Adaptive Mutagen",
    img: "icons/magic/symbols/rune-sigil-horned-blue.webp",
    requirements: "Adventurer 11",
    description: `<p>At 11th level, the sheer density of your altered muscle fibers and hardened bio-photons shatters physical defenses. While running any Bio-Morph protocol, your physical strikes and weapon attacks can deal <strong>Force damage</strong> instead of their normal damage type.</p>`,
  })
);

// 15. Evasion (Level 13)
write(
  "src/features/adventurer/evasion.json",
  createFeat({
    id: "AdvEvasion000001",
    name: "Evasion",
    img: "icons/skills/movement/trail-streak-zigzag-teal.webp",
    requirements: "Adventurer 13",
    description: `<p>At 13th level, you can nimbly dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take <strong>no damage</strong> if you succeed on the saving throw, and only <strong>half damage</strong> if you fail.</p>`,
  })
);

// 16. Flexible Execution (Level 14)
write(
  "src/features/adventurer/flexible-execution.json",
  createFeat({
    id: "AdvFlexExec00001",
    name: "Flexible Execution",
    img: "icons/skills/combat/weapons-crossed-swords-fire-purple.webp",
    requirements: "Adventurer 14",
    description: `<p>At 14th level, you seamlessly weave nanoprogramming with martial brutality. Whenever you use your Action to execute a nanoprogram, you can make <strong>one weapon attack as a Bonus Action</strong>.</p>`,
  })
);

// 17. Supreme Awareness (Level 18)
write(
  "src/features/adventurer/supreme-awareness.json",
  createFeat({
    id: "AdvSupremeAware1",
    name: "Supreme Awareness",
    img: "icons/magic/perception/eye-slit-orange.webp",
    requirements: "Adventurer 18",
    description: `<p>At 18th level, your sensory wetware achieves total environmental awareness:</p>
<ul>
  <li>When you attack a creature you cannot see, your inability to see it doesn't impose Disadvantage on your attack rolls against it.</li>
  <li>You are aware of the exact location of any invisible creature within <strong>30 feet</strong> of you, provided the creature isn't hidden from you and you aren't Blinded or Deafened.</li>
</ul>`,
  })
);

// 18. One with Nature (Level 20)
write(
  "src/features/adventurer/one-with-nature.json",
  createFeat({
    id: "AdvOneWithNat001",
    name: "One with Nature",
    img: "icons/magic/nature/tree-roots-glow-yellow.webp",
    requirements: "Adventurer 20",
    description: `<p>At 20th level, you have attained absolute mastery over the mutative forces of the universe:</p>
<ul>
  <li>Your <strong>Strength or Dexterity score increases by 2</strong>, and your <strong>Wisdom score increases by 2</strong>. Your maximum for those scores is now 22.</li>
  <li><strong>Evergreen Bio-Morph:</strong> When you roll Initiative and have no uses of Bio-Morph remaining, you immediately regain 1 use.</li>
  <li><strong>Refined Biomorphic Fuel:</strong> When you finish a Long Rest, you can convert unexpended Bio-Morph uses into <strong>3 Nanopool points per use</strong>.</li>
  <li><strong>Longevity:</strong> For every 10 years that pass, your body ages only 1 year.</li>
</ul>`,
  })
);

/* ================================================================== */
/*  2. Bio-Morph Forms (src/features/adventurer/forms/)                */
/* ================================================================== */

// 1. Ambush Form
write(
  "src/features/adventurer/forms/form-ambush.json",
  createFeat({
    id: "FormAmbush000001",
    name: "Bio-Morph: Ambush Form",
    img: "icons/creatures/mammals/panther-stalking-shadow.webp",
    requirements: "Adventurer 1",
    subtype: "form",
    description: `<p>Your chassis slims down, dampening acoustic emissions and synthesizing sleek predatory musculature:</p>
<ul>
  <li><strong>Speed:</strong> Your walking speed increases by <strong>10 feet</strong>.</li>
  <li><strong>Ambusher:</strong> You have <strong>Advantage on Initiative rolls</strong> and <strong>Dexterity (Stealth) checks</strong>.</li>
  <li><strong>Primal Pounce:</strong> If you move at least 20 feet straight toward a creature and then hit it with a melee weapon attack on the same turn, that attack deals an extra <strong>1d8 kinetic damage</strong>.</li>
  <li><strong>Stalk:</strong> You can use a <strong>Bonus Action</strong> to move up to your speed and take the <strong>Hide action</strong>.</li>
</ul>`,
  })
);

// 2. Battle Form
write(
  "src/features/adventurer/forms/form-battle.json",
  createFeat({
    id: "FormBattle000001",
    name: "Bio-Morph: Battle Form",
    img: "icons/creatures/mammals/bear-roar-brown.webp",
    requirements: "Adventurer 1",
    subtype: "form",
    description: `<p>Your bone density thickens and hardened dermal plating erupts across your shoulders and torso:</p>
<ul>
  <li><strong>Hardy:</strong> The temporary hit points gained when entering this form equal <strong>twice your Adventurer level</strong> instead of your normal calculation.</li>
  <li><strong>Pack Protection:</strong> When a friendly creature within 10 feet of you takes damage, you can use your <strong>Reaction</strong> to reduce the damage by <strong>1d8 + your Wisdom modifier</strong>.</li>
  <li><strong>Thrash:</strong> Once per turn when you hit a creature with a melee weapon attack, you can force the target to make a Strength saving throw against your Nanoprogram Save DC or be knocked <strong>Prone</strong>.</li>
</ul>`,
    activities: {
      actPackProtect01: {
        _id: "actPackProtect01",
        type: "utility",
        activation: { type: "reaction", value: 1, condition: "When an ally within 10 ft takes damage" },
        range: { value: "10", units: "ft" },
        target: { affects: { count: "1", type: "ally" } },
        name: "Pack Protection (Reaction)",
      },
      actThrash0000001: {
        _id: "actThrash0000001",
        type: "save",
        activation: { type: "special", value: null, condition: "Once per turn on melee hit" },
        range: { units: "spec", special: "Target hit in melee" },
        save: { ability: ["str"], dc: { calculation: "wis", formula: "" } },
        name: "Thrash (Knock Prone)",
      },
    },
  })
);

// 3. Swift Form
write(
  "src/features/adventurer/forms/form-swift.json",
  createFeat({
    id: "FormSwift0000001",
    name: "Bio-Morph: Swift Form",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    requirements: "Adventurer 1",
    subtype: "form",
    description: `<p>Your body sheds unnecessary mass, elongating joints and optimizing pneumatic cardiovascular efficiency:</p>
<ul>
  <li><strong>Speed:</strong> Your walking speed increases by <strong>20 feet</strong>.</li>
  <li><strong>Evasive:</strong> Leaving an enemy's reach does not provoke Opportunity Attacks.</li>
  <li><strong>Reposition:</strong> Immediately after making a weapon attack roll on your turn, you can shift up to <strong>5 feet</strong> without expending your movement.</li>
  <li><strong>Swift Dart:</strong> You can take the <strong>Dash action as a Bonus Action</strong>.</li>
</ul>`,
  })
);

/* ================================================================== */
/*  3. Survival Adaptations (src/features/adventurer/adaptations/)     */
/* ================================================================== */

const ADAPTATIONS = [
  { id: "AdptAdrenTriage1", file: "adrenaline-triage.json", name: "Adaptation: Adrenaline Triage", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> When you target a creature with Field Triage, that creature gains a +10 ft bonus to walking speed and does not provoke Opportunity Attacks until the end of its next turn.</p>" },
  { id: "AdptAmbidextrous", file: "ambidextrous-splice.json", name: "Adaptation: Ambidextrous Splice", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> When engaging in two-weapon fighting, you can add your ability modifier to the damage roll of the second attack.</p>" },
  { id: "AdptAntitoxSiph1", file: "antitoxin-siphon.json", name: "Adaptation: Antitoxin Siphon", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> When you use Field Triage on a creature, you can forego 1 healing die to end the Poisoned condition or one nonmagical disease afflicting the target.</p>" },
  { id: "AdptApexAgility1", file: "apex-agility.json", name: "Adaptation: Apex Agility", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You gain a climbing speed and a swimming speed equal to your current walking speed.</p>" },
  { id: "AdptBloodFrenzy1", file: "blood-frenzy.json", name: "Adaptation: Blood Frenzy", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> You have Advantage on melee weapon attack rolls and natural weapon attack rolls against any creature that doesn't have all its hit points.</p>" },
  { id: "AdptBrutalStalk1", file: "brutal-stalker.json", name: "Adaptation: Brutal Stalker", req: "Adventurer 7", desc: "<p><em>Innate Adaptation (Req: Level 7):</em> Once per turn, when you score a critical hit with a weapon attack or reduce a hostile creature to 0 HP, you can make one additional weapon attack immediately (no action required).</p>" },
  { id: "AdptCellSurge001", file: "cellular-surge.json", name: "Adaptation: Cellular Surge", req: "Adventurer 7", desc: "<p><em>Innate Adaptation (Req: Level 7):</em> If you start your turn with fewer than half your hit points remaining, you immediately gain temporary hit points equal to your Wisdom modifier + half your Adventurer level.</p>" },
  { id: "AdptChameleonCam", file: "chameleon-camouflage.json", name: "Adaptation: Chameleon Camouflage", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> You have Advantage on Dexterity (Stealth) checks to hide in natural terrain, foliage, or rubble. You can take the Hide action as a Bonus Action.</p>" },
  { id: "AdptChimerTalons", file: "chimeric-talons.json", name: "Adaptation: Chimeric Talons", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> You sprout retractile talons or spikes that count as Simple melee weapons with the Finesse and Light properties dealing 1d6 kinetic or acid damage (scales to 1d8 at Level 5, and 1d10 at Level 11).</p>" },
  { id: "AdptChitinousCar", file: "chitinous-carapace.json", name: "Adaptation: Chitinous Carapace", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation (Battle Form):</em> While running Battle Form, your bonus to AC increases from +1 to +2.</p>" },
  { id: "AdptClimbrsCilia", file: "climbers-cilia.json", name: "Adaptation: Climber's Cilia", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> You gain a climbing speed equal to your walking speed and can climb difficult surfaces, including upside down on ceilings, without needing an ability check.</p>" },
  { id: "AdptCompressFram", file: "compression-frame.json", name: "Adaptation: Compression Frame", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> You can squeeze through spaces as narrow as 1 inch wide without expending extra movement or suffering Disadvantage on attack rolls and Dexterity saving throws.</p>" },
  { id: "AdptDeadlyMarksm", file: "deadly-marksman.json", name: "Adaptation: Deadly Marksman", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> Being within 5 feet of a hostile creature doesn't impose Disadvantage on your ranged weapon attack rolls.</p>" },
  { id: "AdptDiminutiveSt", file: "diminutive-stature.json", name: "Adaptation: Diminutive Stature", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5, Ambush Form):</em> In Ambush Form, your size becomes Tiny (-10 ft walking speed). When a creature targets you with an attack, you can use your Reaction to impose Disadvantage on that attack.</p>" },
  { id: "AdptEcholocation", file: "echolocation.json", name: "Adaptation: Echolocation", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> You gain Blindsight out to a range of 30 feet as long as you are not Deafened.</p>" },
  { id: "AdptEmergRevital", file: "emergency-revitalize.json", name: "Adaptation: Emergency Revitalize", req: "Adventurer 9", desc: "<p><em>Innate Adaptation (Req: Level 9):</em> When you heal a creature that has 0 HP with Field Triage, the target can use its Reaction to stand up without expending movement and gains temporary hit points equal to twice your Adventurer level.</p>" },
  { id: "AdptEnvHardening", file: "environmental-hardening.json", name: "Adaptation: Environmental Hardening", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You are immune to the effects of extreme nonmagical heat and cold, and you can hold your breath for up to 1 hour.</p>" },
  { id: "AdptEnvResist001", file: "environmental-resistance.json", name: "Adaptation: Environmental Resistance", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> Whenever you activate a Bio-Morph form, choose one damage type: Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type for the duration of the form.</p>" },
  { id: "AdptFeralQuick01", file: "feral-quickness.json", name: "Adaptation: Feral Quickness", req: "Adventurer 5", desc: "<p><em>Innate Adaptation (Req: Level 5):</em> You have Advantage on Initiative rolls, and your permanent walking speed increases by 10 feet.</p>" },
  { id: "AdptFlight000001", file: "flight.json", name: "Adaptation: Flight", req: "Adventurer 9", desc: "<p><em>Bio-Morph Mutation (Req: Level 9, Swift Form):</em> While running Swift Form, you sprout membranous wings, gaining a flying speed equal to your walking speed.</p>" },
  { id: "AdptFrontierPoly", file: "frontier-polymath.json", name: "Adaptation: Frontier Polymath", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You gain proficiency in two skills of your choice from Animal Handling, Athletics, Medicine, Nature, Perception, Piloting, or Survival.</p>" },
  { id: "AdptGhostStalker", file: "ghost-stalker.json", name: "Adaptation: Ghost Stalker", req: "Adventurer 7", desc: "<p><em>Innate Adaptation (Req: Level 7):</em> Moving through difficult terrain costs you no extra movement, and you leave no physical tracks, trail, or scent unless you choose to.</p>" },
  { id: "AdptGraspTendril", file: "grasping-tendrils.json", name: "Adaptation: Grasping Tendrils", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> Your reach with melee weapon attacks and natural weapon attacks increases by 5 feet.</p>" },
  { id: "AdptHydrGrappler", file: "hydraulic-grappler.json", name: "Adaptation: Hydraulic Grappler", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> When you hit a creature your size or smaller with a melee or natural weapon attack, the target is Grappled (escape DC equals your Nanoprogram Save DC).</p>" },
  { id: "AdptJuggernautCa", file: "juggernaut-carapace.json", name: "Adaptation: Juggernaut Carapace", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You gain proficiency with Heavy Armor. Wearing Heavy Armor does not impose Disadvantage on your Dexterity (Stealth) checks while in Ambush Form.</p>" },
  { id: "AdptKineticLeapr", file: "kinetic-leaper.json", name: "Adaptation: Kinetic Leaper", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> You can make a long jump of up to 20 feet and a high jump of up to 10 feet without needing a running start.</p>" },
  { id: "AdptPathfindNav1", file: "pathfinder-navigation.json", name: "Adaptation: Pathfinder Navigation", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> Your group cannot be slowed by difficult terrain, cannot be lost by conventional means, and finds double foraging supplies.</p>" },
  { id: "AdptPredPounce01", file: "predatory-pounce.json", name: "Adaptation: Predatory Pounce", req: "Adventurer 2", desc: "<p><em>Bio-Morph Mutation:</em> If you move at least 20 feet straight toward a creature and hit it with a melee attack, the target must make a Strength saving throw against your Nanoprogram Save DC or fall Prone.</p>" },
  { id: "AdptPsychomEcho1", file: "psychometric-echoes.json", name: "Adaptation: Psychometric Echoes", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> By inspecting an area or object for 1 minute, you perceive psychic echoes of events that occurred within 30 feet over the past 24 hours (1/SR or LR).</p>" },
  { id: "AdptScavengerEye", file: "scavengers-eye.json", name: "Adaptation: Scavenger's Eye", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You have Advantage on Intelligence (Investigation) and Wisdom (Perception) checks made to detect hidden doors, traps, and technological salvage.</p>" },
  { id: "AdptSubterranean", file: "subterranean-excavator.json", name: "Adaptation: Subterranean Excavator", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> You gain a burrowing speed equal to half your walking speed through sand, earth, and snow.</p>" },
  { id: "AdptSwallow00001", file: "swallow.json", name: "Adaptation: Swallow", req: "Adventurer 13", desc: "<p><em>Bio-Morph Mutation (Req: Level 13, Battle Form):</em> As an Action, you swallow a creature smaller than you that you have grappled. The swallowed creature is Blinded, Restrained, has Total Cover, and takes 3d6 Acid damage at the start of each of your turns.</p>" },
  { id: "AdptSymbInfusion", file: "symbiotic-infusion.json", name: "Adaptation: Symbiotic Infusion", req: "Adventurer 5", desc: "<p><em>Innate Adaptation (Req: Level 5):</em> Whenever you expend Field Triage dice to heal another creature, you immediately regain hit points equal to the number of dice rolled.</p>" },
  { id: "AdptTremorsense1", file: "tremorsense.json", name: "Adaptation: Tremorsense", req: "Adventurer 9", desc: "<p><em>Bio-Morph Mutation (Req: Level 9):</em> You gain Tremorsense out to a range of 60 feet while you are touching solid ground or a continuous stone/metal surface.</p>" },
  { id: "AdptTrollBlood01", file: "troll-blood-metabolism.json", name: "Adaptation: Troll-Blood Metabolism", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> Whenever you spend one or more Hit Dice to regain hit points during a Short Rest, you regain an extra 1d8 hit points for each Hit Die spent.</p>" },
  { id: "AdptVenomGlands1", file: "venom-glands.json", name: "Adaptation: Venom Glands", req: "Adventurer 5", desc: "<p><em>Bio-Morph Mutation (Req: Level 5):</em> Once per turn when you hit a creature with a weapon or natural attack, you can deal an extra 1d6 poison or acid damage (scales to 2d6 at Level 11).</p>" },
  { id: "AdptWebSpinner01", file: "web-spinner.json", name: "Adaptation: Web Spinner", req: "Adventurer 9", desc: "<p><em>Bio-Morph Mutation (Req: Level 9):</em> As an Action, shoot a 15-ft cube filament web within 60 ft. Creatures make a Dex save or are Restrained (escape Athletics DC vs Program DC, AC 10, 15 HP; 1/SR or LR or 2 Nanopool).</p>" },
  { id: "AdptXenofaunaCom", file: "xenofauna-communion.json", name: "Adaptation: Xenofauna Communion", req: "Adventurer 2", desc: "<p><em>Innate Adaptation:</em> You can communicate telepathically or vocally with non-hostile beasts, and you have Advantage on Wisdom (Animal Handling) checks.</p>" },
];

ADAPTATIONS.forEach((ad) => {
  write(
    `src/features/adventurer/adaptations/${ad.file}`,
    createFeat({
      id: ad.id,
      name: ad.name,
      subtype: "adaptation",
      requirements: ad.req,
      description: ad.desc,
    })
  );
});

/* ================================================================== */
/*  4. Adventurer Class Document (src/classes/adventurer.json)         */
/* ================================================================== */

write("src/classes/adventurer.json", {
  _id: "AdventurerCls001",
  name: "Adventurer",
  type: "class",
  img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
  system: {
    description: {
      value: `<p>Wilderness survivors, biological shapeshifters, and master scouts of the untamed expanses of Rubi-Ka. The Adventurer adapts their physiology at will, shifting between lethal ambush forms, fortified juggernauts, and agile predators fueled by specialized survival nanoprograms.</p>`,
    },
    source: {
      custom: "Suns of Rubi",
    },
    identifier: "adventurer",
    levels: 1,
    hd: {
      denomination: 10,
      spent: 0,
      additional: "",
    },
    primaryAbility: {
      value: ["dex", "wis"],
      all: false,
    },
    spellcasting: {
      progression: "half",
      ability: "wis",
    },
    advancement: [
      /* ── Hit Points (d10) ── */
      {
        _id: "advAdvHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },

      /* ── Saves: STR, DEX ── */
      {
        _id: "advAdvSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:str", "saves:dex"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },

      /* ── Armor: Light, Medium ── */
      {
        _id: "advAdvArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt", "armor:med"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },

      /* ── Weapons: Simple, Martial ── */
      {
        _id: "advAdvWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:mar"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },

      /* ── Skills: Choice of 3 from list ── */
      {
        _id: "advAdvSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 3,
              pool: [
                "skills:ani",
                "skills:ath",
                "skills:ins",
                "skills:inv",
                "skills:nat",
                "skills:prc",
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

      /* ── ScaleValue: Bio-Morph Uses (@prof formula) ── */
      {
        _id: "advAdvScBioMorph",
        type: "ScaleValue",
        configuration: {
          identifier: "biomorph-uses",
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
        title: "Bio-Morph Uses",
      },

      /* ── ScaleValue: Field Triage Dice (@classes.adventurer.levels formula) ── */
      {
        _id: "advAdvScFldTriag",
        type: "ScaleValue",
        configuration: {
          identifier: "field-triage-dice",
          type: "number",
          formula: "@classes.adventurer.levels",
          scale: {
            2: { value: 2, formula: "@classes.adventurer.levels" },
          },
        },
        value: {},
        level: 2,
        title: "Field Triage Dice",
      },

      /* ── ScaleValue: Nanopool Points (2 at L2 to 20 at L20) ── */
      {
        _id: "advAdvScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
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
        level: 2,
        title: "Nanopool Points",
      },

      /* ── ScaleValue: Adaptations Known (2 at L2 to 10 at L18) ── */
      {
        _id: "advAdvScAdaptKn1",
        type: "ScaleValue",
        configuration: {
          identifier: "adaptations-known",
          type: "number",
          scale: {
            2: { value: 2 },
            3: { value: 3 },
            4: { value: 3 },
            5: { value: 5 },
            6: { value: 5 },
            7: { value: 6 },
            8: { value: 6 },
            9: { value: 7 },
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
        title: "Adaptations Known",
      },

      /* ── ScaleValue: Chimeric Talons Die ── */
      {
        _id: "advAdvScTalons01",
        type: "ScaleValue",
        configuration: {
          identifier: "chimeric-talons",
          type: "dice",
          scale: {
            1: { number: 1, faces: 6 },
            5: { number: 1, faces: 8 },
            11: { number: 1, faces: 10 },
          },
        },
        value: {},
        level: 1,
        title: "Chimeric Talons Die",
      },

      /* ── ScaleValue: Venom Glands Die ── */
      {
        _id: "advAdvScVenomGln",
        type: "ScaleValue",
        configuration: {
          identifier: "venom-glands",
          type: "dice",
          scale: {
            5: { number: 1, faces: 6 },
            11: { number: 2, faces: 6 },
          },
        },
        value: {},
        level: 5,
        title: "Venom Glands Die",
      },

      /* ── ItemGrant: Level 1 (Bio-Morph, Pathfinder, Nanoprogramming, Weapon Mastery) ── */
      {
        _id: "advAdvItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvBioMorph00001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvPathfinder001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvNanoProg00001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvWpnMastery001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Adventurer Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Field Triage, Fighting Style, Survival Adaptations) ── */
      {
        _id: "advAdvItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvFieldTriage01", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvFightStyle001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvSurvAdapt0001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Adventurer Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Adventurer Technique") ── */
      {
        _id: "advAdvSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Adventurer Technique",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advAdvASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Extra Attack, Callias's Bio-Morph) ── */
      {
        _id: "advAdvItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvExtraAttack01", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvCalliasBio001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Adventurer Features (Level 5)",
      },

      /* ── ItemGrant: Level 6 (Expertise, Seasoned Hunter) ── */
      {
        _id: "advAdvItmGrLvl06",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvExpertise0001", optional: false },
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvSeasonHunt001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Adventurer Features (Level 6)",
      },

      /* ── ItemGrant: Level 7 (Feral Instincts) ── */
      {
        _id: "advAdvItmGrLvl07",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvFeralInstnc01", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 7,
        title: "Adventurer Features (Level 7)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advAdvASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 10 (Environmental Mastery) ── */
      {
        _id: "advAdvItmGrLvl10",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvEnvMastery001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 10,
        title: "Adventurer Features (Level 10)",
      },

      /* ── ItemGrant: Level 11 (Adaptive Mutagen) ── */
      {
        _id: "advAdvItmGrLvl11",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvAdaptMutagen1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 11,
        title: "Adventurer Features (Level 11)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advAdvASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 13 (Evasion) ── */
      {
        _id: "advAdvItmGrLvl13",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvEvasion000001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 13,
        title: "Adventurer Features (Level 13)",
      },

      /* ── ItemGrant: Level 14 (Flexible Execution) ── */
      {
        _id: "advAdvItmGrLvl14",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvFlexExec00001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 14,
        title: "Adventurer Features (Level 14)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advAdvASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 18 (Supreme Awareness) ── */
      {
        _id: "advAdvItmGrLvl18",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvSupremeAware1", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 18,
        title: "Adventurer Features (Level 18)",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advAdvASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (One with Nature) ── */
      {
        _id: "advAdvItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            { uuid: "Compendium.suns-of-rubi-core.class-features.Item.AdvOneWithNat001", optional: false },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Adventurer Features (Level 20)",
      },
    ],
    wealth: "4d4 * 10",
    startingEquipment: [],
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  _stats: { compendiumSource: null, duplicateSource: null },
  _key: "!items!AdventurerCls001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Adventurer build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
