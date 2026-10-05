#!/usr/bin/env node
/**
 * build-trader.mjs
 * ---------------------------------------------------------------------------
 * Generates every source JSON document for the Trader class package:
 *   • src/features/trader/            – 13 core class features
 *   • src/features/trader/analytics/  – 7 Trader Analytics
 *   • src/classes/trader.json         – Trader class document
 *
 * Adheres strictly to AGENTS.md rules:
 *   - 16-character alphanumeric _id at root and in _key
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

/** Standard feat scaffold for Trader features and analytics */
function createFeat({
  id,
  name,
  img = "icons/commodities/currency/coins-plain-gold.webp",
  description,
  subtype = "",
  requirements = "Trader 1",
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
/*  1.  CORE CLASS FEATURES  →  src/features/trader/                  */
/* ================================================================== */

console.log("\n▸ Trader Core Class Features");

// 1. Nanoprogramming (Level 1)
write("src/features/trader/nanoprogramming.json", createFeat({
  id: "TrdNanoProg00001",
  name: "Nanoprogramming",
  img: "icons/magic/symbols/runes-star-pentagon-blue.webp",
  requirements: "Trader 1",
  description:
    "<p>At 1st level, you possess a specialized trade-deck neural implant loaded with economic and utility nanoprograms. As a <strong>2/3 nanocaster</strong>, your power level scales smoothly from 1st up to Tier 7 nanoprograms at higher levels.</p>" +
    "<h3>Charisma Nanocasting</h3>" +
    "<p><strong>Charisma</strong> is your nanocasting ability for your Trader nanoprograms, reflecting your negotiation power and market dominance.</p>" +
    "<ul>" +
    "<li><strong>Program Save DC</strong> = 8 + your proficiency bonus + your Charisma modifier</li>" +
    "<li><strong>Program Attack Modifier</strong> = your proficiency bonus + your Charisma modifier</li>" +
    "</ul>" +
    "<h3>Programs Known</h3>" +
    "<p>You know <strong>6 nanoprograms</strong> of your choice from the Trader Operating System at 1st level, and learn additional programs as shown on the class table.</p>" +
    "<h3>Nanopool Formula</h3>" +
    "<p>Your maximum Nanopool points equal <strong>(Trader level &times; 3) + your Charisma modifier</strong> (minimum 1 point). You regain all expended Nanopool points when you finish a <strong>Long Rest</strong>.</p>" +
    "<h3>Free Hand Requirement</h3>" +
    "<p>Executing nanoprograms requires at least <strong>one free hand</strong> to operate wristpads, ledger interfaces, or biometric injectors.</p>",
}));

// 2. Asset Siphon (Level 1)
write("src/features/trader/asset-siphon.json", createFeat({
  id: "TrdAssetSiph0001",
  name: "Asset Siphon",
  img: "icons/skills/melee/unarmed-punch-fist-blue.webp",
  requirements: "Trader 1",
  description:
    "<p>At 1st level, you master the tactical diversion of vital resources. You possess a <strong>Siphon Die</strong> that begins as a <strong>d4</strong> and scales as you gain Trader levels (d6 at 7th, d8 at 13th, d10 at 17th level).</p>" +
    "<h3>Asset Siphon Protocols</h3>" +
    "<ul>" +
    "<li><strong>Deprive</strong>: When you hit a creature with a weapon attack within 30 feet, spend 1 Nanopool point to roll your Siphon Die and subtract the result from the target's next attack roll, ability check, or saving throw before the end of its next turn. You can spend 1 additional Nanopool point (Asset Transfer) to add the rolled amount to the next roll of a willing ally within 30 feet.</li>" +
    "<li><strong>Snare</strong>: As a Reaction when a creature moves within 30 feet of you, spend 1 Nanopool point to force a Strength saving throw against your Program Save DC. On a failed save, the creature's speed is reduced by <strong>5 &times; your Siphon Die roll</strong> until the end of the turn. You can spend 1 additional Nanopool point to grant an equal speed boost to an ally within 30 feet.</li>" +
    "<li><strong>Energy Drain</strong>: As a Bonus Action, spend 1 Nanopool point and roll your Siphon Die. You sacrifice hit points or Nanopool points equal to the roll to grant an equal amount of hit points or Nanopool to a willing ally within 30 feet.</li>" +
    "</ul>",
  activities: {
    dnd5eactDeprive: {
      _id: "dnd5eactDeprive",
      type: "utility",
      name: "Deprive",
      img: "",
      activation: { type: "special", value: null, condition: "On weapon hit within 30 ft; spend 1 NP (optional +1 NP for transfer)" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactSnare: {
      _id: "dnd5eactSnare",
      type: "save",
      name: "Snare",
      img: "",
      activation: { type: "reaction", value: 1, condition: "When a creature moves within 30 ft; spend 1 NP" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      save: {
        ability: ["str"],
        dc: { calculation: "spellcasting", formula: "" },
      },
      damage: { critical: { bonus: "" }, includeBase: false, parts: [] },
      effects: [],
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
    dnd5eactEnergyDrn: {
      _id: "dnd5eactEnergyDrn",
      type: "utility",
      name: "Energy Drain",
      img: "",
      activation: { type: "bonus", value: 1, condition: "Spend 1 NP; sacrifice HP/NP to transfer" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 2,
    },
  },
}));

// 3. Skill Wrangle (Level 1)
write("src/features/trader/skill-wrangle.json", createFeat({
  id: "TrdSkillWrang001",
  name: "Skill Wrangle",
  img: "icons/skills/social/diplomacy-handshake-yellow.webp",
  requirements: "Trader 1",
  description:
    "<p>At 1st level, you can re-index neural training and synaptic memory between willing subjects. As an <strong>Action</strong>, you spend <strong>2 Nanopool points</strong> to choose two willing creatures within <strong>30 feet</strong> (one of which can be yourself).</p>" +
    "<p>For <strong>1 hour</strong>, one creature temporarily transfers one of its skill or tool proficiencies to the other creature. If the receiving creature is already proficient in the chosen skill or tool, it instead gains <strong>Expertise</strong> (doubling its proficiency bonus) for the duration.</p>",
  activities: {
    dnd5eactWrangle: {
      _id: "dnd5eactWrangle",
      type: "utility",
      name: "Execute Skill Wrangle",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 2 Nanopool points" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "hour", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "2", type: "willing", choice: false, special: "creatures within 30 ft" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 4. Trader Analytics (Level 2)
write("src/features/trader/trader-analytics.json", createFeat({
  id: "TrdAnalytics0001",
  name: "Trader Analytics",
  img: "icons/tools/scribing/scroll-quill-blue.webp",
  requirements: "Trader 2",
  description:
    "<p>At 2nd level, you implement high-frequency predictive algorithms known as <strong>Trader Analytics</strong> to dominate marketplace and battlefield alike.</p>" +
    "<p>You learn two Analytics of your choice from the Trader Analytics compendium. You learn additional analytics at levels 6, 11, and 15 (`@scale.trader.analytics-known`). Each analytic offers a permanent <strong>Passive</strong> benefit and an activated <strong>Active Exchange</strong> stance.</p>" +
    "<h3>Active Exchange</h3>" +
    "<p>You can activate one Active Exchange per <strong>Short or Long Rest</strong> for free. You can initiate additional Active Exchanges by spending <strong>2 Nanopool points</strong> each.</p>",
  activities: {
    dnd5eactActExchg: {
      _id: "dnd5eactActExchg",
      type: "utility",
      name: "Active Exchange",
      img: "",
      activation: { type: "special", value: null, condition: "1/Short Rest free, or spend 2 Nanopool points" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 5. Expense Account (Level 2)
write("src/features/trader/expense-account.json", createFeat({
  id: "TrdExpenseAcc001",
  name: "Expense Account",
  img: "icons/commodities/currency/coin-embossed-gold-crown.webp",
  requirements: "Trader 2",
  description:
    "<p>At 2nd level, your corporate credit limit and liquidity reserves grant you an <strong>Expense Account</strong>. You have a pool of Expense Points equal to your <strong>Trader level + your Charisma modifier</strong> (`@classes.trader.levels + @abilities.cha.mod`).</p>" +
    "<p>You regain all expended Expense Points when you finish a <strong>Long Rest</strong> in a civilized port, orbital station, or connected planetary Grid.</p>" +
    "<h3>Expense Protocols</h3>" +
    "<ul>" +
    "<li><strong>Emergency Requisition</strong>: As an Action, spend 1 Expense Point to immediately fabricate or replicate weapons, ammunition, tech tools, or consumable gear worth up to 50 credits. Requisitioned items remain operational for 24 hours before degrading.</li>" +
    "<li><strong>Corporate Bribe</strong>: When making a Charisma check (Deception, Intimidation, or Persuasion), spend 1 Expense Point to add your <strong>Siphon Die</strong> to the roll.</li>" +
    "<li><strong>Cover the Tab</strong>: As a Reaction when an ally within 30 feet fails a Charisma check against a non-hostile creature, spend 2 Expense Points to allow that ally to reroll the check.</li>" +
    "</ul>",
  uses: {
    value: "@classes.trader.levels + @abilities.cha.mod",
    max: "@classes.trader.levels + @abilities.cha.mod",
    per: "lr",
    recovery: "",
    prompt: false,
  },
  activities: {
    dnd5eactEmergReq: {
      _id: "dnd5eactEmergReq",
      type: "utility",
      name: "Emergency Requisition",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 1 Expense Point" },
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
      duration: { value: "24", units: "hour", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "fabricates gear <= 50 credits" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactCorpBribe: {
      _id: "dnd5eactCorpBribe",
      type: "utility",
      name: "Corporate Bribe",
      img: "",
      activation: { type: "special", value: null, condition: "On Charisma check; spend 1 Expense Point" },
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
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "adds Siphon Die to Cha check" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
    dnd5eactCoverTab: {
      _id: "dnd5eactCoverTab",
      type: "utility",
      name: "Cover the Tab",
      img: "",
      activation: { type: "reaction", value: 1, condition: "Ally within 30 ft fails Cha check with non-hostile; spend 2 Expense Points" },
      consumption: {
        targets: [
          {
            type: "itemUses",
            target: "",
            value: "2",
            scaling: { mode: "", formula: "" },
          },
        ],
        scaling: { allowed: false },
      },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "rerolls failed Cha check" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 2,
    },
  },
}));

// 6. Market Leverage (Level 3)
write("src/features/trader/market-leverage.json", createFeat({
  id: "TrdMarketLev0001",
  name: "Market Leverage",
  img: "icons/commodities/currency/coins-assorted-mix-platinum.webp",
  requirements: "Trader 3",
  description:
    "<p>At 3rd level, your financial acumen gives you unprecedented commercial dominance.</p>" +
    "<ul>" +
    "<li><strong>Aggressive Haggling</strong>: You have <strong>Advantage</strong> on Charisma (Persuasion) and Charisma (Deception) checks made to negotiate purchase prices, contract fees, bribes, or item appraisals.</li>" +
    "<li><strong>Wholesale Margins</strong>: You and your companions gain a permanent <strong>15% discount</strong> on all weapons, armor, tech gear, provisions, and stims purchased from recognized vendors. Additionally, you sell salvaged gear and loot for <strong>+10%</strong> above standard merchant trade-in rates.</li>" +
    "</ul>",
}));

// 7. Attack Drain (Level 5)
write("src/features/trader/attack-drain.json", createFeat({
  id: "TrdAttackDrain01",
  name: "Attack Drain",
  img: "icons/skills/melee/strike-blade-blood-red.webp",
  requirements: "Trader 5",
  description:
    "<p>Beginning at 5th level, whenever you use your <strong>Siphon Die</strong> on a hostile creature (such as via Deprive or Snare), you mark a severe vulnerability in its defense.</p>" +
    "<p>Once per turn, until the end of your next turn, the next weapon attack that hits that creature deals <strong>extra damage equal to 2 rolls of your Siphon Die</strong> (`2@scale.trader.siphon-die`).</p>",
  activities: {
    dnd5eactAtkDrain: {
      _id: "dnd5eactAtkDrain",
      type: "damage",
      name: "Attack Drain Burst",
      img: "",
      activation: { type: "special", value: null, condition: "Once per turn when using Siphon Die on a creature" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "round", value: "1", concentration: false, override: false },
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
            number: null,
            denomination: null,
            bonus: "2@scale.trader.siphon-die",
            types: ["kinetic"],
            custom: { enabled: true, formula: "2@scale.trader.siphon-die" },
            scaling: { mode: "", number: null, formula: "" },
          },
        ],
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 8. Improved Wrangle (Level 5)
write("src/features/trader/improved-wrangle.json", createFeat({
  id: "TrdImpWrangle001",
  name: "Improved Wrangle",
  img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
  requirements: "Trader 5",
  description:
    "<p>Starting at 5th level, your neural reconfiguration techniques unlock deeper physiological reserves. As an <strong>Action</strong>, spend <strong>3 Nanopool points</strong> to touch one willing creature.</p>" +
    "<p>For <strong>8 hours</strong>, the target gains the following benefits:</p>" +
    "<ul>" +
    "<li>The target's effective Strength and Constitution scores are treated as <strong>+4 higher</strong> for the purposes of carrying capacity, armor requirements, and heavy weapon prerequisites.</li>" +
    "<li>The target's attunement / cyberware installation limit increases by <strong>+1</strong>.</li>" +
    "<li>Once during the 8-hour duration, the target can add your <strong>Siphon Die roll + your Charisma modifier</strong> to one ability check, attack roll, or saving throw it makes.</li>" +
    "</ul>" +
    "<p>You can have only one creature benefiting from this feature at a time.</p>",
  activities: {
    dnd5eactImpWrang: {
      _id: "dnd5eactImpWrang",
      type: "utility",
      name: "Apply Improved Wrangle",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 3 Nanopool points" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "8", units: "hour", concentration: false, override: false },
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

// 9. Negotiator's Insight (Level 6)
write("src/features/trader/negotiators-insight.json", createFeat({
  id: "TrdNegotInsight1",
  name: "Negotiator's Insight",
  img: "icons/skills/awareness/eye-open-silhouette-purple.webp",
  requirements: "Trader 6",
  description:
    "<p>At 6th level, your experience across underworld bazaars and high-level corporate boardrooms gives you unmatched intuitive psychology.</p>" +
    "<ul>" +
    "<li>You have <strong>Advantage on Wisdom (Insight) checks</strong> to determine the true motives, emotional state, or financial vulnerability of any creature with whom you are speaking.</li>" +
    "<li>If you observe or converse with a creature for at least 1 minute, you learn whether its Charisma score is equal to, higher, or lower than yours.</li>" +
    "</ul>",
}));

// 10. Battle Readiness (Level 10)
write("src/features/trader/battle-readiness.json", createFeat({
  id: "TrdBattleReady01",
  name: "Battle Readiness",
  img: "icons/skills/movement/arrow-upward-yellow.webp",
  requirements: "Trader 10",
  description:
    "<p>At 10th level, you execute offensive strikes seamlessly alongside defensive maneuvering and biocircuit execution.</p>" +
    "<p>Whenever you take the <strong>Dodge</strong> or <strong>Disengage</strong> action, or whenever you cast a nanoprogram with an action cost of 1 Action on your turn, you can make <strong>one weapon attack as a Bonus Action</strong>.</p>",
  activities: {
    dnd5eactBtlReady: {
      _id: "dnd5eactBtlReady",
      type: "utility",
      name: "Battle Readiness Attack",
      img: "",
      activation: { type: "bonus", value: 1, condition: "When taking Dodge, Disengage, or casting a 1-action nanoprogram" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "creature", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 11. Team Wrangle (Level 15)
write("src/features/trader/team-wrangle.json", createFeat({
  id: "TrdTeamWrangle01",
  name: "Team Wrangle",
  img: "icons/skills/social/diplomacy-unity-alliance.webp",
  requirements: "Trader 15",
  description:
    "<p>At 15th level, your neural reconfiguration broadcasts across an entire network. When you activate your <strong>Improved Wrangle</strong> feature, you can grant its benefits simultaneously to a number of willing creatures up to your <strong>Proficiency Bonus</strong> without spending additional Nanopool points.</p>",
}));

// 12. Market Dominance (Level 17)
write("src/features/trader/market-dominance.json", createFeat({
  id: "TrdMarketDomin01",
  name: "Market Dominance",
  img: "icons/commodities/currency/coins-plain-gold.webp",
  requirements: "Trader 17",
  description:
    "<p>At 17th level, your economic empire and nanoprogramming leverage reach unmatched heights.</p>" +
    "<ul>" +
    "<li>Your <strong>Siphon Die escalates to a d10</strong>.</li>" +
    "<li>You unlock access to <strong>Tier 7 apex market nanoprograms</strong> in your Operating System repertoire.</li>" +
    "</ul>",
}));

// 13. Mogul (Level 20)
write("src/features/trader/mogul.json", createFeat({
  id: "TrdMogul00000001",
  name: "Mogul",
  img: "icons/commodities/currency/crown-gold.webp",
  requirements: "Trader 20",
  description:
    "<p>At 20th level, you are an untouchable financial titan and master of combat liquidity.</p>" +
    "<h3>Charisma Increase</h3>" +
    "<p>Your <strong>Charisma score increases by 4</strong>, and your maximum Charisma score is now <strong>24</strong>.</p>" +
    "<h3>Combat Liquidity</h3>" +
    "<ul>" +
    "<li>Whenever you roll your Siphon Die, you can spend <strong>1 Expense Point</strong> (no action required) to take the <strong>maximum possible roll</strong> on the die instead of rolling.</li>" +
    "<li>As a <strong>Bonus Action</strong>, you can convert up to <strong>3 Expense Points</strong> into Nanopool points on a 1-to-1 ratio.</li>" +
    "</ul>",
  advancement: [
    {
      _id: "advTrdMogulASI01",
      type: "AbilityScoreImprovement",
      configuration: {
        points: 0,
        fixed: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 4 },
        cap: 24,
      },
      value: { type: "asi", cha: 4 },
      level: 20,
      title: "Charisma Increase (+4, cap 24)",
    },
  ],
  activities: {
    dnd5eactMaxSiphon: {
      _id: "dnd5eactMaxSiphon",
      type: "utility",
      name: "Maximize Siphon Die",
      img: "",
      activation: { type: "special", value: null, condition: "Spend 1 Expense Point when rolling Siphon Die" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
    dnd5eactExpToNP: {
      _id: "dnd5eactExpToNP",
      type: "utility",
      name: "Convert Expense Points to Nanopool",
      img: "",
      activation: { type: "bonus", value: 1, condition: "Convert up to 3 Expense Points to Nanopool 1:1" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 1,
    },
  },
}));

/* ================================================================== */
/*  2.  TRADER ANALYTICS  →  src/features/trader/analytics/           */
/* ================================================================== */

console.log("\n▸ Trader Analytics");
const ANA_PATH = "src/features/trader/analytics";

function createAnalytic({ id, name, requirements = "Trader 2", description, activities = {}, uses }) {
  return createFeat({
    id,
    name,
    img: "icons/tools/scribing/scroll-quill-blue.webp",
    description,
    subtype: "analytic",
    requirements,
    activities,
    uses,
  });
}

// 1. Analytic: The Extortionist (Margin)
write(`${ANA_PATH}/analytic-margin.json`, createAnalytic({
  id: "AnaMargin0000001",
  name: "Analytic: The Extortionist (Margin)",
  requirements: "Trader 2",
  description:
    "<p><strong>Passive Protocol</strong>: When you take the Attack action, you can forgo making a weapon attack roll against a target to force it to make a <strong>Dexterity saving throw (DC = 8 + your weapon attack modifier)</strong>. On a failure, it takes the weapon's normal damage and effects.</p>" +
    "<p><strong>Active Exchange (Bonus Action, 1 minute)</strong>: Whenever a target succeeds on its Dexterity saving throw against this attack, an ally within 30 feet gains <strong>Temporary Hit Points equal to your Charisma modifier</strong>. If a target rolls a natural 1 on the saving throw, it automatically takes maximum damage.</p>",
  activities: {
    dnd5eactExtortStnc: {
      _id: "dnd5eactExtortStnc",
      type: "utility",
      name: "Active Exchange: Extortionist Protocol",
      img: "",
      activation: { type: "bonus", value: 1, condition: "1 min duration" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "minute", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 2. Analytic: The Debt Collector (Strike-Breaker)
write(`${ANA_PATH}/analytic-strike-breaker.json`, createAnalytic({
  id: "AnaStrikeBrkr001",
  name: "Analytic: The Debt Collector (Strike-Breaker)",
  requirements: "Trader 2",
  description:
    "<p><strong>Passive Protocol</strong>: Your unarmed strike damage die increases by one size (1 &rarr; 1d4 &rarr; 1d6 &rarr; 1d8). Your unarmed strikes gain the <strong>Finesse</strong> property, and you can use your <strong>Charisma modifier</strong> in place of Strength for attack rolls, damage rolls, and grapple/shove checks.</p>" +
    "<p><strong>Active Exchange (Bonus Action, 1 minute)</strong>: Your unarmed strikes count as enhanced for overcoming damage resistance. When you hit with an unarmed strike, you can activate <strong>Pain Exchange</strong> to sacrifice 1d4 HP and deal maximum damage on the strike.</p>",
  activities: {
    dnd5eactDebtColl: {
      _id: "dnd5eactDebtColl",
      type: "utility",
      name: "Active Exchange: Debt Collection Stance",
      img: "",
      activation: { type: "bonus", value: 1, condition: "1 min duration" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "minute", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 3. Analytic: The Asset Tank (Monopolist)
write(`${ANA_PATH}/analytic-monopolist.json`, createAnalytic({
  id: "AnaMonopolist001",
  name: "Analytic: The Asset Tank (Monopolist)",
  requirements: "Trader 2",
  description:
    "<p><strong>Passive Protocol</strong>: You gain proficiency with <strong>Medium Armor and Shields</strong>.</p>" +
    "<p><strong>Active Exchange (Bonus Action, 1 minute)</strong>: You initiate Bailout Protocols. You have Advantage on saving throws and checks against being moved or knocked prone. Furthermore, as a Reaction when an adjacent ally takes damage, you can absorb the impact, taking half the damage yourself while the ally takes the remaining half.</p>",
  activities: {
    dnd5eactMonopoly: {
      _id: "dnd5eactMonopoly",
      type: "utility",
      name: "Active Exchange: Monopoly Stance",
      img: "",
      activation: { type: "bonus", value: 1, condition: "1 min duration" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "minute", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 4. Analytic: The Consultant (Specialist)
write(`${ANA_PATH}/analytic-specialist.json`, createAnalytic({
  id: "AnaSpecialist001",
  name: "Analytic: The Consultant (Specialist)",
  requirements: "Trader 2",
  description:
    "<p><strong>Passive Protocol</strong>: Choose one skill or tool kit in which you are proficient. You add <strong>half your Charisma modifier</strong> (rounded down, minimum +1) to checks you make using that skill or tool.</p>" +
    "<p><strong>Active Exchange (Bonus Action, 10 minutes)</strong>: As a Reaction when an ally within 30 feet makes an ability check, you can grant that ally a bonus equal to your full <strong>Charisma modifier</strong>. However, you subtract that same amount from the next ability check you make before the stance ends.</p>",
  activities: {
    dnd5eactConsult: {
      _id: "dnd5eactConsult",
      type: "utility",
      name: "Active Exchange: Specialist Advice",
      img: "",
      activation: { type: "bonus", value: 1, condition: "10 min duration" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "10", units: "minute", concentration: false, override: false },
      range: { override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "self", choice: false, special: "" },
        prompt: false,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 5. Analytic: The Resource Skimmer (Embezzler)
write(`${ANA_PATH}/analytic-embezzler.json`, createAnalytic({
  id: "AnaEmbezzler0001",
  name: "Analytic: The Resource Skimmer (Embezzler)",
  requirements: "Trader 2",
  description:
    "<p><strong>Passive Protocol</strong>: Whenever you finish a Short or Long Rest, you gain <strong>Temporary Nanopool points equal to half your Charisma modifier</strong> (minimum 1).</p>" +
    "<p><strong>Active Exchange (Action)</strong>: Resource Liquidation. You can expend up to <strong>2 unspent Hit Dice</strong> to immediately restore an equal number of Nanopool points to an allied nanocaster within 30 feet.</p>",
  activities: {
    dnd5eactEmbezzle: {
      _id: "dnd5eactEmbezzle",
      type: "utility",
      name: "Active Exchange: Resource Liquidation",
      img: "",
      activation: { type: "action", value: 1, condition: "Expend up to 2 Hit Dice to grant equal Nanopool to ally within 30 ft" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "allied nanocaster" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

// 6. Analytic: Golden Handshake (Req: Trader 6)
write(`${ANA_PATH}/analytic-golden-handshake.json`, createAnalytic({
  id: "AnaGoldHandshk01",
  name: "Analytic: Golden Handshake",
  requirements: "Trader 6",
  description:
    "<p><strong>Passive Protocol</strong>: Your maximum Expense Account capacity permanently increases by an amount equal to your <strong>Proficiency Bonus</strong>.</p>" +
    "<p><strong>Active Exchange (Action, 3 Expense Points)</strong>: You offer an exorbitant settlement or fabricated severance package to one humanoid or synthetic creature within 30 feet. The target must succeed on a <strong>Wisdom saving throw</strong> against your Program Save DC or become <strong>Charmed</strong> by you for <strong>1 hour</strong>. While Charmed, it ignores your companions and accepts forged credentials without scrutiny.</p>",
  activities: {
    dnd5eactGoldHand: {
      _id: "dnd5eactGoldHand",
      type: "save",
      name: "Golden Handshake Offer",
      img: "",
      activation: { type: "action", value: 1, condition: "Spend 3 Expense Points" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { value: "1", units: "hour", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
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

// 7. Analytic: Liquid Asset (Req: Trader 11)
write(`${ANA_PATH}/analytic-liquid-asset.json`, createAnalytic({
  id: "AnaLiquidAsset01",
  name: "Analytic: Liquid Asset",
  requirements: "Trader 11",
  description:
    "<p><strong>Passive Protocol</strong>: During a Short Rest, you can deposit <strong>250 credits</strong> into escrow accounts to immediately regain <strong>2 expended Expense Points</strong>.</p>" +
    "<p><strong>Active Exchange (Bonus Action, 2 Expense Points + 1 Nanopool point)</strong>: You immediately inject emergency liquidity into an ally within 30 feet. That ally gains <strong>Temporary Hit Points equal to your Siphon Die roll + your Charisma modifier</strong> and immediately ends one of the following conditions affecting it: <strong>Blinded, Deafened, or Poisoned</strong>.</p>",
  activities: {
    dnd5eactLiquidAst: {
      _id: "dnd5eactLiquidAst",
      type: "utility",
      name: "Active Exchange: Emergency Liquidity",
      img: "",
      activation: { type: "bonus", value: 1, condition: "Spend 2 Expense Points + 1 Nanopool point" },
      consumption: { targets: [], scaling: { allowed: false } },
      duration: { units: "inst", concentration: false, override: false },
      range: { value: "30", units: "ft", override: false },
      target: {
        template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
        affects: { count: "1", type: "ally", choice: false, special: "" },
        prompt: true,
        override: false,
      },
      uses: { spent: 0, max: "", recovery: [] },
      sort: 0,
    },
  },
}));

/* ================================================================== */
/*  3.  TRADER CLASS DOCUMENT  →  src/classes/trader.json             */
/* ================================================================== */

console.log("\n▸ Trader Class Document");

write("src/classes/trader.json", {
  _id: "TraderClass00001",
  name: "Trader",
  type: "class",
  img: "icons/commodities/currency/coins-plain-gold.webp",
  system: {
    description: {
      value:
        "<p>A financial broker, black-market syndicate kingpin, and master of resource manipulation. The Trader dominates the battlefield by siphoning vitality, rewriting synaptic proficiencies on the fly, and wielding vast credit reserves to manipulate combat logistics.</p>",
    },
    source: { custom: "Suns of Rubi" },
    identifier: "trader",
    levels: 1,
    hd: { denomination: 8, spent: 0, additional: "" },
    primaryAbility: { value: ["cha", "dex"], all: false },
    spellcasting: { progression: "half", ability: "cha" },
    advancement: [
      /* ── Hit Points (d8) ── */
      {
        _id: "advTrdHitPoints1",
        type: "HitPoints",
        configuration: {},
        value: {},
        level: 1,
        title: "Hit Points",
      },
      /* ── Saving Throws: CHA, WIS ── */
      {
        _id: "advTrdSavesPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["saves:cha", "saves:wis"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Saving Throws",
      },
      /* ── Armor Proficiencies: lgt ── */
      {
        _id: "advTrdArmorPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["armor:lgt"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Armor Training",
      },
      /* ── Weapon Proficiencies: sim, shotgun, blaster-pistol, vibro-dagger ── */
      {
        _id: "advTrdWeaponPr01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: ["weapons:sim", "weapons:shotgun", "weapons:blaster-pistol", "weapons:vibro-dagger"],
          choices: [],
        },
        value: { chosen: [] },
        level: 1,
        title: "Weapon Proficiencies",
      },
      /* ── Skill Proficiencies: choice of 3 ── */
      {
        _id: "advTrdSkillPrf01",
        type: "Trait",
        configuration: {
          mode: "default",
          allowReplacements: false,
          grants: [],
          choices: [
            {
              count: 3,
              pool: [
                "skills:dec",
                "skills:ins",
                "skills:itm",
                "skills:inv",
                "skills:prc",
                "skills:per",
                "skills:slt",
              ],
            },
          ],
        },
        value: { chosen: [] },
        level: 1,
        title: "Skill Proficiencies",
      },

      /* ── ScaleValue: Siphon Die ── */
      {
        _id: "advTrdScSiphon01",
        type: "ScaleValue",
        configuration: {
          identifier: "siphon-die",
          type: "dice",
          scale: {
            1:  { number: 1, faces: 4 },
            7:  { number: 1, faces: 6 },
            13: { number: 1, faces: 8 },
            17: { number: 1, faces: 10 },
          },
        },
        value: {},
        level: 1,
        title: "Siphon Die",
      },

      /* ── ScaleValue: Nanopool Points ── */
      {
        _id: "advTrdScNanopl01",
        type: "ScaleValue",
        configuration: {
          identifier: "nanopool-points",
          type: "number",
          scale: {
            1:  { value: 3 },
            2:  { value: 6 },
            3:  { value: 9 },
            4:  { value: 12 },
            5:  { value: 15 },
            6:  { value: 18 },
            7:  { value: 21 },
            8:  { value: 24 },
            9:  { value: 27 },
            10: { value: 30 },
            11: { value: 33 },
            12: { value: 36 },
            13: { value: 39 },
            14: { value: 42 },
            15: { value: 45 },
            16: { value: 48 },
            17: { value: 51 },
            18: { value: 54 },
            19: { value: 57 },
            20: { value: 60 },
          },
        },
        value: {},
        level: 1,
        title: "Nanopool Points",
      },

      /* ── ScaleValue: Analytics Known ── */
      {
        _id: "advTrdScAnalyt01",
        type: "ScaleValue",
        configuration: {
          identifier: "analytics-known",
          type: "number",
          scale: {
            2:  { value: 2 },
            6:  { value: 3 },
            11: { value: 4 },
            15: { value: 5 },
          },
        },
        value: {},
        level: 2,
        title: "Analytics Known",
      },

      /* ── ScaleValue: Expense Points ── */
      {
        _id: "advTrdScExpPts01",
        type: "ScaleValue",
        configuration: {
          identifier: "expense-points",
          type: "number",
          formula: "@classes.trader.levels + @abilities.cha.mod",
          scale: {
            1:  { value: 1, formula: "@classes.trader.levels + @abilities.cha.mod" },
            2:  { value: 2, formula: "@classes.trader.levels + @abilities.cha.mod" },
            3:  { value: 3, formula: "@classes.trader.levels + @abilities.cha.mod" },
            4:  { value: 4, formula: "@classes.trader.levels + @abilities.cha.mod" },
            5:  { value: 5, formula: "@classes.trader.levels + @abilities.cha.mod" },
            6:  { value: 6, formula: "@classes.trader.levels + @abilities.cha.mod" },
            7:  { value: 7, formula: "@classes.trader.levels + @abilities.cha.mod" },
            8:  { value: 8, formula: "@classes.trader.levels + @abilities.cha.mod" },
            9:  { value: 9, formula: "@classes.trader.levels + @abilities.cha.mod" },
            10: { value: 10, formula: "@classes.trader.levels + @abilities.cha.mod" },
            11: { value: 11, formula: "@classes.trader.levels + @abilities.cha.mod" },
            12: { value: 12, formula: "@classes.trader.levels + @abilities.cha.mod" },
            13: { value: 13, formula: "@classes.trader.levels + @abilities.cha.mod" },
            14: { value: 14, formula: "@classes.trader.levels + @abilities.cha.mod" },
            15: { value: 15, formula: "@classes.trader.levels + @abilities.cha.mod" },
            16: { value: 16, formula: "@classes.trader.levels + @abilities.cha.mod" },
            17: { value: 17, formula: "@classes.trader.levels + @abilities.cha.mod" },
            18: { value: 18, formula: "@classes.trader.levels + @abilities.cha.mod" },
            19: { value: 19, formula: "@classes.trader.levels + @abilities.cha.mod" },
            20: { value: 20, formula: "@classes.trader.levels + @abilities.cha.mod" },
          },
        },
        value: {},
        level: 2,
        title: "Expense Points",
      },

      /* ── ItemGrant: Level 1 (Nanoprogramming, Asset Siphon, Skill Wrangle) ── */
      {
        _id: "advTrdItmGrLvl01",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdNanoProg00001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdAssetSiph0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdSkillWrang001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 1,
        title: "Trader Features (Level 1)",
      },

      /* ── ItemGrant: Level 2 (Trader Analytics, Expense Account) ── */
      {
        _id: "advTrdItmGrLvl02",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdAnalytics0001",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdExpenseAcc001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 2,
        title: "Trader Features (Level 2)",
      },

      /* ── Subclass: Level 3 ("Trader Business Model") ── */
      {
        _id: "advTrdSubclass01",
        type: "Subclass",
        configuration: {},
        value: {},
        level: 3,
        title: "Trader Business Model",
      },

      /* ── ItemGrant: Level 3 (Market Leverage) ── */
      {
        _id: "advTrdItmGrLvl03",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdMarketLev0001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 3,
        title: "Trader Features (Level 3)",
      },

      /* ── ASI: Level 4 ── */
      {
        _id: "advTrdASILvl0401",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 4,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 5 (Attack Drain, Improved Wrangle) ── */
      {
        _id: "advTrdItmGrLvl05",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdAttackDrain01",
              optional: false,
            },
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdImpWrangle001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 5,
        title: "Trader Features (Level 5)",
      },

      /* ── ItemGrant: Level 6 (Negotiator's Insight) ── */
      {
        _id: "advTrdItmGrLvl06",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdNegotInsight1",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 6,
        title: "Trader Features (Level 6)",
      },

      /* ── ASI: Level 8 ── */
      {
        _id: "advTrdASILvl0801",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 8,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 10 (Battle Readiness) ── */
      {
        _id: "advTrdItmGrLvl10",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdBattleReady01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 10,
        title: "Trader Features (Level 10)",
      },

      /* ── ASI: Level 12 ── */
      {
        _id: "advTrdASILvl1201",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 12,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 15 (Team Wrangle) ── */
      {
        _id: "advTrdItmGrLvl15",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdTeamWrangle01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 15,
        title: "Trader Features (Level 15)",
      },

      /* ── ASI: Level 16 ── */
      {
        _id: "advTrdASILvl1601",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 16,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 17 (Market Dominance) ── */
      {
        _id: "advTrdItmGrLvl17",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdMarketDomin01",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 17,
        title: "Trader Features (Level 17)",
      },

      /* ── ASI: Level 19 ── */
      {
        _id: "advTrdASILvl1901",
        type: "AbilityScoreImprovement",
        configuration: { points: 2, fixed: {}, cap: 2 },
        value: { type: "asi" },
        level: 19,
        title: "Ability Score Improvement",
      },

      /* ── ItemGrant: Level 20 (Mogul) ── */
      {
        _id: "advTrdItmGrLvl20",
        type: "ItemGrant",
        configuration: {
          items: [
            {
              uuid: "Compendium.suns-of-rubi-core.class-features.Item.TrdMogul00000001",
              optional: false,
            },
          ],
          optional: false,
          spell: null,
        },
        value: {},
        level: 20,
        title: "Trader Features (Level 20)",
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
  _key: "!items!TraderClass00001",
});

/* ================================================================== */
/*  Summary                                                            */
/* ================================================================== */

console.log("\n✅  Trader build complete.");
console.log("   Run `npm run build` to compile LevelDB packs.\n");
