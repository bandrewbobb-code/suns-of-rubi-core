/**
 * scripts/build-backgrounds.mjs
 *
 * Deterministic build script generating:
 * - 9 Origin Feats in src/feats/origin/ (type: "feat", system.type.value: "feat", subtype: "origin")
 * - 14 Backgrounds in src/backgrounds/ (type: "background")
 *
 * Adheres strictly to AGENTS.md:
 * - 16-character alphanumeric _id for every document and embedded advancement
 * - _key: "!items!" + _id
 * - Modern Foundry v12/v14 system.activities and advancement schema
 * - Compendium UUID format: Compendium.suns-of-rubi-core.feats.<_id>
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
// 1. ORIGIN FEATS DEFINITIONS
// ---------------------------------------------------------------------------
const ORIGIN_FEATS = [
  {
    id: "FeatActorOrigin1",
    name: "Actor",
    file: "actor.json",
    img: "icons/equipment/head/mask-carved-wood-brown.webp",
    description: `
<p>Skilled at mimicry and dramatics, you gain the following benefits:</p>
<ul>
  <li><strong>Impersonation Advantage.</strong> You have Advantage on Deception and Performance checks when trying to pass yourself off as a different person.</li>
  <li><strong>Speech &amp; Sound Mimicry.</strong> You can mimic the speech of another person or the sounds made by other creatures and machinery. You must have heard the person speaking or heard the creature/device for at least 1 minute. A successful Insight check contested by your Deception check allows a listener to determine that the effect is faked.</li>
</ul>
`.trim(),
    activities: {
      actActorMimic001: {
        _id: "actActorMimic001",
        type: "utility",
        name: "Mimicry",
        activation: { type: "action", value: 1, condition: "" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "FeatAlertOrigin1",
    name: "Alert",
    file: "alert.json",
    img: "icons/creatures/eyes/human-single-brown.webp",
    description: `
<p>Always on the lookout for danger, you gain the following benefits:</p>
<ul>
  <li><strong>Initiative Bonus.</strong> You gain a +5 bonus to Initiative rolls.</li>
  <li><strong>Unsurprised.</strong> You cannot be surprised while you are conscious.</li>
  <li><strong>Unseen Attackers.</strong> Other creatures do not gain advantage on attack rolls against you as a result of being unseen by you.</li>
</ul>
`.trim(),
    activities: {}
  },
  {
    id: "FeatInspiringLd1",
    name: "Inspiring Leader",
    file: "inspiring-leader.json",
    img: "icons/skills/social/diplomacy-handshake-blue.webp",
    description: `
<p>You can spend 10 minutes inspiring your companions, shoring up their resolve to fight.</p>
<p>When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature gains Temporary Hit Points equal to your Character Level + your Charisma modifier after completing a Short or Long Rest. A creature can't gain temporary hit points from this feat again until it has finished a short or long rest.</p>
`.trim(),
    activities: {
      actInspiringLdr1: {
        _id: "actInspiringLdr1",
        type: "heal",
        name: "Inspiring Leader",
        activation: { type: "minute", value: 10, condition: "After Short or Long Rest" },
        duration: { units: "inst", value: "" },
        range: { units: "ft", value: "30" },
        target: {
          template: { contiguous: false, units: "ft" },
          affix: false,
          count: 6,
          type: "creature"
        },
        healing: {
          number: null,
          denomination: null,
          types: ["temphp"],
          custom: { enabled: true, formula: "@details.level + @abilities.cha.mod" },
          scaling: { mode: "whole", number: null, formula: "" }
        },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "FeatKeenMindOrig",
    name: "Keen Mind",
    file: "keen-mind.json",
    img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
    description: `
<p>You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits:</p>
<ul>
  <li><strong>Ability Score Increase.</strong> Increase your Intelligence score by 1, to a maximum of 20.</li>
  <li><strong>Direction Sense.</strong> You always know which way is north or planetary pole.</li>
  <li><strong>Time Tracking.</strong> You always know the exact local standard time and the hours remaining until the next sunrise, sunset, or orbital cycle.</li>
  <li><strong>Accurate Recall.</strong> You can accurately recall anything you have seen or heard within the past month.</li>
</ul>
`.trim(),
    activities: {},
    advancement: [
      {
        _id: "advKeenMindAsi01",
        type: "AbilityScoreImprovement",
        configuration: {
          cap: 1,
          fixed: { str: 0, dex: 0, con: 0, int: 1, wis: 0, cha: 0 },
          locked: ["str", "dex", "con", "wis", "cha"],
          points: 1
        },
        value: { type: "asi" },
        level: 0,
        title: "Ability Score Improvement",
        hint: "Increase Intelligence by 1."
      }
    ]
  },
  {
    id: "FeatLuckyOrigin1",
    name: "Lucky",
    file: "lucky.json",
    img: "icons/commodities/treasure/token-gold-gem-green.webp",
    description: `
<p>You have inexplicable luck that seems to kick in at just the right moment.</p>
<p>You have 3 Luck points per Long Rest. Whenever you make a d20 test (an attack roll, ability check, or saving throw), you can spend 1 Luck point to gain Advantage on the roll. Alternatively, when an attack roll is made against you, you can spend 1 Luck point to impose Disadvantage on that attack roll.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "lr", type: "recoverAll" }],
      max: "3"
    },
    activities: {
      actLuckyReroll01: {
        _id: "actLuckyReroll01",
        type: "utility",
        name: "Spend Luck Point",
        activation: { type: "special", value: null, condition: "When making a d20 roll or attacked" },
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
    id: "FeatObservantOr1",
    name: "Observant",
    file: "observant.json",
    img: "icons/magic/perception/eye-tendrils-web-purple.webp",
    description: `
<p>Quick to notice details in your environment, you gain the following benefits:</p>
<ul>
  <li><strong>Ability Score Increase.</strong> Increase your Intelligence or Wisdom score by 1, to a maximum of 20.</li>
  <li><strong>Passive Awareness.</strong> You gain a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.</li>
  <li><strong>Lip Reading.</strong> If you can see a creature's mouth or visual vox-modulator while it is speaking a language you understand, you can interpret what it is communicating by reading its lips.</li>
</ul>
`.trim(),
    activities: {},
    advancement: [
      {
        _id: "advObservantAsi1",
        type: "AbilityScoreImprovement",
        configuration: {
          cap: 1,
          fixed: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
          locked: ["str", "dex", "con", "cha"],
          points: 1
        },
        value: { type: "asi" },
        level: 0,
        title: "Ability Score Improvement",
        hint: "Increase Intelligence or Wisdom by 1."
      }
    ]
  },
  {
    id: "FeatSavageAttak1",
    name: "Savage Attacker",
    file: "savage-attacker.json",
    img: "icons/skills/wounds/bone-broken-knee-beam.webp",
    description: `
<p>Once per turn, when hitting with a weapon attack, roll weapon damage dice twice and use either total.</p>
`.trim(),
    uses: {
      spent: 0,
      recovery: [{ period: "turn", type: "recoverAll" }],
      max: "1"
    },
    activities: {
      actSavageAttak1: {
        _id: "actSavageAttak1",
        type: "utility",
        name: "Savage Strike",
        activation: { type: "special", value: null, condition: "Once per turn when hitting with a weapon attack" },
        duration: { units: "inst", value: "" },
        target: { template: { contiguous: false, units: "ft" }, affix: false },
        roll: { prompt: false, visible: false },
        uses: { spent: 0, recovery: [], max: "" }
      }
    }
  },
  {
    id: "FeatSkilledOrig1",
    name: "Skilled",
    file: "skilled.json",
    img: "icons/commodities/treasure/medal-ribbon-blue.webp",
    description: `
<p>You gain proficiency in any combination of three skills or tools of your choice.</p>
<p><strong>Repeatable.</strong> You can take this feat more than once.</p>
`.trim(),
    activities: {},
    prerequisites: { level: null, repeatable: true },
    advancement: [
      {
        _id: "advSkilledTrait1",
        type: "Trait",
        configuration: {
          allowReplacements: false,
          choices: [
            {
              count: 3,
              pool: ["skills:*", "tool:*"]
            }
          ],
          grants: [],
          mode: "default"
        },
        level: 0,
        title: "Skilled Proficiencies",
        hint: "Choose any combination of 3 skills or tools.",
        value: { chosen: [] }
      }
    ]
  },
  {
    id: "FeatToughOrigin1",
    name: "Tough",
    file: "tough.json",
    img: "icons/skills/wounds/injury-face-scar-red.webp",
    description: `
<p>Your hit point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your hit point maximum increases by an additional 2 hit points.</p>
`.trim(),
    activities: {}
  }
];

// ---------------------------------------------------------------------------
// 2. BACKGROUND DATA DEFINITIONS (14 Backgrounds)
// ---------------------------------------------------------------------------
const ALL_ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];

const BACKGROUNDS_DATA = [
  {
    id: "BgBountyHunter01",
    name: "Bounty Hunter",
    file: "bounty-hunter.json",
    img: "icons/skills/targeting/crosshair-pointed-red.webp",
    abilities: ["dex", "con", "wis"],
    featId: "FeatAlertOrigin1",
    featName: "Alert",
    skills: ["dec", "ins", "per", "ste"],
    featureName: "Ear to the Ground",
    featureText: `
You are in frequent contact with people involved in the lucrative and dangerous business of hunting fugitive marks. You know where to find underworld cantinas, corporate security terminals, and illicit comms relays. When searching for leads on target individuals or missing cargo, local law enforcement contacts and black-market fixers are willing to share rumors, provided you maintain professional etiquette and do not burn their covers.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: [
            "tools:demolitions",
            "tools:security-kit",
            "tools:hackers-kit",
            "tools:thieves"
          ]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I assess the exits and sightlines of every room I walk into before speaking.",
        "I speak in brief, clipped sentences. Long conversations get people shot.",
        "I keep a worn holotag of a bounty that got away; it reminds me never to get sloppy.",
        "Money talks, but professional reputation keeps you breathing in the outer colonies.",
        "I have a morbid sense of humor honed from pulling bounties out of airlocks.",
        "I never draw my blaster unless I have already committed to pulling the trigger."
      ],
      ideals: [
        "Professionalism. A contract is sacred. Once I take a retainer, I see it through. (Lawful)",
        "Freedom. Freelancing keeps me untethered from corporate control. (Chaotic)",
        "Survival. The only victory that matters is living to collect the fee. (Neutral)",
        "Justice. Some targets deserve the cell or the grave; I ensure they get it. (Good)",
        "Greed. Credits rule this solar system, and I intend to amass a mountain of them. (Evil)",
        "Code. I never hunt children, indentured laborers, or the genuinely helpless. (Any)"
      ],
      bonds: [
        "My mentor was killed by an elusive syndicate syndicate target; I will bring them in dead or alive.",
        "I owe my custom pursuit gunship to a loan shark who still holds the override codes.",
        "A former bounty saved my life when a gig went sideways; I owe them a favor no matter what.",
        "The guild syndicate that issued my license is the only family I acknowledge.",
        "Everything I earn goes toward buying my family out of an Omni-Tek labor indent.",
        "I wear the insignia of an old PMC squad that was betrayed and wiped out."
      ],
      flaws: [
        "I assume everyone has a hidden angle, price tag, or bounty on their head.",
        "I cannot resist a dangerous bet or high-risk bounty with obscene payouts.",
        "My ruthlessness makes it difficult to maintain civil relationships with gentle people.",
        "When an alarm sounds, my immediate instinct is to draw weapons and shoot first.",
        "I hold long grudges against anyone who stands between me and a contracted target.",
        "I rely heavily on combat stims to stay alert during multi-day surveillance stakes."
      ]
    }
  },
  {
    id: "BgCriminal000001",
    name: "Criminal",
    file: "criminal.json",
    img: "icons/skills/melee/weapons-crossed-daggers-yellow.webp",
    abilities: ["dex", "con", "cha"],
    featId: "FeatSkilledOrig1",
    featName: "Skilled",
    skills: ["dec", "itm", "slt", "ste"],
    featureName: "Underworld Contact",
    featureText: `
You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances and across encrypted corporate subnets; specifically, you know the dead drops, back-alley comm frequencies, and recognized fence cutouts used by illicit syndicates in major population hubs.
`.trim(),
    toolsAndLanguages: {
      toolGrants: ["tool:game:*"],
      toolChoices: [
        {
          count: 1,
          pool: [
            "tools:demolitions",
            "tools:security-kit",
            "tools:hackers-kit",
            "tools:thieves"
          ]
        }
      ],
      languageCount: 0
    },
    tables: {
      personality: [
        "I always have a plan for what to do when things go completely to hell.",
        "I pocket loose trinkets, data chips, and loose credsticks without thinking about it.",
        "I never break character while working an angle, even when staring down security droids.",
        "I am always courteous to service staff; they know who enters and exits without being noticed.",
        "Flattery and confidence are sharper tools than any vibroknife.",
        "I refuse to look corporate peacekeepers in the eye; it draws unwanted attention."
      ],
      ideals: [
        "Loyalty. Never snitch, never rat out a crew member, no matter what Omni-Pol offers. (Lawful)",
        "Freedom. Corrupt mega-corps own the planets; crime is the only true independence. (Chaotic)",
        "Greed. I take whatever I can carry, hack, or fence. (Evil)",
        "Honor. There is honor among scoundrels; I steal from the corrupt, not the desperate. (Good)",
        "Self-Reliance. In the gutters of Rubi-Ka, nobody is coming to save you but you. (Neutral)",
        "Aspiration. One massive score will buy me my own orbital estate, and I'll do whatever it takes. (Any)"
      ],
      bonds: [
        "My former crew was broken up by Omni-Pol; I will reunite what is left of us.",
        "A corrupt corporate executive holds incriminating security footage of my worst job.",
        "Someone I love is doing hard labor in the deep mines because of a job I botched.",
        "I stole a prototype datapad from Omni-Tek R&D; syndicates and corps are hunting for it.",
        "The orphan network that raised me on the colony streets still receives half my earnings.",
        "My custom slicer deck is the only thing linking me to my late sibling."
      ],
      flaws: [
        "When I see something valuable sitting unguarded, my self-control evaporates.",
        "I assume anyone smiling at me is trying to run a confidence game.",
        "I panic and look for an escape hatch the moment corporate security enters a room.",
        "An enormous bounty from an angry syndicate crime boss hangs over my head.",
        "I cannot resist mocking figures of authority when they think they have the upper hand.",
        "I have a compulsive gambling habit that drains my credit balances between missions."
      ]
    }
  },
  {
    id: "BgEntertainer001",
    name: "Entertainer",
    file: "entertainer.json",
    img: "icons/equipment/head/mask-carved-wood-gilded-white.webp",
    abilities: ["dex", "wis", "cha"],
    featId: "FeatActorOrigin1",
    featName: "Actor",
    skills: ["acr", "ins", "prf", "slt"],
    featureName: "By Popular Demand",
    featureText: `
You can always find a place to perform, whether in a high-end corporate orbital lounge, a packed cantina in a mining town, or a pirate hollow in deep space. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each evening. In addition, your performance makes you something of a local figure. When strangers recognize you in a town or orbital station where you have performed, they typically take a liking to you.
`.trim(),
    toolsAndLanguages: {
      toolGrants: ["tool:disg"],
      toolChoices: [
        {
          count: 1,
          pool: ["tool:music:*", "tools:holo-rig", "tool:art:*"]
        }
      ],
      languageCount: 0
    },
    tables: {
      personality: [
        "I love a good insult battle, even if it might escalate into a tavern brawl.",
        "Nobody stays angry at me or around me for long once I turn on the charm.",
        "I change my holographic hair and vocal presets depending on who I am trying to impress.",
        "I constantly observe crowd reactions and take notes for my next public composition.",
        "I treat every social encounter as an improvised stage performance.",
        "I cannot stand silence; I hum, tap beats, or spin stories whenever things quiet down."
      ],
      ideals: [
        "Beauty. Art and joy are the only things that keep human spirits alive under planetary domes. (Good)",
        "Tradition. Ancient acoustic ballads and heritage stories must never be forgotten in the digital age. (Lawful)",
        "Creativity. The world is a blank canvas, and convention is made to be broken. (Chaotic)",
        "Greed. Holographic fame leads directly to corporate sponsorships and private shuttles. (Evil)",
        "Honesty. The best art is visceral, raw, and completely unvarnished truth. (Neutral)",
        "Inspiration. Through song and spectacle, we can ignite planetary revolutions. (Any)"
      ],
      bonds: [
        "My instrument or holo-projector is a priceless heirloom from an extinct planetary biosphere.",
        "I would do anything to protect the members of my traveling performance troupe.",
        "An Omni-Tek media magnate ruined my career after I refused to sign an exclusive servitude contract.",
        "My songs keep alive the memories of heroes who perished resisting tyranny.",
        "A fan once saved my life from an assassin; I will never turn my back on them.",
        "I seek the lost sonic frequencies rumored to harmonize with Notum fields."
      ],
      flaws: [
        "I crave applause and center-stage attention; I sulk when ignored.",
        "I am terrible at keeping secrets if they could make for a sensational story.",
        "I cannot resist a pretty face or someone who flatters my artistic genius.",
        "I am easily scandalized and insulted by anyone with poor taste.",
        "My reckless hedonism has left me with debts across half a dozen planetary colonies.",
        "Underneath my charismatic persona, I am terrified of being forgotten."
      ]
    }
  },
  {
    id: "BgFactionAgent01",
    name: "Faction Agent",
    file: "faction-agent.json",
    img: "icons/equipment/chest/vest-leather-buckled-brown.webp",
    abilities: ["int", "wis", "cha"],
    featId: "FeatAlertOrigin1",
    featName: "Alert",
    skills: ["dec", "inv", "lor", "per"],
    featureName: "Safe Haven",
    featureText: `
As a faction operative, you have access to a network of clandestine safe houses, sympathetic cutouts, and encrypted communication dead-drops maintained by your faction (Omni-Tek Internal Affairs, the Clan Council of Truth, or the Neutral Freelancer League). You know secret passphrases, digital handshake protocols, and safe houses where you and your companions can rest, recuperate, and seek discrete medical aid or munitions without alerting local security forces.
`.trim(),
    toolsAndLanguages: {
      languageCount: 2
    },
    tables: {
      personality: [
        "I never give a straight answer when an ambiguous or cautious one will suffice.",
        "I continuously catalog the political and factional loyalties of everyone I meet.",
        "I speak multiple planetary dialects with authentic regional accents.",
        "I appear completely ordinary and forgettable—a face that blends into any crowd.",
        "I never leave confidential notes or open datapads unattended for even a second.",
        "I always sit facing the primary entryway with a clear line of sight to all exits."
      ],
      ideals: [
        "Loyalty. My faction represents humanity's only organized future, and my allegiance is unwavering. (Lawful)",
        "Liberty. Free people should not be subjugated by corporate boardrooms or oppressive dogma. (Chaotic)",
        "Pragmatism. Political rhetoric is irrelevant; only concrete results and intel matter. (Neutral)",
        "Protection. My covert operations prevent planetary wars that would slaughter millions. (Good)",
        "Power. Knowledge is leverage, leverage is influence, and influence controls solar systems. (Evil)",
        "Duty. Personal happiness must be sacrificed for the broader mission objective. (Any)"
      ],
      bonds: [
        "I would lay down my life to protect the identity and safety of my faction handler.",
        "I possess encrypted files containing proof of a corporate conspiracy that could ignite war.",
        "A rival faction operative murdered my squadmate; our duel across the colonies is unfinished.",
        "The colony where I was born was destroyed by a cover-up; I fight to expose the perpetrators.",
        "My loyalties are divided between my faction's commands and my personal comrades.",
        "I suspect my direct superior may be a double-agent for Omni-Prime."
      ],
      flaws: [
        "I am chronically paranoid and struggle to genuinely trust anyone, even long-time allies.",
        "I am accustomed to treating people as assets and pawns rather than living beings.",
        "My faction's orders override personal moral qualms, leading me to commit cold actions.",
        "I carry cyanide-capsules or data-wipe killswitches and assume capture means execution.",
        "I cannot resist investigating encrypted transmissions even when mission parameters forbid it.",
        "I look down on civilians who remain blissfully ignorant of shadow conflicts."
      ]
    }
  },
  {
    id: "BgGambler0000001",
    name: "Gambler",
    file: "gambler.json",
    img: "icons/commodities/treasure/dice-pair-black.webp",
    abilities: ["dex", "wis", "cha"],
    featId: "FeatLuckyOrigin1",
    featName: "Lucky",
    skills: ["dec", "ins", "itm", "slt"],
    featureName: "Let's Make It Interesting",
    featureText: `
You can always find high-stakes or backroom games of chance in any settlement or orbital station. Whether dice, holographic poker, or sabacc, your reputation as a gambler earns you an invitation to VIP lounges, smuggler dens, and corporate executive card tables. In addition, when negotiating terms, you can propose a wager or game of skill/chance to resolve impasses, establish mutual respect, or win critical favors from high-ranking adversaries.
`.trim(),
    toolsAndLanguages: {
      toolGrants: ["tool:game:*"],
      toolChoices: [
        {
          count: 1,
          pool: ["tool:game:*"]
        }
      ],
      languageCount: 0
    },
    tables: {
      personality: [
        "I calculate odds and risk percentages out loud in high-stress situations.",
        "I always flip a credstick or roll a lucky die when faced with a tough choice.",
        "I smile widest when the stakes are lethal and the odds are stacked against me.",
        "I never leave a table while I am ahead; momentum is a force of nature.",
        "I can read micro-tells, dilated pupils, and vocal tremors with terrifying accuracy.",
        "Win or lose, I take pleasure in the game itself."
      ],
      ideals: [
        "Luck. The cosmos is governed by random chance, and those who dare to play win the galaxy. (Chaotic)",
        "Fairness. Cheating ruins the thrill of true victory; the game must be played by the rules. (Lawful)",
        "Independence. With a steady hand and a deck of cards, I need no master or corporation. (Neutral)",
        "Generosity. When the luck rolls my way, everyone at my table eats and drinks like royalty. (Good)",
        "Exploitation. A sucker is born every second, and it is my duty to separate them from their credits. (Evil)",
        "Audacity. Safe choices lead to slow deaths; fortune truly favors the audacious. (Any)"
      ],
      bonds: [
        "I once won a customized starship in a legendary high-stakes tournament; I'll die before losing it.",
        "I owe an astronomical credit debt to an interplanetary crime syndicate that wants my head.",
        "My lucky coin was passed down through five generations of frontier spacers.",
        "A fellow card shark betrayed me on a joint heist; I aim to settle the score at the table.",
        "Everything I gamble for is dedicated to funding an independent haven for runaways.",
        "I swore an oath to clean out the corporate casino that bankrupt my parents."
      ],
      flaws: [
        "I simply cannot walk away from a wager or bet, no matter the terrible consequences.",
        "I constantly overestimate my ability to bluff my way out of mortal danger.",
        "I am addicted to the adrenaline rush of risking everything on a single roll.",
        "I have a habit of borrowing funds from companions with grand promises of returns.",
        "I become irrationally angry when someone accuses me of cheating without proof.",
        "I trust my gut and superstition over sound military logistics."
      ]
    }
  },
  {
    id: "BgInvestigator01",
    name: "Investigator",
    file: "investigator.json",
    img: "icons/tools/navigation/magnifying-glass-brass-blue.webp",
    abilities: ["con", "int", "wis"],
    featId: "FeatObservantOr1",
    featName: "Observant",
    skills: ["ins", "inv", "prc", "sur"],
    featureName: "Forensic Eye",
    featureText: `
You have an eye for subtle inconsistencies, biological traces, and digital evidence. When examining a crime scene, industrial sabotage site, or abandoned research outpost, you can deduce the general sequence of events that transpired, the approximate number of individuals involved, and whether security logs or environmental controls were tampered with. In addition, local forensic examiners, autopsy technicians, and data-recovery specialists recognize your methodology and are willing to grant you access to archived incident reports.
`.trim(),
    toolsAndLanguages: {
      languageCount: 2
    },
    tables: {
      personality: [
        "I ask probing questions and dissect every conversational discrepancy.",
        "I constantly dictate mental case notes, often muttering observations under my breath.",
        "No detail is too minor to overlook; a single scorched wire tells an entire story.",
        "I remain clinically calm and detached even when examining horrific crime scenes.",
        "I carry a pocket scanner everywhere and run spectro-analysis on unfamiliar substances.",
        "I have little patience for bureaucratic protocol when a trail is growing cold."
      ],
      ideals: [
        "Truth. Facts do not care about corporate bottom lines or faction propaganda. (Neutral)",
        "Justice. The innocent must be vindicated, and perpetrators must face judgment. (Good)",
        "Order. A lawful society cannot endure if crime and subversion go unpunished. (Lawful)",
        "Inquiry. The pursuit of mysteries and unexplored phenomena is the highest human calling. (Chaotic)",
        "Leverage. Uncovering ugly secrets gives you the power to dictate terms to kings. (Evil)",
        "Tenacity. Once a case is opened, I will chase the truth to the rim of the galaxy. (Any)"
      ],
      bonds: [
        "A cold case involving a murdered loved one has haunted me for over a decade.",
        "I discovered proof of an executive cover-up that cost me my official badge and pension.",
        "My old partner was framed for corruption; I will find the real culprits and clear their name.",
        "My archive of solved cases is my proudest achievement and greatest legacy.",
        "A dangerous serial saboteur leaves cryptic clues specifically meant for me to decipher.",
        "I protect an informant whose testimony could dismantle a planetary criminal empire."
      ],
      flaws: [
        "I become obsessed with solving puzzles, neglecting sleep, nutrition, and personal safety.",
        "My blunt deductions and lack of tact frequently offend important social contacts.",
        "I am cynical to a fault, assuming everyone is lying until forensic evidence proves otherwise.",
        "I have broken into private data vaults and secured facilities in pursuit of clues.",
        "I struggle to let go of an investigation even when authoritative commanders order a halt.",
        "I use stimulants and tobacco to keep my mind sharp during sleepless all-night stakeouts."
      ]
    }
  },
  {
    id: "BgIroncladClan01",
    name: "Ironclad Clansman",
    file: "ironclad-clansman.json",
    img: "icons/equipment/chest/breastplate-metal-banded-grey.webp",
    abilities: ["str", "con", "dex"],
    featId: "FeatToughOrigin1",
    featName: "Tough",
    skills: ["ath", "itm", "plt", "sur"],
    featureName: "Clan Camaraderie",
    featureText: `
Among the Clan settlements, mining outposts, and rebel redoubts across the canyons of Rubi-Ka, you are recognized as a brother-in-arms. You can find free shelter, communal rations, and mechanical maintenance for your gear at any Clan settlement or nomad camp. Clan fighters, blacksmiths, and miners will share news of Omni-Tek patrol schedules, hazardous Notum sinkholes, and safe traversal routes through contested frontier zones.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: ["tool:smith", "tool:tinkers", "tools:armorer-tools"]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I judge people by the calluses on their hands and whether they pull their own weight.",
        "I never complain about freezing frontier weather, dry rations, or exhaust fumes.",
        "A firm handshake and shared slug of harsh rotgut seal an agreement better than any datapad contract.",
        "I sing boisterous clan work anthems while hammering armor or servicing heavy machinery.",
        "I am fiercely loyal to anyone who stands shoulder-to-shoulder with me under enemy fire.",
        "I speak bluntly, without the deceptive polished manners of corporate suits."
      ],
      ideals: [
        "Solidarity. The clan survives only when every member protects the collective. (Lawful)",
        "Freedom. We were born free on this soil; no mega-corporation owns our lives or labor. (Chaotic)",
        "Strength. In a brutal frontier world, weakness is an invitation to subjugation. (Neutral)",
        "Brotherhood. An injury to one clansman is an injury to the entire family. (Good)",
        "Vengeance. Omni-Tek has made us bleed for generations; every debt will be repaid in blood. (Evil)",
        "Honor. Stand tall, keep your word, and die with your boots on. (Any)"
      ],
      bonds: [
        "My heavy reinforced chestplate was forged from the salvaged plating of my father's mining mech.",
        "I would level an entire corporate forward base to free an imprisoned clansman.",
        "The elders of my clan entrusted me with our ancient muster roll and sacred banner.",
        "I fight to secure a fertile valley where the next generation of clansmen can live in peace.",
        "A comrade took a sniper round intended for me; their surviving children are my responsibility.",
        "My home settlement was bombed by corporate gunships; I will make them answer for it."
      ],
      flaws: [
        "I harbor an instant, boiling hatred for anyone wearing an Omni-Tek uniform or executive pin.",
        "I settle disputes with my fists before considering peaceful compromise.",
        "My stubborn pride makes it nearly impossible for me to admit when my plan has failed.",
        "I am distrustful of advanced ungrounded tech and highbrow corporate academia.",
        "I drink heavily to drown out the screams of lost skirmishes.",
        "I refuse to surrender or retreat, even when tactically overwhelmed."
      ]
    }
  },
  {
    id: "BgMercenary00001",
    name: "Mercenary",
    file: "mercenary.json",
    img: "icons/skills/melee/blade-halberd-steel-blue.webp",
    abilities: ["str", "con", "cha"],
    featId: "FeatSavageAttak1",
    featName: "Savage Attacker",
    skills: ["ath", "itm", "per", "plt"],
    featureName: "Mercenary Network",
    featureText: `
You are a veteran of the private military contractor market. You know how to identify fellow contractors, PMC liaisons, and weapon quartermasters in any spaceport or border garrison. You can secure access to mercenary guildhalls, shooting ranges, and black-market repair depots where contractors trade military surplus, compare combat reports, and recruit firepower. Fellow mercenaries treat you as a comrade of the trade and will rarely attack you unless bound by an active contract.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: ["tool:game:*", "tool:vehicle:land", "tool:vehicle:air"]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I keep my weapons immaculately cleaned, oiled, and calibrated at all times.",
        "I evaluate tactical cover and firing angles in every conference room or barroom.",
        "I tell bawdy, dark-humored war stories from forgotten border skirmishes.",
        "I never fight without a signed voucher or clear confirmation of combat pay.",
        "I treat military discipline and unit coordination as sacred necessities.",
        "I can sleep peacefully through blaster fire, artillery detonations, and sirens."
      ],
      ideals: [
        "Contract. A signed mercenary agreement is my sacred bond; I never break contract. (Lawful)",
        "Independence. I choose who I fight for and what causes I bleed for. (Chaotic)",
        "Professionalism. Emotions have no place on the battlefield; efficiency is paramount. (Neutral)",
        "Camaraderie. Gold is sweet, but coming home with all squadmates alive is the real victory. (Good)",
        "Ruthlessness. Bloodshed is simply the cost of doing business in this galaxy. (Evil)",
        "Mastery. War is an art form, and I strive to be its supreme master. (Any)"
      ],
      bonds: [
        "The standard and patch of my former mercenary company is pinned inside my armor.",
        "I am tracking a traitorous contractor who abandoned our unit during an orbital drop.",
        "My combat pay supports a field hospital for wounded veterans and disabled soldiers.",
        "I saved a high-ranking corporate commander who still owes me an unrestricted clearance favor.",
        "My customized assault rifle has been by my side across three planetary campaigns.",
        "I fight to earn enough capital to retire to a paradise world far from the conflict zones."
      ],
      flaws: [
        "I value my combat fee above humanitarian considerations.",
        "I have intense combat flashbacks triggered by sudden explosions or siren claxons.",
        "I find civilian life dull, meaningless, and hopelessly bureaucratic.",
        "I have a quick temper when civilians disrespect the sacrifices of combat troops.",
        "I am overly confident in my physical prowess and weapon proficiency.",
        "I am reluctant to engage in any fight where profit or loot is not explicitly assured."
      ]
    }
  },
  {
    id: "BgNobleAristoc01",
    name: "Noble Aristocrat",
    file: "noble-aristocrat.json",
    img: "icons/equipment/head/crown-gilded-ruby.webp",
    abilities: ["int", "wis", "cha"],
    featId: "FeatInspiringLd1",
    featName: "Inspiring Leader",
    skills: ["dec", "ins", "lor", "per"],
    featureName: "Position of Privilege",
    featureText: `
Thanks to your noble birth or high-ranking corporate executive lineage, people are inclined to treat you with deference and high social standing. You are welcome in high society, and people assume you have the right to be wherever you are. Common citizens and station personnel make every effort to accommodate you and avoid your displeasure, and other people of high birth or corporate director rank treat you as a member of the same social sphere. You can secure audiences with local planetary governors, planetary magistrates, and corporate board executives.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: ["tool:game:*", "tool:vehicle:air", "tool:vehicle:space"]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "My eloquent manners and refined diction command attention in any assembly.",
        "I treat everyone with regal politeness, regardless of their social stratum.",
        "I have an exquisite taste in fine vintage wines, synthesized teas, and orchestral suites.",
        "I rarely show visible shock or fear; composure under pressure is the mark of good breeding.",
        "I expect the finest accommodations and am quietly astonished when they are unavailable.",
        "I maintain an encyclopedic knowledge of noble family heraldry and corporate board politics."
      ],
      ideals: [
        "Noblesse Oblige. It is the sacred duty of the privileged to protect and uplift the less fortunate. (Good)",
        "Hierarchy. Order is preserved only when everyone recognizes and honors their rightful station. (Lawful)",
        "Autonomy. True nobility answers to no corporate board or petty planetary decree. (Chaotic)",
        "Power. Status is a weapon; I intend to ascend to the highest apex of interplanetary rule. (Evil)",
        "Prestige. Family honor and dynasty reputation outweigh any temporary material setback. (Neutral)",
        "Excellence. Whatever role I undertake, I must perform it with unmatched distinction. (Any)"
      ],
      bonds: [
        "I carry the signet ring and encrypted cipher key of my ancient aristocratic dynasty.",
        "My family lost its corporate charter; I will restore our title and reclaimed estates.",
        "I am in exile from my home system until I prove my worth to my demanding parents.",
        "I hold secret correspondence proving our rivals orchestrated an orbital shuttle assassination.",
        "My personal bodyguard saved my life during a coup and remains my truest confidant.",
        "I am devoted to an idealistic vision of turning our family syndicate into a benign enterprise."
      ],
      flaws: [
        "I secretly believe that most common laborers are beneath my intellectual notice.",
        "I am accustomed to having servants handle mundane chores and logistics.",
        "An insult to my family's heritage or lineage provokes a haughty and dangerous fury.",
        "I spend money extravagantly even when our supplies and credit lines are near empty.",
        "I struggle to grasp that my family's name carries no legal authority in lawless frontier rims.",
        "I guard a scandalous family secret that could disgrace our entire lineage if revealed."
      ]
    }
  },
  {
    id: "BgNomadWander001",
    name: "Nomad Wanderer",
    file: "nomad-wanderer.json",
    img: "icons/equipment/feet/boots-leather-fur-brown.webp",
    abilities: ["str", "con", "wis"],
    featId: "FeatToughOrigin1",
    featName: "Tough",
    skills: ["ani", "ath", "med", "sur"],
    featureName: "Planetary Pathfinder",
    featureText: `
You have an innate memory for planetary topography, seasonal weather patterns, migratory fauna, and water tables. You can always recall the general layout of planetary terrain, settlements, mountain passes, and hazardous radiation zones within a 500-kilometer radius. In addition, you can forage fresh water and organic nourishment for yourself and up to five other people each day, provided the planetary ecosystem is not completely barren or toxic vacuum.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: ["tools:medkit", "tool:music:*", "tools:bio-med-kit", "tool:herbalism"]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I feel claustrophobic and suffocated inside artificial corporate domes and starship corridors.",
        "I communicate with beasts and alien fauna with patient whistles, clicks, and soft clicks.",
        "I look to cloud formations, wind shifts, and dust spirals to forecast impending peril.",
        "I carry a dried pouch of soil from each planet I have traversed across the cosmos.",
        "I value possessions only by their utility and weight on long planetary treks.",
        "I am quiet and reflective, listening to the hum of the wild landscape before speaking."
      ],
      ideals: [
        "Harmony. Nature and organic life must be respected; industrial greed poisons worlds. (Good)",
        "Freedom. Fences, dome walls, and corporate borders are artificial illusions. (Chaotic)",
        "Tradition. The ancestral survival methods passed down through generations will never fail. (Lawful)",
        "Survival. The harsh wilderness weeds out the soft; only the adaptable endure. (Neutral)",
        "Dominion. The untamed frontier belongs to those ruthless enough to master it. (Evil)",
        "Discovery. The horizon is an endless call that must be answered with wandering steps. (Any)"
      ],
      bonds: [
        "My caravan family roams the barren plains; I journey to ensure their seasonal survival.",
        "A sacred natural canyon holding pristine Notum crystals is threatened by corporate strip-mines.",
        "My loyal riding beast has journeyed with me through dust storms, cold fronts, and firefights.",
        "I carry a tribal talisman blessed by our wanderer shamans to ward off hostile fauna.",
        "I was raised by an eccentric hermit after corporate raiders destroyed our frontier train.",
        "I seek a mythical planetary oasis whispered to heal any plague or nanite degeneration."
      ],
      flaws: [
        "I am deeply suspicious of urban high technology, artificial synthetic food, and holo-vids.",
        "I struggle to comprehend civilized customs regarding property ownership and deeds.",
        "I am fiercely territorial when strangers camp uninvited near my party's perimeter.",
        "I place more faith in the instincts of alien beasts than in the promises of civilized people.",
        "I refuse to abandon a wounded animal or companion, even when military sense dictates retreat.",
        "I become irritable, restless, and quick-tempered when confined indoors for too long."
      ]
    }
  },
  {
    id: "BgScientist00001",
    name: "Scientist",
    file: "scientist.json",
    img: "icons/equipment/neck/pendant-faceted-crystal-blue.webp",
    abilities: ["con", "int", "wis"],
    featId: "FeatKeenMindOrig",
    featName: "Keen Mind",
    skills: ["lor", "med", "nat", "tec"],
    featureName: "Scientific Methodology",
    featureText: `
You are trained in empirical research, peer-reviewed academic rigor, and lab protocol. When you encounter unfamiliar nanotechnological anomalies, alien biotechnology, or precursor artifacts, you know how to establish safe sampling procedures, run diagnostic spectrographs, and isolate volatile variables. You can secure access to university laboratories, corporate research archives, and medical databases by citing academic credentials, submitting research papers, or offering peer consultations.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: [
            "tools:medkit",
            "tools:chemists-supplies",
            "tools:hackers-kit",
            "tool:alch",
            "tools:bio-med-kit"
          ]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I view every unusual encounter, monster, or anomaly as an exciting research opportunity.",
        "I cite obscure scientific papers, particle physics theories, and chemical formulas in casual conversation.",
        "I take obsessive notes and capture spectral sensor logs of everything in my surroundings.",
        "I get lost in thought contemplating complex equations, often losing track of current danger.",
        "I demand empirical evidence before accepting anyone's outrageous claims or rumors.",
        "I explain mundane technical occurrences using excessively convoluted terminology."
      ],
      ideals: [
        "Progress. Scientific knowledge and technological advancement will save humanity. (Good)",
        "Truth. The universe operates according to immutable laws waiting to be discovered. (Neutral)",
        "Logic. Emotion and superstition lead to disaster; rational thought must guide our steps. (Lawful)",
        "Innovation. Established dogma and orthodox theories must be shattered to make breakthroughs. (Chaotic)",
        "Power. True power does not stem from blaster cannons, but from understanding how reality functions. (Evil)",
        "Curiosity. The greatest sin is refusing to ask 'how' and 'why'. (Any)"
      ],
      bonds: [
        "My life's work is a comprehensive thesis on the quantum metaphysical behavior of Notum.",
        "A breakthrough experiment I led caused a laboratory catastrophe; I must fix the collateral damage.",
        "My mentor was assassinated by Omni-Tek executives for refusing to weaponize a medical discovery.",
        "My customized sensory scanner contains irreplaceable field research from three star systems.",
        "I seek a cure for a rare genetic mutation that affects my sibling or child.",
        "I will prove my revolutionary theories to the skeptical academic board that ridiculed me."
      ],
      flaws: [
        "I am so fascinated by hazardous alien phenomena that I often disregard basic safety protocols.",
        "I assume intellectual superiority over anyone who lacks rigorous scientific training.",
        "I am prone to ethical blind spots when pursuing what I believe to be a monumental breakthrough.",
        "I struggle to communicate empathy and emotional warmth, treating emotions like chemical glitches.",
        "I panic when confronted with situations that cannot be explained or solved by rational logic.",
        "I would risk my own life and the safety of my party to preserve a unique research specimen."
      ]
    }
  },
  {
    id: "BgSmuggler000001",
    name: "Smuggler",
    file: "smuggler.json",
    img: "icons/equipment/cargo/crate-reinforced-metal-brown.webp",
    abilities: ["dex", "wis", "cha"],
    featId: "FeatLuckyOrigin1",
    featName: "Lucky",
    skills: ["dec", "plt", "slt", "ste"],
    featureName: "Careful Assessment",
    featureText: `
You have an intimate understanding of cargo manifests, customs checkpoints, sensor baffles, and planetary blockades. You can easily spot hidden compartments, false bulkheads, and illegal contraband caches in vehicles, starships, and cargo bays. When arriving at a spaceport or frontier depot, you quickly identify corrupt customs inspectors, unmonitored maintenance tunnels, and blind spots in planetary defense sensors where illicit goods can be brought planetside undetected.
`.trim(),
    toolsAndLanguages: {
      toolGrants: ["tool:game:*"],
      toolChoices: [
        {
          count: 1,
          pool: [
            "tools:security-kit",
            "tools:hackers-kit",
            "tools:tinkers",
            "tools:thieves"
          ]
        }
      ],
      languageCount: 0
    },
    tables: {
      personality: [
        "I never sit with my back to a door, and my hand is always near my concealed holster.",
        "I treat ship engines and grav-drives with the affectionate care most people reserve for family.",
        "I have a quick-witted sarcastic quip ready for every customs inspector and bounty hunter.",
        "I know the retail value and street markup of every piece of cargo in a warehouse.",
        "I speak in spacer slang, encrypted freight jargon, and double entendres.",
        "I stay calm, grin, and whistle nonchalantly when cargo scanners ping an alarm."
      ],
      ideals: [
        "Freedom. Interplanetary space should be free; tariffs, blockades, and borders are tyranny. (Chaotic)",
        "Honor. Once I accept a cargo delivery contract, that cargo arrives or I die trying. (Lawful)",
        "Profit. Credits make the sub-light engines burn; no risk, no payday. (Neutral)",
        "Compassion. I use my hidden storage compartments to smuggle refugees and freed laborers to safety. (Good)",
        "Selfishness. My skin and my ship come before anyone else's cargo or moral crusade. (Evil)",
        "Adventure. Sticking to safe, approved hyperspace lanes is a death sentence for the soul. (Any)"
      ],
      bonds: [
        "My freighter is old, battered, and constantly leaking coolant, but she's my home and pride.",
        "I dumped an illicit cargo shipment during a corporate patrol raid; the cartel still wants their credits.",
        "A fellow smuggler took the heat for my botched orbital run and is serving 20 years in penal labor.",
        "I am looking for the lost wreckage of a legendary smuggler ship rumored to hold precursor loot.",
        "I owe my life to a port mechanic who modified my sub-light engines to outrun gunboats.",
        "Everything I smuggle goes toward buying an independent jump-ship for my home colony."
      ],
      flaws: [
        "I have a terrible weakness for gambling with the funds designated for ship maintenance and fuel.",
        "I can never resist a dangerous shortcut through uncharted asteroid fields or radiation belts.",
        "I am constantly looking over my shoulder, expecting customs hounds or bounty hunters.",
        "I am reluctant to fight unless cornered; my first instinct is always to run and burn thrust.",
        "I make promises I know I can't keep just to get cargo loaded into my hold.",
        "My pride in my piloting skills leads me into absurdly dangerous maneuvers."
      ]
    }
  },
  {
    id: "BgTrooper0000001",
    name: "Trooper",
    file: "trooper.json",
    img: "icons/equipment/shield/heater-steel-cross-red.webp",
    abilities: ["str", "dex", "con"],
    featId: "FeatSavageAttak1",
    featName: "Savage Attacker",
    skills: ["ath", "itm", "per", "plt"],
    featureName: "Military Standing",
    featureText: `
You have served in a recognized regular army, corporate defense regiment (such as Omni-Pol or the Armed Forces of Omni-Tek), or organized planetary militia. Soldiers, veterans, and military quartermasters recognize your rank, tactical bearing, and service credentials. You can gain access to friendly military encampments, vehicle depots, and armories where you can requisition standard field rations, simple medical supplies, and temporary billeting. In peacetime or civilian areas, veterans of your regiment will offer assistance and shelter out of respect for shared service.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: ["tool:game:*", "tool:vehicle:land"]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I stand at parade rest when receiving orders and maintain perfect posture.",
        "I check and double-check my gear, ammo counts, and power cells every evening.",
        "I address commanders with crisp formal titles and expect soldiers to show proper respect.",
        "I follow orders to the letter until tactical conditions make initiative necessary.",
        "I am fiercely protective of the vulnerable, viewing my strength as a shield for civilians.",
        "I find comfort in military hierarchy, routine drill, and standardized standard-issue rations."
      ],
      ideals: [
        "Duty. Discipline and adherence to command keep societies standing against chaos. (Lawful)",
        "Honor. A soldier is defined by how they conduct themselves when victory seems impossible. (Good)",
        "Survival. Battlefield heroics are foolish; the objective is to eliminate the enemy and survive. (Neutral)",
        "Freedom. I fought to defend our liberty from hostile oppressors, and I will do so again. (Chaotic)",
        "Dominance. Force of arms is the only absolute law recognized across the stars. (Evil)",
        "Sacrifice. The safety of the squad and homeland is worth any personal sacrifice. (Any)"
      ],
      bonds: [
        "My combat dogtags carry the names of every fallen comrade from my original fireteam.",
        "I obey the orders of my former commanding officer, believing in their strategic vision.",
        "My battle-worn sidearm was presented to me for valor during an orbital drop assault.",
        "I survived a brutal siege; I will never let another settlement fall while I draw breath.",
        "I fight to protect the frontier civilian settlement where my spouse and family reside.",
        "I am determined to uncover the truth behind a suicidal command that slaughtered my regiment."
      ],
      flaws: [
        "I struggle to function without clear orders or established chain of command hierarchy.",
        "I harbor deep prejudice against opposing faction troops and insurgent militia forces.",
        "I have recurring nightmares of shell fire, bombardment, and fallen comrades.",
        "I am harsh and demanding with civilian companions who don't understand combat urgency.",
        "I find it difficult to show mercy to an enemy who has raised weapons against my squad.",
        "My pride in my military service prevents me from admitting vulnerability or fear."
      ]
    }
  },
  {
    id: "BgVoidSpacer0001",
    name: "Void Spacer",
    file: "void-spacer.json",
    img: "icons/equipment/head/helmet-horned-visor-steel.webp",
    abilities: ["dex", "con", "int"],
    featId: "FeatToughOrigin1",
    featName: "Tough",
    skills: ["ins", "inv", "plt", "tec"],
    featureName: "Deep-Space Acclimation",
    featureText: `
Having spent countless months in the cold corridors of starships, deep-space mining platforms, and low-gravity orbital stations, you are intimately familiar with vacuum hazards. You suffer no penalties to balance or coordination in zero-gravity or high-G environments. You can easily detect micro-meteorite hull stress, failing atmospheric scrubbers, and subtle vacuum pressure drops before station sensors register a breach. In addition, void-dock workers and station engineers welcome you as a fellow void-dog, sharing docking berths and scrap alloys at fair rates.
`.trim(),
    toolsAndLanguages: {
      toolChoices: [
        {
          count: 1,
          pool: [
            "tools:tinkers",
            "tools:medkit",
            "tool:game:*",
            "tools:bio-med-kit",
            "tools:mechanics-kit"
          ]
        }
      ],
      languageCount: 1
    },
    tables: {
      personality: [
        "I instinctively check the seal on my pressure collar and air gauge several times an hour.",
        "I move with the fluid, cautious grace of someone used to zero-gravity maneuvering.",
        "Planetary gravity fields feel oppressive, heavy, and unnatural to my spine and legs.",
        "I prefer the constant hum of life-support scrubbers to the unsettling silence of nature.",
        "I have a practical repair fix for every malfunctioning hydraulic line or oxygen valve.",
        "I treat every breath of pressurized air as a precious commodity that shouldn't be wasted on chatter."
      ],
      ideals: [
        "Self-Reliance. In the void of space, a single mistake will vent you into vacuum; rely on your own competence. (Neutral)",
        "Community. A ship's crew is a single organism; if the hull breaches, everyone drowns in the void together. (Good)",
        "Order. Safety protocols, airlock checks, and maintenance schedules must be followed religiously. (Lawful)",
        "Curiosity. The uncharted deep darkness between star systems holds mysteries we must unlock. (Chaotic)",
        "Ruthlessness. Life support reserves are finite; dead weight must be jettisoned when survival is on the line. (Evil)",
        "Endurance. Space is cold and indifferent, but the human will to explore is indestructible. (Any)"
      ],
      bonds: [
        "I survived a catastrophic decompression event that destroyed my previous hauler; I owe my life to its captain.",
        "My customized EVA suit has kept me alive through solar flares and vacuum leaks; it is my armor and life.",
        "I have a deep-space charting datapad detailing unknown navigational corridors through the rim.",
        "My family has worked the orbital orbital refineries for four generations without ever walking on a planet.",
        "I am saving credits to buy an independent mining scout and strike rich in the deep asteroid belts.",
        "I carry a piece of hull debris from a legendary derelict vessel I explored in deep space."
      ],
      flaws: [
        "I feel intense agoraphobia under open planetary skies with no ceilings or bulkheads.",
        "I am overly protective of fresh water, oxygen reserves, and battery power, hoarding resources obsessively.",
        "I judge planet-dwellers as soft, wasteful, and ignorant of cosmic reality.",
        "I am slow to trust ground-pounders who don't know how to operate an emergency vacuum patch kit.",
        "My emotional responses are flat and muted from years of isolation in long-haul shipping.",
        "I get irritable and anxious when sub-light engines shut down and artificial gravity fluctuates."
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// 3. GENERATION EXECUTION
// ---------------------------------------------------------------------------
console.log("=== Building Suns of Rubi: Origin Feats ===");
ensureDir("src/feats/origin");

for (const feat of ORIGIN_FEATS) {
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
        value: "feat",
        subtype: "origin"
      },
      prerequisites: feat.prerequisites ?? {
        level: null
      },
      properties: [],
      requirements: "",
      activities: feat.activities ?? {},
      identifier: feat.file.replace(".json", "")
    }
  };

  if (feat.advancement) {
    doc.system.advancement = feat.advancement;
  }

  write(`src/feats/origin/${feat.file}`, doc);
}

console.log("\n=== Building Suns of Rubi: Backgrounds ===");
ensureDir("src/backgrounds");

for (const bg of BACKGROUNDS_DATA) {
  const lockedAbilities = ALL_ABILITIES.filter(a => !bg.abilities.includes(a));

  // Build HTML Description
  const formatTable = (title, items) => `
<h4>${title}</h4>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">d6</th>
      <th>Trait</th>
    </tr>
  </thead>
  <tbody>
    ${items.map((item, idx) => `<tr><td><strong>${idx + 1}</strong></td><td>${item}</td></tr>`).join("\n    ")}
  </tbody>
</table>
`.trim();

  const descriptionHtml = `
<p><strong>Ability Scores:</strong> ${bg.abilities.map(a => a.toUpperCase()).join(", ")}</p>
<p><strong>Feat:</strong> @UUID[Compendium.suns-of-rubi-core.feats.${bg.featId}]{${bg.featName}}</p>
<p><strong>Skill Proficiencies:</strong> Choose 2 from ${bg.skills.map(s => s.toUpperCase()).join(", ")}</p>
<h3>Feature: ${bg.featureName}</h3>
<p>${bg.featureText}</p>
<hr/>
<h3>Roleplay Characteristics</h3>
${formatTable("Personality Traits", bg.tables.personality)}
${formatTable("Ideals", bg.tables.ideals)}
${formatTable("Bonds", bg.tables.bonds)}
${formatTable("Flaws", bg.tables.flaws)}
`.trim();

  // Advancements
  // 1. AbilityScoreImprovement
  const asiAdvancement = {
    _id: `${bg.id.slice(0, 12)}Asi1`,
    type: "AbilityScoreImprovement",
    configuration: {
      cap: 2,
      fixed: {
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0
      },
      locked: lockedAbilities,
      points: 3
    },
    value: {
      type: "asi"
    },
    level: 0,
    title: "Ability Score Improvement",
    hint: `Your background allows you to increase your ${bg.abilities.map(a => a.toUpperCase()).join(", ")} scores: increase one of them by 2 and a different one by 1, or increase all three by 1. None of these increases can raise a score above 20.`
  };

  // 2. Trait (Skill Proficiencies)
  const skillAdvancement = {
    _id: `${bg.id.slice(0, 12)}Skl1`,
    type: "Trait",
    configuration: {
      mode: "default",
      allowReplacements: false,
      grants: [],
      choices: [
        {
          count: 2,
          pool: bg.skills.map(s => `skills:${s}`)
        }
      ]
    },
    value: {
      chosen: []
    },
    level: 0,
    title: "Skill Proficiencies",
    hint: `Choose 2 skills from: ${bg.skills.join(", ")}.`
  };

  // 3. Trait (Tool Proficiencies & Languages)
  const toolChoices = bg.toolsAndLanguages.toolChoices || [];
  const toolGrants = bg.toolsAndLanguages.toolGrants || [];
  const languageChoices = bg.toolsAndLanguages.languageCount
    ? [
        {
          count: bg.toolsAndLanguages.languageCount,
          pool: ["languages:standard:*"]
        }
      ]
    : [];

  const traitAdvancements = [];

  if (toolGrants.length > 0 || toolChoices.length > 0) {
    traitAdvancements.push({
      _id: `${bg.id.slice(0, 12)}Tol1`,
      type: "Trait",
      configuration: {
        mode: "default",
        allowReplacements: false,
        grants: toolGrants,
        choices: toolChoices
      },
      value: {
        chosen: []
      },
      level: 0,
      title: "Tool Proficiencies",
      hint: "Your background grants you tool proficiency options."
    });
  }

  if (languageChoices.length > 0) {
    traitAdvancements.push({
      _id: `${bg.id.slice(0, 12)}Lng1`,
      type: "Trait",
      configuration: {
        mode: "default",
        allowReplacements: false,
        grants: [],
        choices: languageChoices
      },
      value: {
        chosen: []
      },
      level: 0,
      title: "Languages",
      hint: `Choose ${bg.toolsAndLanguages.languageCount} language(s).`
    });
  }

  // 4. ItemGrant (Origin Feat)
  const featAdvancement = {
    _id: `${bg.id.slice(0, 12)}Fgt1`,
    type: "ItemGrant",
    configuration: {
      items: [
        {
          optional: false,
          uuid: `Compendium.suns-of-rubi-core.feats.${bg.featId}`
        }
      ],
      optional: false,
      spell: null
    },
    value: {},
    level: 0,
    title: "Origin Feat",
    hint: `Your background grants you the ${bg.featName} origin feat.`
  };

  const advancements = [
    asiAdvancement,
    skillAdvancement,
    ...traitAdvancements,
    featAdvancement
  ];

  const doc = {
    _id: bg.id,
    name: bg.name,
    type: "background",
    img: bg.img,
    system: {
      description: {
        value: descriptionHtml,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      identifier: bg.file.replace(".json", ""),
      advancement: advancements
    }
  };

  write(`src/backgrounds/${bg.file}`, doc);
}

console.log("\n✔ Backgrounds and Origin Feats build complete.");
