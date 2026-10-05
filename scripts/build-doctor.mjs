#!/usr/bin/env node
/**
 * build-doctor.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Doctor class package:
 *   • src/features/doctor/              – 7 core class features
 *   • src/features/doctor/discoveries/  – 14 Clinical Discoveries
 *   • src/classes/doctor.json           – Doctor class document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - 16-character alphanumeric _id at root and in _key
 *   - Modern Foundry v12/v14 system.activities architecture
 *   - Compendium UUID references
 *   - Zero SW5e remnants (Consular -> Doctor, One with the Force -> Complete Healing)
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

/** Standard feat scaffold for Doctor features and discoveries */
function createFeat({
  id,
  name,
  img = "icons/tools/laboratory/vials-glass-blue-red.webp",
  description,
  subtype = "",
  requirements = "Doctor 1",
  activities = {},
  uses = { value: null, max: "", per: null, recovery: "", prompt: false },
  advancement = [],
}) {
  return {
    _id: id,
    name,
    type: "feat",
    img,
    system: {
      description: { value: description },
      source: { custom: "Suns of Rubi" },
      type: { value: "class", subtype },
      requirements,
      properties: [],
      advancement,
      activities,
      activation: { type: "", value: null, condition: "" },
      duration: { value: "", units: "" },
      cover: null,
      target: { value: null, width: null, units: "", type: "", prompt: true },
      range: { value: null, long: null, units: "" },
      uses,
      consume: { type: "", target: null, amount: null, scale: false },
      ability: null,
      actionType: "",
      chatFlavor: "",
      critical: { threshold: null, damage: "" },
      damage: { parts: [], versatile: "" },
      formula: "",
      save: { ability: "", dc: null, scaling: "spell" },
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
/*  1.  CORE CLASS FEATURES  →  src/features/doctor/                  */
/* ================================================================== */

console.log("\n▸ Doctor Core Class Features");

// 1. Nanoprogramming (Level 1)
write("src/features/doctor/nanoprogramming.json", createFeat({
  id: "DocNanoProg00001",
  name: "Nanoprogramming",
  img: "icons/magic/symbols/runes-star-pentagon-green.webp",
  requirements: "Doctor 1",
  description:
    "<p>At 1st level, your deep medical research and bio-synthetic implants grant you full nanocasting progression in advanced biological and clinical nanoprograms, scaling smoothly from Tier 1 up to Tier 9 apex nanoprograms.</p>" +
    "<h3>Wisdom Nanocasting</h3>" +
    "<p><strong>Wisdom</strong> is your nanocasting ability for Doctor nanoprograms, reflecting your clinical diagnostic acumen and cellular observation.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Wisdom modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Wisdom modifier</li>" +
    "</ul>" +
    "<h3>Programs Known</h3>" +
    "<p>You know <strong>9 nanoprograms</strong> of your choice from the Doctor Operating System at 1st level, and learn additional programs as shown on the Doctor table.</p>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your maximum Nanopool points equal <strong>(Doctor level &times; 4) + your Wisdom modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
    "<h3>Max Power Level</h3>" +
    "<p>The maximum tier of nanoprogram you can execute scales with your Doctor level as shown in the Max Power Level column of the Doctor table.</p>" +
    "<h3>Bio-Scanner / Medkit Requirement</h3>" +
    "<p>Executing Doctor nanoprograms requires you to have at least <strong>one hand free</strong> to operate a Bio-Scanner Rig, Medkit, or subcutaneous hypo-injector.</p>",
}));

// 2. Critical Analysis (Level 1)
write("src/features/doctor/critical-analysis.json", createFeat({
  id: "DocCritAnalysis1",
  name: "Critical Analysis",
  img: "icons/skills/awareness/eye-open-silhouette-green.webp",
  requirements: "Doctor 1",
  description:
    "<p>At 1st level, you can rapidly diagnose structural, biological, or behavioral vulnerabilities. As a <strong>Bonus Action</strong>, choose one creature you can see within <strong>60 feet</strong>. That creature becomes your analyzed target for <strong>1 minute</strong> (or until you analyze another target).</p>" +
    "<h3>Hostile Target</h3>" +
    "<p>When attacking your analyzed hostile target, you can use your <strong>Wisdom modifier</strong> in place of Strength or Dexterity for attack rolls and damage rolls with weapons that have the <strong>Finesse</strong> property or <strong>Blaster</strong> weapons.</p>" +
    "<h3>Friendly Target</h3>" +
    "<p>When you analyze a friendly creature, that creature can end the analysis at any time (no action required) to add your <strong>Wisdom modifier</strong> to one attack roll, ability check, or saving throw it makes. A friendly creature can benefit from this once per <strong>Short or Long Rest</strong>.</p>" +
    "<h3>Diagnostic Healing</h3>" +
    "<p>Alternatively, you or a friendly analyzed creature can end the analysis (no action required) by spending Nanopool points up to your <strong>Proficiency Bonus</strong> (`@prof`). The target immediately regains <strong>2d4 hit points per Nanopool point spent</strong>.</p>",
  activities: {
    dnd5eactAnalyze: {
      _id: "dnd5eactAnalyze",
      type: "utility",
      name: "Analyze Target",
      img: "",
      activation: { type: "bonus", value: 1, condition: "" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "minute", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactDiagHeal: {
      _id: "dnd5eactDiagHeal",
      type: "heal",
      name: "Targeted Analysis Healing",
      img: "",
      activation: { type: "special", value: null, condition: "End analysis on friendly target; spend Nanopool up to PB" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "friendly analyzed target" },
        prompt: true,
        override: false,
      },
      healing: {
        number: 2,
        denomination: 4,
        bonus: "",
        types: ["healing"],
        custom: { enabled: false, formula: "" },
        scaling: { mode: "whole", number: 2, formula: "" },
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
  },
}));

// 3. Clinical Scholar (Level 2)
write("src/features/doctor/clinical-scholar.json", createFeat({
  id: "DocClinicSchol01",
  name: "Clinical Scholar",
  img: "icons/tools/laboratory/microscope.webp",
  requirements: "Doctor 2",
  description:
    "<p>At 2nd level, your exhaustive training in xenobiology and surgery sets you apart from amateur field medics.</p>" +
    "<ul>" +
    "<li><strong>Medical Expertise</strong>: You gain proficiency in the <strong>Medicine</strong> skill if you do not already have it. Your proficiency bonus is <strong>doubled</strong> for any ability check you make that uses Medicine.</li>" +
    "<li><strong>Diagnostic Intuition</strong>: Choose one of the following skills: <strong>Investigation, Nature, or Lore</strong>. Whenever you make an ability check with the chosen skill relating to medicine, anatomy, xenobiology, diseases, or organic specimens, you can use your <strong>Wisdom modifier</strong> in place of Intelligence.</li>" +
    "</ul>",
}));

// 4. Clinical Discoveries (Level 2)
write("src/features/doctor/clinical-discoveries.json", createFeat({
  id: "DocClinicDisc001",
  name: "Clinical Discoveries",
  img: "icons/tools/laboratory/test-tube-rack-red.webp",
  requirements: "Doctor 2",
  description:
    "<p>At 2nd level, your clinical breakthroughs yield specialized medical paradigms and surgical protocols known as <strong>Clinical Discoveries</strong>.</p>" +
    "<p>You learn <strong>two Clinical Discoveries</strong> of your choice from the Clinical Discoveries compendium. You learn additional discoveries as shown in the Discoveries Known column of the Doctor table (`@scale.doctor.discoveries-known`), scaling to 10 discoveries at 18th level.</p>" +
    "<p>Whenever you gain a level in this class, you can choose one of the discoveries you know and replace it with another discovery for which you qualify.</p>",
}));

// 5. Vitality Infusion (Level 3)
write("src/features/doctor/vitality-infusion.json", createFeat({
  id: "DocVitalityInf01",
  name: "Vitality Infusion",
  img: "icons/magic/life/heart-cross-green.webp",
  requirements: "Doctor 3",
  description:
    "<p>Starting at 3rd level, your regenerative biocircuits fortify living tissue beyond its normal limits.</p>" +
    "<p>Whenever you execute a nanoprogram of <strong>Tier 1 or higher that restores hit points</strong>, you can choose yourself or one recipient of the healing. That creature's <strong>maximum hit points and current hit points increase by an amount equal to the nanoprogram's tier</strong> for <strong>1 minute</strong>.</p>" +
    "<p>A creature can benefit from only one instance of this feature at a time.</p>",
}));

// 6. Multitasker (Level 5)
write("src/features/doctor/multitasker.json", createFeat({
  id: "DocMultitasker01",
  name: "Multitasker",
  img: "icons/skills/movement/hands-glowing-green.webp",
  requirements: "Doctor 5",
  description:
    "<p>At 5th level, your neural implants and field reflexes allow you to manage multiple crises simultaneously.</p>" +
    "<ul>" +
    "<li>You can take a <strong>second Reaction</strong> each round.</li>" +
    "<li>When a friendly creature you can see and hear within 60 feet makes a saving throw, you can use your <strong>Reaction</strong> to immediately target that creature with your <strong>Critical Analysis</strong> feature.</li>" +
    "</ul>",
}));

// 7. Complete Healing (Level 20)
write("src/features/doctor/complete-healing.json", createFeat({
  id: "DocCompleteHeal1",
  name: "Complete Healing",
  img: "icons/magic/life/heart-shield-green.webp",
  requirements: "Doctor 20",
  description:
    "<p>At 20th level, you embody the pinnacle of bio-synthetic restoration.</p>" +
    "<h3>Wisdom Score Increase</h3>" +
    "<p>Your <strong>Wisdom score increases by 4</strong>, and your maximum Wisdom score is now <strong>24</strong>.</p>" +
    "<h3>Complete Healing</h3>" +
    "<p>Once per <strong>Long Rest</strong>, when you execute a nanoprogram that restores hit points, you can do so <strong>without expending Nanopool points</strong>. When you do, choose one creature within 60 feet. That creature:</p>" +
    "<ul>" +
    "<li>Regains <strong>all of its hit points</strong> up to its maximum.</li>" +
    "<li>Is cured of all active <strong>poisons, diseases, blindness, and deafness</strong>.</li>" +
    "<li>Has all levels of <strong>exhaustion</strong> completely removed.</li>" +
    "</ul>",
  uses: {
    value: 1,
    max: "1",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  advancement: [
    {
      _id: "advDocCompleteASI",
      type: "AbilityScoreImprovement",
      configuration: {
        points: 0,
        fixed: { str: 0, dex: 0, con: 0, int: 0, wis: 4, cha: 0 },
        cap: 24,
      },
      value: { type: "asi", wis: 4 },
      level: 20,
      title: "Wisdom Increase (+4, cap 24)",
    },
  ],
  activities: {
    dnd5eactCompleteH: {
      _id: "dnd5eactCompleteH",
      type: "heal",
      name: "Complete Healing Miracle",
      img: "",
      activation: { type: "special", value: null, condition: "1/Long Rest when executing a healing nanoprogram" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "1",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      healing: {
        number: null,
        denomination: null,
        bonus: "@attributes.hp.max",
        types: ["healing"],
        custom: { enabled: true, formula: "@attributes.hp.max" },
        scaling: { mode: "", number: null, formula: "" },
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

/* ================================================================== */
/*  2.  CLINICAL DISCOVERIES  →  src/features/doctor/discoveries/     */
/* ================================================================== */

console.log("\n▸ Doctor Clinical Discoveries");
const DISC_PATH = "src/features/doctor/discoveries";

function createDiscovery({ id, name, requirements = "Doctor 2", description, activities = {}, uses }) {
  return createFeat({
    id,
    name: `Discovery: ${name}`,
    img: "icons/tools/laboratory/test-tube-rack-red.webp",
    description,
    subtype: "discovery",
    requirements,
    activities,
    uses,
  });
}

// 1. Advanced Defibrillation
write(`${DISC_PATH}/advanced-defibrillation.json`, createDiscovery({
  id: "DiscAdvDefibril1",
  name: "Advanced Defibrillation",
  requirements: "Doctor 2",
  description:
    "<p>As a <strong>Reaction</strong> when an ally you can see within 30 feet drops to 0 hit points, you can instantly trigger the healing alternative of your <strong>Critical Analysis</strong> feature on that ally, preventing it from falling unconscious and restoring hit points normally.</p>",
  activities: {
    dnd5eactDefibril: {
      _id: "dnd5eactDefibril",
      type: "heal",
      name: "Emergency Defibrillation",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When an ally within 30 ft drops to 0 HP" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      healing: {
        number: 2,
        denomination: 4,
        bonus: "",
        types: ["healing"],
        custom: { enabled: false, formula: "" },
        scaling: { mode: "whole", number: 2, formula: "" },
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 2. Aesthetic Bio-Sculpting
write(`${DISC_PATH}/aesthetic-bio-sculpting.json`, createDiscovery({
  id: "DiscBioSculpt001",
  name: "Aesthetic Bio-Sculpting",
  requirements: "Doctor 2",
  description:
    "<p>By performing a <strong>10-minute surgical procedure</strong> using a Medkit, you can permanently or temporarily alter the physical appearance, facial structure, skin pigmentation, eye color, and hair of yourself or a willing living creature you touch.</p>" +
    "<p>This transformation functions as the <em>Alter Self</em> program (Change Appearance), but requires no concentration and lasts indefinitely until you choose to reverse it with another 10-minute procedure.</p>",
  activities: {
    dnd5eactBioSculpt: {
      _id: "dnd5eactBioSculpt",
      type: "utility",
      name: "Perform Bio-Sculpting",
      img: "",
      activation: { type: "minute", value: 10, condition: "10-minute surgical procedure" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "perm", concentration: false, override: false },
      range: { units: "touch", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "willing", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 3. Autopsy Forensics
write(`${DISC_PATH}/autopsy-forensics.json`, createDiscovery({
  id: "DiscAutopsyForen",
  name: "Autopsy Forensics",
  requirements: "Doctor 2",
  description:
    "<p>By spending <strong>1 minute</strong> conducting a forensic examination of a corpse or destroyed synthetic construct, you accurately deduce:</p>" +
    "<ul>" +
    "<li>The exact time of death (within a 10-minute window).</li>" +
    "<li>The precise biological cause of death (trauma, suffocation, poison, disease).</li>" +
    "<li>The species, origin, and any active toxins or pathogens present in the body.</li>" +
    "<li>The weapon type, caliber, damage category, or nanoprogram tier that struck the lethal blow.</li>" +
    "</ul>",
}));

// 4. Cellular Inoculation (Req: Doctor 5)
write(`${DISC_PATH}/cellular-inoculation.json`, createDiscovery({
  id: "DiscCellInocula1",
  name: "Cellular Inoculation",
  requirements: "Doctor 5",
  description:
    "<p>Subdermal biocircuits continuously filter your blood and lymphatic channels:</p>" +
    "<ul>" +
    "<li>You are completely <strong>immune to all diseases, poison damage, and the Poisoned condition</strong>.</li>" +
    "<li>You have <strong>Advantage on Constitution saving throws</strong> against environmental fatigue, sleep deprivation, and exhaustion.</li>" +
    "</ul>",
}));

// 5. Diagnostic Recon
write(`${DISC_PATH}/diagnostic-recon.json`, createDiscovery({
  id: "DiscDiagnostRec1",
  name: "Diagnostic Recon",
  requirements: "Doctor 2",
  description:
    "<p>Your retinal bio-scanner functions continuously. You can sense the presence and location of poisons, diseases, and venomous hazards within 30 feet at will without expending Nanopool points.</p>" +
    "<p>Additionally, you can visually gauge the physical health of any living creature you can see within 60 feet, immediately discerning whether its current hit points are <strong>above or below 50% of its maximum</strong>.</p>",
}));

// 6. Emergency Adrenaline
write(`${DISC_PATH}/emergency-adrenaline.json`, createDiscovery({
  id: "DiscEmergAdren01",
  name: "Emergency Adrenaline",
  requirements: "Doctor 2",
  description:
    "<p>Whenever you target a friendly creature with your <strong>Critical Analysis</strong> feature, you can inject it with a rapid neural stimulant.</p>" +
    "<p>The target's walking speed increases by <strong>+15 feet</strong> until the end of its next turn, and it can stand up from Prone costing <strong>0 feet of movement</strong>.</p>",
}));

// 7. Iron Circle (Req: Doctor 9)
write(`${DISC_PATH}/iron-circle.json`, createDiscovery({
  id: "DiscIronCircle01",
  name: "Iron Circle",
  requirements: "Doctor 9",
  description:
    "<p>Whenever you execute a nanoprogram of <strong>Tier 4 or higher that restores hit points</strong>, you can choose up to a number of creatures equal to your <strong>Wisdom modifier</strong> within 30 feet.</p>" +
    "<p>For <strong>1 hour</strong>, each target's carrying capacity and lifting limits are doubled, and each target gains a <strong>+2 bonus to Strength saving throws and checks</strong>.</p>",
}));

// 8. Medical Sidearm
write(`${DISC_PATH}/medical-sidearm.json`, createDiscovery({
  id: "DiscMedSidearm01",
  name: "Medical Sidearm",
  requirements: "Doctor 2",
  description:
    "<p>You calibrate your sidearms with target-lock ocular sensors. You can use your <strong>Wisdom modifier</strong> in place of Dexterity for attack rolls and damage rolls with <strong>blaster pistols</strong>.</p>",
}));

// 9. Nanite Purge (Req: Doctor 5)
write(`${DISC_PATH}/nanite-purge.json`, createDiscovery({
  id: "DiscNanitePurge1",
  name: "Nanite Purge",
  requirements: "Doctor 5",
  description:
    "<p>Whenever you execute a nanoprogram that restores hit points to a creature, you can spend <strong>2 additional Nanopool points</strong> to cleanse its system.</p>" +
    "<p>The target immediately ends one of the following conditions affecting it: <strong>Poisoned, Blinded, Deafened, Paralyzed, or any active non-magical disease</strong>.</p>",
}));

// 10. Overcharged Syringe (Req: Doctor 7)
write(`${DISC_PATH}/overcharged-syringe.json`, createDiscovery({
  id: "DiscOverchargeS1",
  name: "Overcharged Syringe",
  requirements: "Doctor 7",
  description:
    "<p>Once per turn when you hit a creature with an <strong>At-Will nanoprogram</strong> or a <strong>sidearm attack</strong>, you can inject virulent bio-toxins, dealing an extra <strong>1d8 necrotic or poison damage</strong> (your choice) to the target.</p>",
  activities: {
    dnd5eactOvercharge: {
      _id: "dnd5eactOvercharge",
      type: "damage",
      name: "Overcharged Bio-Toxin",
      img: "",
      activation: { type: "special", value: null, condition: "Once per turn on at-will nanoprogram or sidearm hit" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      damage: {
        critical: { bonus: "" },
        includeBase: false,
        parts: [
          {
            number: 1,
            denomination: 8,
            bonus: "",
            types: ["necrotic"],
            custom: { enabled: false, formula: "" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 11. Quarantine Field (Req: Doctor 12)
write(`${DISC_PATH}/quarantine-field.json`, createDiscovery({
  id: "DiscQuarantineF1",
  name: "Quarantine Field",
  requirements: "Doctor 12",
  description:
    "<p>You can deploy a specialized bio-stasis field to immobilize a hostile target. Once per <strong>Short or Long Rest</strong>, you can cast <em>Hold Person / Stasis</em> targeting a humanoid or synthetic creature without expending Nanopool points.</p>",
  uses: {
    value: 1,
    max: "1",
    per: "sr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactQuarantine: {
      _id: "dnd5eactQuarantine",
      type: "save",
      name: "Deploy Quarantine Stasis",
      img: "",
      activation: { type: "action", value: 1, condition: "1/Short or Long Rest" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "1",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: { value: "1", units: "minute", concentration: true, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "humanoid or synthetic" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["wis"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 12. Rapid Suture
write(`${DISC_PATH}/rapid-suture.json`, createDiscovery({
  id: "DiscRapidSuture1",
  name: "Rapid Suture",
  requirements: "Doctor 2",
  description:
    "<p>Whenever you use a <strong>Medkit</strong> to stabilize a dying creature with 0 hit points, that creature immediately regains <strong>1d4 hit points</strong> instead of remaining unconscious at 0 hit points, without requiring any Nanopool expenditure.</p>",
  activities: {
    dnd5eactRapidSuture: {
      _id: "dnd5eactRapidSuture",
      type: "heal",
      name: "Rapid Suture Revive",
      img: "",
      activation: { type: "action", value: 1, condition: "When stabilizing a dying creature with a Medkit" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { units: "touch", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "dying creature" },
        prompt: true,
        override: false,
      },
      healing: {
        number: 1,
        denomination: 4,
        bonus: "",
        types: ["healing"],
        custom: { enabled: false, formula: "" },
        scaling: { mode: "", number: null, formula: "" },
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 13. Sterile Bio-Barrier (Req: Doctor 5)
write(`${DISC_PATH}/sterile-bio-barrier.json`, createDiscovery({
  id: "DiscSterileBioB1",
  name: "Sterile Bio-Barrier",
  requirements: "Doctor 5",
  description:
    "<p>While you are not wearing any armor and not wielding a shield, your Armor Class equals <strong>10 + your Dexterity modifier + your Wisdom modifier</strong>.</p>",
}));

// 14. Uncontrollable Body Tremors (Req: Doctor 9)
write(`${DISC_PATH}/uncontrollable-body-tremors.json`, createDiscovery({
  id: "DiscBodyTremors1",
  name: "Uncontrollable Body Tremors",
  requirements: "Doctor 9",
  description:
    "<p>As an <strong>Action</strong>, you expend <strong>4 Nanopool points</strong> to broadcast a bio-electrical disruption pulse at a creature you can see within <strong>60 feet</strong>. The target must make a <strong>Constitution saving throw</strong> against your Program Save DC.</p>" +
    "<p>On a failed save, violent motor spasms rack the target's body for <strong>1 minute</strong>:</p>" +
    "<ul>" +
    "<li>Its speed is <strong>halved</strong>.</li>" +
    "<li>It <strong>cannot take Reactions</strong>.</li>" +
    "<li>It has <strong>Disadvantage on attack rolls</strong>.</li>" +
    "<li>It can make <strong>no more than one weapon attack</strong> per turn.</li>" +
    "</ul>" +
    "<p>The target repeats the saving throw at the end of each of its turns, ending the effect on itself on a success.</p>",
  activities: {
    dnd5eactBodyTremor: {
      _id: "dnd5eactBodyTremor",
      type: "save",
      name: "Induce Body Tremors",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 4 Nanopool points" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "minute", concentration: true, override: false },
      range: { value: "60", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["con"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

/* ================================================================== */
/*  3.  DOCTOR CLASS DOCUMENT  →  src/classes/doctor.json             */
/* ================================================================== */

console.log("\n▸ Doctor Class Document");

write("src/classes/doctor.json", {
  _id: "DoctorClass00001",
  name: "Doctor",
  type: "class",
  img: "icons/tools/laboratory/vials-glass-blue-red.webp",
  system: {
    description: {
      value:
        "<p>A field surgeon, bio-technician, and clinical scholar. The Doctor diagnoses tactical and biological weaknesses in real-time, weaves life-saving restorative nanoprograms, and dominates the battlefield through medical genius and biochemical supremacy.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "doctor",
    levels: 1,
    hd: { denomination: 6, spent: 0, additional: "" },
    primaryAbility: { value: ["wis"], all: false },
    spellcasting: { progression: "full", ability: "wis" },
    advancement: [
      /* ── Hit Points (d6) ── */
      {
        _id: "advDocHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: WIS, CHA ── */
      {
        _id: "advDocSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:wis", "saves:cha"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: none ── */
      {
        _id: "advDocArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },
      /* ── Weapon Proficiencies: pistol, simple-sourceweapon, simple-vibro ── */
      {
        _id: "advDocWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:pistol", "weapons:simple-sourceweapon", "weapons:simple-vibro"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Tool Proficiencies: choice of 1 ── */
      {
        _id: "advDocToolPrf001",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 1,
              pool: [
                "tools:medkit",
                "tools:cybertech-tools",
                "tools:chemists-supplies",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Tool Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 2 ── */
      {
        _id: "advDocSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 2,
              pool: [
                "skills:med",
                "skills:ins",
                "skills:prc",
                "skills:sur",
                "skills:tec",
                "skills:ele",
                "skills:nat",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advDocScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1:  { value: 4 },
            2:  { value: 8 },
            3:  { value: 12 },
            4:  { value: 16 },
            5:  { value: 20 },
            6:  { value: 24 },
            7:  { value: 28 },
            8:  { value: 32 },
            9:  { value: 36 },
            10: { value: 40 },
            11: { value: 44 },
            12: { value: 48 },
            13: { value: 52 },
            14: { value: 56 },
            15: { value: 60 },
            16: { value: 64 },
            17: { value: 68 },
            18: { value: 72 },
            19: { value: 76 },
            20: { value: 80 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },

      /* ── ScaleValue: Discoveries Known ── */
      {
        _id: "advDocScDisc0001",
        type: "ScaleValue",
        configuration: {
          identifier: "discoveries-known",
          type: "number",
          scale: {
            2:  { value: 2 },
            3:  { value: 3 },
            5:  { value: 5 },
            7:  { value: 6 },
            9:  { value: 7 },
            12: { value: 8 },
            15: { value: 9 },
            18: { value: 10 },
          },
        },
        value: {},
        level: 2,
        title: "Discoveries Known",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Critical Analysis) ── */
      {
        _id: "advDocItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocNanoProg00001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocCritAnalysis1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Doctor Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Clinical Scholar, Clinical Discoveries) ── */
      {
        _id: "advDocItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocClinicSchol01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocClinicDisc001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Doctor Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Medical Practice") ── */
      {
        _id: "advDocSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Medical Practice",
      },

      /* ── ItemGrant: Level 3 (Vitality Infusion) ── */
      {
        _id: "advDocItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocVitalityInf01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Doctor Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advDocASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Multitasker) ── */
      {
        _id: "advDocItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocMultitasker01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Doctor Features (Level 5)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advDocASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advDocASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advDocASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advDocASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Complete Healing) ── */
      {
        _id: "advDocItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.DocCompleteHeal1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Doctor Features (Level 20)",
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
  _key: "!items!DoctorClass00001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Doctor build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
