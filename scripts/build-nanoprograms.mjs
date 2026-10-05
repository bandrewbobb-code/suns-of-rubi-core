import fs from "fs";
import path from "path";
import crypto from "crypto";

const DIR_T0 = path.join("src", "nanoprograms", "tier-0");
const DIR_T1 = path.join("src", "nanoprograms", "tier-1");
const DIR_JRNL = path.join("src", "journals");

[DIR_T0, DIR_T1, DIR_JRNL].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function generateId(prefix, name) {
  return crypto.createHash("md5").update(prefix + name).digest("hex").slice(0, 16);
}

// =========================================================================
// 1. EXACT 34 TIER 0 (AT-WILL) NANOPROGRAMS
// =========================================================================
const tier0 = [
  {
    name: "Acid Splash",
    os: ["Nano-Technician"],
    action: "action", range: 60, duration: "inst", school: "con",
    desc: "You launch a canister of nanite solvent at one creature within range, or at two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.<br><br><strong>Overclock:</strong> 2d6 at 5th, 3d6 at 11th, 4d6 at 17th level.",
    activity: { type: "save", save: { ability: ["dex"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d6" }, types: ["acid"] }] } }
  },
  {
    name: "Aimbot",
    os: ["Adventurer", "Agent", "Fixer", "Soldier", "Trader"],
    action: "action", range: "self", duration: "inst", school: "div",
    desc: "Guided by predictive telemetry, make one attack with a weapon you are holding. The attack roll and damage roll use your nanocasting ability modifier instead of Strength or Dexterity. The attack deals radiant damage or the weapon's normal damage type (your choice).<br><br><strong>Overclock:</strong> Extra 1d6 radiant at 5th, 2d6 at 11th, 3d6 at 17th level.",
    activity: { type: "attack", attack: { type: "ranged", classification: "weapon" } }
  },
  {
    name: "Befriend",
    os: ["Agent", "Bureaucrat", "Fixer", "Trader"],
    action: "action", range: 10, duration: "1 minute", concentration: true, school: "enc",
    desc: "Choose one creature within range that is not hostile toward you. The target must make a Wisdom saving throw. On a failed save, it has Disadvantage on Wisdom (Insight) checks against you, and you gain Advantage on all Charisma checks directed at it for the duration.<br><br><strong>Overclock:</strong> Range 30 ft at 5th; target up to 2 creatures at 11th; up to 3 creatures at 17th.",
    activity: { type: "save", save: { ability: ["wis"], dc: { calculation: "spellcasting" } } }
  },
  {
    name: "Culling",
    os: ["Doctor", "Shade"],
    action: "action", range: 60, duration: "inst", school: "nec",
    desc: "You point at one creature you can see within range. The target must succeed on a Wisdom saving throw or take 1d8 necrotic damage. If the target is missing any of its Hit Points, it instead takes 1d12 necrotic damage.<br><br><strong>Overclock:</strong> 2d8/2d12 at 5th, 3d8/3d12 at 11th, 4d8/4d12 at 17th level.",
    activity: { type: "save", save: { ability: ["wis"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["necrotic"] }] } }
  },
  {
    name: "Deflection",
    os: ["Adventurer", "Enforcer", "Keeper", "Soldier"],
    action: "action", range: "self", duration: "1 minute", concentration: true, school: "abj",
    desc: "Whenever a creature hits you with an attack roll before the program ends, you roll a 1d4 and subtract the number rolled from the attack roll, potentially turning a hit into a miss.<br><br><strong>Overclock:</strong> Can cast as a Reaction at 5th; die subtracted increases to 1d6 at 11th; 1d8 at 17th.",
    activity: { type: "utility", roll: { formula: "1d4", name: "Deflection Roll" } }
  },
  {
    name: "Encrypted Message",
    os: ["Agent", "Bureaucrat", "Fixer", "Trader"],
    action: "action", range: 120, duration: "1 round", school: "trs",
    desc: "You transmit a tight-beam, quantum-encrypted audio packet directly to a target's comms receiver within range. The target hears the message in its receiver and can reply in a whisper that only you hear.<br><br><strong>Overclock:</strong> Range 300 ft at 5th, 1,000 ft at 11th, 1 mile at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Frost Slivers",
    os: ["Meta-Physicist"],
    action: "action", range: 60, duration: "inst", school: "evo",
    desc: "Make a ranged program attack against a target within range. On a hit, the target takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th level.",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["cold"] }] } }
  },
  {
    name: "Grapple Beam",
    os: ["Adventurer", "Enforcer", "Engineer", "Fixer", "Soldier"],
    action: "action", range: 30, duration: "inst", school: "trs",
    desc: "Make a melee program attack against a creature within range. On a hit, the target takes 1d6 piercing damage, and if Large or smaller, you pull it up to 10 feet closer. If the damage die rolls a 6, the target must succeed on a Strength saving throw or have the Grappled condition.<br><br><strong>Overclock:</strong> 2d6 at 5th; 3d6 and 15 ft pull at 11th; 4d6 and 20 ft pull at 17th.",
    activity: { type: "attack", attack: { type: "melee", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d6" }, types: ["piercing"] }] } }
  },
  {
    name: "Guidance",
    os: ["Bureaucrat", "Doctor", "Keeper", "Trader"],
    action: "action", range: "touch", duration: "1 minute", concentration: true, school: "div",
    desc: "You touch one willing creature. Once before the program ends, the target can roll a 1d4 and add the number rolled to one ability check of its choice.<br><br><strong>Overclock:</strong> Range 30 ft at 5th, 60 ft at 11th; target can apply die to two different checks at 17th.",
    activity: { type: "utility", roll: { formula: "1d4", name: "Guidance Bonus" } }
  },
  {
    name: "Holo-Drones",
    os: ["Agent", "Engineer", "Fixer"],
    action: "action", range: 120, duration: "1 minute", concentration: true, school: "ill",
    desc: "You compile up to four palm-sized holographic projectors within range that hover and shed dim light in a 10-foot radius. As a Bonus Action, move them 60 feet, or combine into one glowing humanoid silhouette.<br><br><strong>Overclock:</strong> Range 200 ft at 5th; compile up to 6 drones at 11th; combined hologram can mimic movement and audio at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Imbue Weapon",
    os: ["Adventurer", "Martial Artist", "Meta-Physicist"],
    action: "bonus", range: "touch", duration: "1 minute", school: "trs",
    desc: "For the duration, you can use your nanocasting ability instead of Strength or Dexterity for the attack and damage rolls of melee attacks using that weapon, its damage die becomes 1d8, and it deals force damage.<br><br><strong>Overclock:</strong> Damage die becomes 1d10 at 5th, 1d12 at 11th, 2d6 at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Ion Aegis",
    os: ["Keeper"],
    action: "action", range: "self", duration: "inst", school: "evo",
    desc: "Ionized energy erupts from your chassis. Each creature of your choice within 5 feet of you must succeed on a Constitution saving throw or take 1d6 radiant/ion damage.<br><br><strong>Overclock:</strong> 2d6 at 5th, 3d6 at 11th, 4d6 at 17th level.",
    activity: { type: "save", save: { ability: ["con"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d6" }, types: ["radiant"] }] } }
  },
  {
    name: "Ion Lasing",
    os: ["Doctor", "Keeper"],
    action: "action", range: 60, duration: "inst", school: "evo",
    desc: "Flame-like radiance descends on a creature you see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant/ion damage (gains no benefit from Half Cover or Three-Quarters Cover).<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th level.",
    activity: { type: "save", save: { ability: ["dex"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["radiant"] }] } }
  },
  {
    name: "Leech",
    os: ["Doctor", "Shade", "Trader"],
    action: "action", range: "touch", duration: "1 round", school: "nec",
    desc: "Make a melee program attack against a creature within reach. On a hit, the target takes 1d10 necrotic damage, and it cannot regain Hit Points until the start of your next turn. If Undead, Construct, or Droid, it has Disadvantage on attack rolls against you.<br><br><strong>Overclock:</strong> 2d10 at 5th, 3d10 at 11th, 4d10 at 17th.",
    activity: { type: "attack", attack: { type: "melee", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d10" }, types: ["necrotic"] }] } }
  },
  {
    name: "Light",
    os: ["Adventurer", "Engineer", "Keeper", "Soldier"],
    action: "action", range: "touch", duration: "1 hour", school: "evo",
    desc: "You touch one object no larger than 10 feet in any dimension. Until the program ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet.<br><br><strong>Overclock:</strong> Bright light extends to 40 ft at 5th; duration 8 hours at 11th; maintain up to 3 lit objects at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Mending",
    os: ["Engineer", "Fixer", "Trader"],
    action: "minute", range: "touch", duration: "inst", school: "trs",
    desc: "Repairs a single break or tear in an object you touch (broken wire, cracked datapad, torn suit seal) no larger than 1 foot in any dimension. Does not restore Hit Points.<br><br><strong>Overclock:</strong> 2 ft at 5th; execution time 1 Action at 11th; 5 ft at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Mind Pain",
    os: ["Meta-Physicist"],
    action: "action", range: 60, duration: "1 round", school: "enc",
    desc: "You drive a spike of psychic energy into one creature within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.<br><br><strong>Overclock:</strong> 2d6 at 5th, 3d6 at 11th, 4d6 at 17th.",
    activity: { type: "save", save: { ability: ["int"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d6" }, types: ["psychic"] }] } }
  },
  {
    name: "Minor Hologram",
    os: ["Agent", "Engineer", "Fixer", "Shade"],
    action: "action", range: 30, duration: "1 minute", school: "ill",
    desc: "You compile a visual hologram or audio sound within a 5-foot cube that lasts for the duration. Physical interaction reveals it as an illusion, or it can be discerned via Intelligence (Investigation).<br><br><strong>Overclock:</strong> Range 60 ft at 5th; 10-ft cube at 11th; combines audio and visual loops at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Minor Telekinesis",
    os: ["Keeper", "Martial Artist", "Meta-Physicist", "Shade"],
    action: "action", range: 30, duration: "1 minute", school: "trs",
    desc: "A micro-graviton tractor beam appears at a point within range. Use your action to manipulate an object, open an unlocked door/container, or retrieve gear up to 10 pounds. Cannot attack or activate tech items.<br><br><strong>Overclock:</strong> 20 lbs at 5th; 40 lbs and range 60 ft at 11th; 80 lbs at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Minor Terraform",
    os: ["Adventurer", "Doctor", "Martial Artist"],
    action: "action", range: 30, duration: "inst", school: "trs",
    desc: "Subtle influence over raw matter within a 5-foot cube: clear dirt/sand, dig small trench, create gentle breeze, produce harmless sensory tremors, or snuff small flame. Up to two non-instantaneous effects active at once.<br><br><strong>Overclock:</strong> 10-ft cube at 5th; range 60 ft and 3 effects at 11th; 15-ft cube at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Notum Blast",
    os: ["Nano-Technician"],
    action: "action", range: 120, duration: "inst", school: "evo",
    desc: "A beam of crackling blue energy streaks toward a creature within range. Make a ranged program attack against the target. On a hit, the target takes 1d10 force damage.<br><br><strong>Overclock:</strong> Two beams at 5th, three beams at 11th, four beams at 17th level (separate attack rolls).",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d10" }, types: ["force"] }] } }
  },
  {
    name: "Performance Review",
    os: ["Bureaucrat", "Trader"],
    action: "action", range: 60, duration: "1 round", school: "enc",
    desc: "Demoralizing critiques laced with psychic static target one creature within range. Target must succeed on a Wisdom saving throw or take 1d4 psychic damage and have Disadvantage on its next attack roll.<br><br><strong>Overclock:</strong> 2d4 at 5th, 3d4 at 11th, 4d4 at 17th.",
    activity: { type: "save", save: { ability: ["wis"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d4" }, types: ["psychic"] }] } }
  },
  {
    name: "Plasma Bolt",
    os: ["Nano-Technician"],
    action: "action", range: 120, duration: "inst", school: "evo",
    desc: "You hurl a mot of plasma at a creature or object within range. Make a ranged program attack. On a hit, the target takes 1d10 fire damage. Flammable objects ignite.<br><br><strong>Overclock:</strong> 2d10 at 5th, 3d10 at 11th, 4d10 at 17th.",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d10" }, types: ["fire"] }] } }
  },
  {
    name: "Poison Dart",
    os: ["Agent", "Bureaucrat", "Doctor"],
    action: "action", range: 30, duration: "inst", school: "nec",
    desc: "You launch a pressurized micro-flechette coated in neurotoxin. The target must succeed on a Constitution saving throw or take 1d12 poison damage.<br><br><strong>Overclock:</strong> 2d12 at 5th, 3d12 at 11th, 4d12 at 17th.",
    activity: { type: "save", save: { ability: ["con"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d12" }, types: ["poison"] }] } }
  },
  {
    name: "Resistance",
    os: ["Doctor", "Keeper"],
    action: "action", range: "touch", duration: "1 minute", concentration: true, school: "abj",
    desc: "You touch one willing creature. Once before the program ends, the target can roll a 1d4 and add the number rolled to one saving throw of its choice.<br><br><strong>Overclock:</strong> Range 30 ft at 5th, 60 ft at 11th; target can apply die to two separate saves at 17th.",
    activity: { type: "utility", roll: { formula: "1d4", name: "Resistance Bonus" } }
  },
  {
    name: "Shocking Grasp",
    os: ["Bureaucrat", "Engineer", "Trader"],
    action: "action", range: "touch", duration: "inst", school: "evo",
    desc: "Make a melee program attack against the target (Advantage if target is wearing metal armor or is a Droid/Construct). On a hit, the target takes 1d8 lightning damage and cannot make Opportunity Attacks until its next turn.<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th.",
    activity: { type: "attack", attack: { type: "melee", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["lightning"] }] } }
  },
  {
    name: "Sonic Boom",
    os: ["Enforcer", "Martial Artist"],
    action: "action", range: "self", duration: "inst", school: "evo",
    desc: "5-foot emanation: concussive acoustic burst ripples outward. Each creature within 5 feet must succeed on a Constitution saving throw or take 1d6 thunder damage. Audible out to 100 feet.<br><br><strong>Overclock:</strong> 2d6 at 5th, 3d6 at 11th, 4d6 at 17th.",
    activity: { type: "save", save: { ability: ["con"], dc: { calculation: "spellcasting" } }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d6" }, types: ["thunder"] }] } }
  },
  {
    name: "Source Projector",
    os: ["Adventurer"],
    action: "action", range: 30, duration: "inst", school: "trs",
    desc: "Tap into natural planetary frequencies: forecast local weather for 24 hours; instantly sprout a seed/flower; create harmless ecological sensory effects; or light/snuff a small campfire.<br><br><strong>Overclock:</strong> 48 hr forecast (5-mile radius) at 5th; reveal toxicity levels at 11th; detect seismic tremors within 10 miles at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Thermal Cauterizer",
    os: ["Doctor"],
    action: "action", range: 60, duration: "10 minutes", school: "evo",
    desc: "A thermal flame appears in your hand shedding bright light in a 10-foot radius. As an action upon casting or on a later turn, hurl it up to 60 feet as a ranged attack for 1d8 fire damage.<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th.",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["fire"] }] } }
  },
  {
    name: "Tracer Bolt",
    os: ["Adventurer", "Agent", "Fixer"],
    action: "action", range: 60, duration: "inst", school: "evo",
    desc: "Make a ranged program attack against a target within range. On a hit, target takes 1d8 radiant damage, sheds dim light in a 10-foot radius, and cannot benefit from Invisible until the end of its next turn.<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th.",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["radiant"] }] } }
  },
  {
    name: "Trauma Defibrillation",
    os: ["Adventurer", "Doctor", "Martial Artist"],
    action: "action", range: "touch", duration: "inst", school: "nec",
    desc: "You touch a living creature that has 0 Hit Points. The creature becomes stable. Has no effect on Droids, Cyber-Constructs, or creatures that have died.<br><br><strong>Overclock:</strong> Range 15 ft at 5th, 30 ft at 11th, 60 ft at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Unstable Burst",
    os: ["Nano-Technician"],
    action: "action", range: 120, duration: "inst", school: "evo",
    desc: "Choose Acid, Cold, Fire, Force, Lightning, Poison, Psychic, Radiant, or Thunder. Make a ranged program attack dealing 1d8 damage of that type. Rolling an 8 allows rolling an additional d8 (up to 3 bonus dice).<br><br><strong>Overclock:</strong> 2d8 at 5th, 3d8 at 11th, 4d8 at 17th.",
    activity: { type: "attack", attack: { type: "ranged", classification: "spell" }, damage: { parts: [{ custom: { enabled: false, formula: "@scaling.cantrip * 1d8" }, types: ["force"] }] } }
  },
  {
    name: "Utility Cloud",
    os: ["Bureaucrat", "Nano-Technician", "Trader"],
    action: "action", range: 10, duration: "1 hour", school: "trs",
    desc: "Create instantaneous sensory burst; warm/chill/flavor up to 1 lb of nonliving material; clean or soil an object up to 1 cubic foot; or paint a temporary AR marker for 1 hour. Up to three effects active at once.<br><br><strong>Overclock:</strong> 4 active effects at 5th; range 30 ft at 11th; 6 active effects at 17th.",
    activity: { type: "utility" }
  },
  {
    name: "Vocal Sub-Woofer",
    os: ["Enforcer"],
    action: "action", range: 30, duration: "1 minute", school: "trs",
    desc: "Voice booms 3x louder, granting Advantage on Charisma (Intimidation) checks. Alternatively, flicker lights, rattle hatches violently, or produce an ominous localized seismic hum. Maintain up to 3 effects.<br><br><strong>Overclock:</strong> Heard at 300 ft at 5th, 1,000 ft at 11th, 1 mile at 17th.",
    activity: { type: "utility" }
  }
];

// =========================================================================
// 2. EXACT 76 TIER 1 (1ST-LEVEL) NANOPROGRAMS
// =========================================================================
const tier1 = [
  { name: "6,000,000,000 Forms of Communication", os: ["Agent", "Bureaucrat", "Engineer", "Meta-Physicist", "Trader"], action: "action", range: "self", duration: "1 hour", ritual: true, school: "div", desc: "You understand the literal meaning of any spoken language you hear and decipher written text on any surface or terminal you touch (reading at approximately 1 page per minute). Does not decode encrypted military ciphers." },
  { name: "Accelerate Fall", os: ["Meta-Physicist", "Nano-Technician"], action: "reaction", range: 60, duration: "1 minute", school: "trs", desc: "Trigger: When up to 5 creatures within range fall. Invert local graviton dampening: affected targets fall at 1,000 feet per round and take double falling damage on impact (2d6 per 10 feet, max 40d6)." },
  { name: "Alarm", os: ["Agent", "Engineer", "Fixer", "Soldier"], action: "minute", range: 30, duration: "8 hours", ritual: true, school: "abj", desc: "Set an invisible laser boundary or proximity tripwire across a door, window, or 20-foot cube. Breaching perimeter triggers an audible siren (60 ft) or a silent mental ping to your HUD within 1 mile." },
  { name: "Animal Friendship", os: ["Adventurer", "Doctor"], action: "action", range: 30, duration: "24 hours", school: "enc", desc: "Release pacifying pheromones toward a beast with Int 3 or lower. Target must make a Wisdom save or have the Charmed condition. Ends early if harmed.<br><br><strong>Overclock:</strong> +1 additional beast per tier above 1st (+1 NP/tier)." },
  { name: "Armor Megaboost", os: ["Engineer", "Keeper", "Soldier"], action: "bonus", range: 60, duration: "10 minutes", concentration: true, school: "abj", desc: "Overclock a shimmering deflector shield around an ally within range. The target gains a +2 bonus to Armor Class for the duration." },
  { name: "Autonomous Assistant", os: ["Agent", "Engineer", "Fixer", "Shade"], action: "hour", range: 10, duration: "inst", ritual: true, school: "con", desc: "Compile a persistent micro-drone or synthetic bio-familiar. Acts on its own initiative in combat (cannot attack). Within 100 ft, communicate telepathically and see through sensors. Can deliver Touch programs with its reaction." },
  { name: "Bend Will", os: ["Bureaucrat", "Trader"], action: "action", range: 30, duration: "1 hour", school: "enc", desc: "Project subtle neural interference into a humanoid within range. Target must succeed on a Wisdom save or gain the Charmed condition. Realizes it was influenced when program ends.<br><br><strong>Overclock:</strong> +1 additional creature per tier above 1st (+1 NP/tier)." },
  { name: "Bio-Scan", os: ["Adventurer", "Agent", "Doctor", "Keeper"], action: "action", range: "self", duration: "10 minutes", concentration: true, school: "div", desc: "Diagnostic HUD sensors calibrate to sense anomalous lifeforms. For the duration, you know if an Aberration, Cyber-Construct, Fiend, or Undead clone is within 30 feet, as well as its precise location." },
  { name: "Bio-Shield", os: ["Adventurer", "Doctor", "Enforcer", "Keeper"], action: "action", range: "touch", duration: "10 minutes", concentration: true, school: "abj", desc: "Project an electromagnetic bio-harmonic barrier around a willing creature. Aberrations, rogue Constructs, and Fiends have Disadvantage on attack rolls against target, and target cannot be Charmed, Frightened, or Possessed by them." },
  { name: "Bio-Transceiver", os: ["Adventurer", "Doctor"], action: "action", range: "self", duration: "10 minutes", ritual: true, school: "div", desc: "Modulate acoustic frequencies and pheromone sensors to comprehend and verbally communicate with planetary fauna, gleaning info on predators, hazards, and locations." },
  { name: "Biotoxin", os: ["Agent", "Doctor", "Shade"], action: "action", range: 60, duration: "inst", school: "nec", desc: "Fire a pressurized syringe of neurotoxin. Make a ranged program attack. On a hit, target takes 2d8 poison damage; Constitution save or Poisoned until end of next turn.<br><br><strong>Overclock:</strong> +1d8 damage per tier above 1st (+1 NP/tier)." },
  { name: "Boosted Tendons", os: ["Engineer", "Fixer", "Keeper", "Soldier"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "evo", desc: "Overdrive musculoskeletal servos and power cells. Until the program ends, your weapon attacks deal an extra 1d4 radiant (or force) damage on a hit." },
  { name: "Cage Match", os: ["Enforcer"], action: "bonus", range: 30, duration: "1 minute", concentration: true, school: "abj", desc: "Erect a hard-light perimeter locking you and a target together. Wisdom save or cannot move >30 ft away from you, and has Disadvantage on attack rolls against any target other than you." },
  { name: "Cellular Rupture", os: ["Doctor", "Shade"], action: "action", range: "touch", duration: "inst", school: "nec", desc: "Channel destructive Novictum pulses through your hand into an organic foe. Make a melee program attack dealing 3d10 necrotic damage on a hit.<br><br><strong>Overclock:</strong> +1d10 damage per tier above 1st (+1 NP/tier)." },
  { name: "Chill Spear", os: ["Meta-Physicist"], action: "action", range: 60, duration: "inst", school: "con", desc: "Ranged program attack dealing 1d10 piercing damage on a hit. Hit or miss, the spear detonates: each creature within 5 ft makes a Dexterity save or takes 2d6 cold damage.<br><br><strong>Overclock:</strong> +1d6 cold damage per tier above 1st (+1 NP/tier)." },
  { name: "Cipher Text", os: ["Agent", "Bureaucrat", "Fixer"], action: "minute", range: "touch", duration: "10 days", ritual: true, school: "ill", desc: "Encode data on a screen or datapad. Reads normally only to you and designated retinal profiles; appears illegible or displays spoofed content to unauthorized observers." },
  { name: "Cluster Flechette", os: ["Adventurer", "Soldier"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "con", desc: "Next ranged weapon hit sprays micro-bomblets. Target and each creature within 5 ft must make a Dexterity save, taking 1d10 piercing damage on a failure (half on success).<br><br><strong>Overclock:</strong> +1d10 damage per tier above 1st (+1 NP/tier)." },
  { name: "Coat of Blades", os: ["Adventurer", "Enforcer", "Engineer", "Soldier"], action: "reaction", range: 60, duration: "inst", school: "evo", desc: "Trigger: You take damage from a creature within range. Reactive plating expels a volley of micro-flechettes: attacker makes a Dexterity save, taking 2d10 kinetic/fire damage on failure (half on success).<br><br><strong>Overclock:</strong> +1d10 damage per tier above 1st (+1 NP/tier)." },
  { name: "Command", os: ["Bureaucrat", "Enforcer", "Trader"], action: "action", range: 60, duration: "1 round", school: "enc", desc: "Transmit an authoritative neural override word (Drop, Flee, Halt, Grovel). Target makes a Wisdom save or follows instruction on its next turn.<br><br><strong>Overclock:</strong> +1 additional creature within 30 ft per tier above 1st (+1 NP/tier)." },
  { name: "Concussive Strike", os: ["Enforcer", "Keeper", "Martial Artist"], action: "bonus", range: "self", duration: "inst", school: "evo", desc: "Trigger: After melee hit. Unleashes a pneumatic sonic blast dealing +2d6 thunder damage, pushing the target up to 10 feet away, and forcing a Strength save or knocked Prone." },
  { name: "Create or Destroy Water", os: ["Adventurer", "Doctor", "Engineer"], action: "action", range: 30, duration: "inst", school: "trs", desc: "Condense atmospheric moisture into 10 gallons of clean water / light rain in 30-ft cube; or instantly vaporize 10 gallons of liquid / 30-ft fog bank." },
  { name: "Decontaminate", os: ["Adventurer", "Doctor", "Engineer"], action: "action", range: 10, duration: "inst", ritual: true, school: "trs", desc: "Ultrasonic pulse and broad-spectrum UV beam purges all radiation, biological contaminants, microbes, and synthetic poisons from nonliving food/water within a 5-ft sphere." },
  { name: "Deep Scan", os: ["Engineer", "Meta-Physicist", "Nano-Technician", "Trader"], action: "minute", range: "touch", duration: "inst", ritual: true, school: "div", desc: "Diagnostic cables analyze an object, relic, or cybernetic implant, revealing properties, operational modes, activation commands, battery charges, tracking chips, or malware." },
  { name: "Demotivational Speech", os: ["Bureaucrat", "Trader"], action: "action", range: 30, duration: "1 minute", concentration: true, school: "enc", desc: "Broadcast demoralizing reprimands: up to 3 creatures must make Charisma saves. Whenever an affected target makes an attack roll or saving throw, it subtracts 1d4 from the result.<br><br><strong>Overclock:</strong> +1 additional creature per tier above 1st (+1 NP/tier)." },
  { name: "Detect Notum", os: ["Engineer", "Meta-Physicist", "Nano-Technician", "Shade"], action: "action", range: "self", duration: "10 minutes", concentration: true, ritual: true, school: "div", desc: "Sensors detect Notum energy and active nanoprograms within 30 feet, discerning operational Tier and discipline." },
  { name: "Dread Strike", os: ["Enforcer", "Shade"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "enc", desc: "Next melee hit discharges neural feedback dealing +1d6 psychic damage; target must make a Wisdom save or have the Frightened condition until program ends." },
  { name: "Ego Taunt", os: ["Enforcer", "Soldier"], action: "bonus", range: 30, duration: "1 minute", school: "enc", desc: "Broadcast a humiliating target lock. Target makes a Wisdom save or has Disadvantage on attack rolls against anyone other than you. Requires no concentration. Ends if you attack another creature." },
  { name: "Emergency Stim", os: ["Bureaucrat", "Doctor", "Keeper"], action: "bonus", range: 60, duration: "inst", school: "evo", desc: "Launch a nano-injection beacon. A living creature of your choice within range regains 2d4 + your nanocasting ability modifier Hit Points.<br><br><strong>Overclock:</strong> +2d4 healing per tier above 1st (+1 NP/tier)." },
  { name: "Energy Sink", os: ["Adventurer", "Enforcer", "Engineer", "Soldier"], action: "reaction", range: "self", duration: "1 round", school: "abj", desc: "Trigger: You take Acid, Cold, Fire, or Lightning damage. Gain Resistance to triggering type until start of next turn; your next melee strike deals an extra 1d6 damage of that type." },
  { name: "Entangle", os: ["Agent", "Bureaucrat", "Fixer", "Nano-Technician", "Trader"], action: "action", range: 90, duration: "1 minute", concentration: true, school: "con", desc: "Dispense fast-hardening polymer over a 20-ft square (Difficult Terrain). Each creature in area makes a Strength save or gains the Restrained condition (Athletics check vs DC to break free)." },
  { name: "Force Barrier", os: ["Meta-Physicist", "Nano-Technician"], action: "action", range: "touch", duration: "8 hours", school: "abj", desc: "Form-fitting kinetic shield wraps an unarmored willing creature, setting its base Armor Class to 13 + its Dexterity modifier. Ends if armor is donned." },
  { name: "Ghost Drone", os: ["Bureaucrat", "Engineer", "Trader"], action: "action", range: 60, duration: "1 hour", ritual: true, school: "con", desc: "Compile an invisible, formless utility drone (AC 10, 1 HP, Str 2) to fetch items, clean gear, haul freight, and cook rations. Cannot attack." },
  { name: "Grav Tendrils", os: ["Enforcer", "Meta-Physicist", "Shade"], action: "action", range: "self", duration: "inst", school: "evo", desc: "Gravitational tendrils lash out in 10-ft radius. Each creature makes a Strength save, taking 2d6 force damage and losing Reactions on a failure (half damage and retains reactions on success).<br><br><strong>Overclock:</strong> +1d6 damage per tier above 1st (+1 NP/tier)." },
  { name: "Grav-Chute", os: ["Adventurer", "Agent", "Engineer", "Fixer"], action: "reaction", range: 60, duration: "1 minute", school: "trs", desc: "Trigger: Up to 5 creatures within range fall. Repulsor anchors slow descent to 60 feet per round; targets take no falling damage and land safely on feet." },
  { name: "Gravity Shackle", os: ["Bureaucrat", "Fixer", "Nano-Technician"], action: "action", range: 60, duration: "1 minute", school: "trs", desc: "Crushing gravity binds a target. Strength save: takes 1d10 force damage and speed is halved for duration (half damage only on success). Repeats save at end of each turn, taking 1d10 force on failure.<br><br><strong>Overclock:</strong> +1d10 damage per tier above 1st (+1 NP/tier)." },
  { name: "Hedge Risk", os: ["Trader"], action: "reaction", range: 60, duration: "inst", school: "abj", desc: "Trigger: You or ally within range takes damage. Liquidate escrow reserves, spending up to 10 company credits to reduce incoming damage by 1 point per credit spent.<br><br><strong>Overclock:</strong> +10 max absorption per tier above 1st (+1 NP/tier)." },
  { name: "Hologram", os: ["Agent", "Engineer", "Fixer", "Shade"], action: "action", range: 60, duration: "10 minutes", concentration: true, school: "ill", desc: "Project a visual 15-foot cube hard-light illusion. Use an action to move it naturally within range. Discerned via physical interaction or Investigation check." },
  { name: "Horrific Demise", os: ["Meta-Physicist", "Shade"], action: "reaction", range: 30, duration: "1 minute", school: "ill", desc: "Trigger: Creature drops to 0 HP within 30 ft. Project gruesome sensory feedback: one creature within range must make a Wisdom save or gain the Frightened condition (repeats save end of turns)." },
  { name: "Hover-Sled", os: ["Engineer", "Trader"], action: "action", range: 30, duration: "1 hour", ritual: true, school: "con", desc: "Project a 3-foot circular repulsor platform floating 3 feet high. Holds up to 500 pounds and trails 20 feet behind you. Cannot cross drops greater than 10 feet." },
  { name: "Intensify Stress", os: ["Bureaucrat", "Meta-Physicist", "Shade"], action: "action", range: 60, duration: "inst", school: "enc", desc: "Flood an enemy's neural net with cognitive dissonance. Wisdom save: takes 3d6 psychic damage and uses Reaction to move away on failure (half damage and no move on success).<br><br><strong>Overclock:</strong> +1d6 damage per tier above 1st (+1 NP/tier)." },
  { name: "Localized Faultline", os: ["Enforcer", "Martial Artist", "Nano-Technician"], action: "action", range: "self", duration: "inst", school: "evo", desc: "Pneumatic floor slam in 15-ft cube originating from you. Constitution save: takes 2d8 thunder damage, pushed 10 ft away, and knocked Prone on failure (half damage, not moved on success).<br><br><strong>Overclock:</strong> +1d8 damage per tier above 1st (+1 NP/tier)." },
  { name: "Mask", os: ["Agent", "Fixer", "Shade", "Trader"], action: "action", range: "self", duration: "1 hour", school: "ill", desc: "Refractive holoprojectors alter facial features, clothing, armor, and gear (+/- 1 foot height). Discerned via Intelligence (Investigation) against Program DC." },
  { name: "Memory Leak", os: ["Agent", "Fixer", "Nano-Technician"], action: "action", range: 60, duration: "1 minute", concentration: true, school: "enc", desc: "Target makes a Wisdom save or suffers a memory leak: can choose only ONE of Action, Bonus Action, Reaction, or Move on its turn without penalty. Each additional option taken inflicts 1d6 psychic damage.<br><br><strong>Overclock:</strong> +1d6 psychic damage per tier above 1st (+1 NP/tier)." },
  { name: "Micro Flechette", os: ["Nano-Technician"], action: "action", range: 120, duration: "inst", school: "evo", desc: "Launch three guidance-locked micro-flechettes dealing 1d4 + 1 force damage each automatically to targets within range.<br><br><strong>Overclock:</strong> +1 flechette per tier above 1st (+1 NP/tier)." },
  { name: "Mirror Shield", os: ["Engineer", "Nano-Technician", "Soldier"], action: "action", range: "self", duration: "1 hour", school: "abj", desc: "Gain 5 Temporary Hit Points. While active, any creature that hits you with a melee attack takes 5 cold (or radiant) damage.<br><br><strong>Overclock:</strong> Both Temp HP and damage increase by 5 per tier above 1st (+1 NP/tier)." },
  { name: "Morale Surge", os: ["Bureaucrat", "Enforcer", "Soldier"], action: "action", range: "touch", duration: "1 minute", concentration: true, school: "enc", desc: "Target is immune to the Frightened condition and gains Temporary Hit Points equal to your nanocasting ability modifier at the start of each of its turns." },
  { name: "Motivational Speech", os: ["Bureaucrat", "Doctor", "Keeper", "Soldier"], action: "action", range: 30, duration: "1 minute", concentration: true, school: "enc", desc: "Broadcast telemetry overlays: up to 3 allies of your choice add 1d4 to every attack roll and saving throw they make for the duration.<br><br><strong>Overclock:</strong> +1 ally per tier above 1st (+1 NP/tier)." },
  { name: "Nano Bandage", os: ["Adventurer", "Doctor", "Martial Artist"], action: "action", range: "touch", duration: "inst", school: "evo", desc: "Accelerated cellular reconstructors restore 2d8 + your nanocasting ability modifier Hit Points to a living creature you touch. No effect on Droids or Constructs.<br><br><strong>Overclock:</strong> +2d8 healing per tier above 1st (+1 NP/tier)." },
  { name: "Neuro-Spasm", os: ["Agent", "Bureaucrat", "Meta-Physicist", "Trader"], action: "action", range: 30, duration: "1 minute", concentration: true, school: "enc", desc: "Wisdom save or falls Prone and gains Incapacitated condition, unable to stand. Repeats save at end of turns and when taking damage." },
  { name: "Pharmacy Hack", os: ["Fixer"], action: "action", range: "touch", duration: "24 hours", school: "trs", desc: "Synthesize up to 10 black-market stim tablets. Consuming one requires a Bonus Action, restoring 1 HP and providing 1 day of nourishment. Lose potency after 24 hrs." },
  { name: "Phosphor Torch", os: ["Nano-Technician"], action: "action", range: "self", duration: "inst", school: "evo", desc: "15-ft cone of incandescent white phosphorus. Dexterity save: 3d6 fire damage on failure (half on success). Flammable objects ignite.<br><br><strong>Overclock:</strong> +1d6 fire damage per tier above 1st (+1 NP/tier)." },
  { name: "Photon Deflector", os: ["Engineer", "Nano-Technician"], action: "action", range: "self", duration: "1 round", school: "ill", desc: "Optical flash blinding 33 (6d10) Hit Points of creatures in a 15-foot cone until the end of your next turn (lowest current HP first, no saving throw).<br><br><strong>Overclock:</strong> +11 (2d10) HP pool per tier above 1st (+1 NP/tier)." },
  { name: "Plasma Strike", os: ["Enforcer", "Soldier"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "evo", desc: "Next melee hit deals +1d6 fire damage and ignites target, causing it to take 1d6 fire damage at start of its turns until extinguished.<br><br><strong>Overclock:</strong> +1d6 initial fire damage per tier above 1st (+1 NP/tier)." },
  { name: "Prism Pulse", os: ["Meta-Physicist", "Nano-Technician"], action: "action", range: 90, duration: "inst", school: "evo", desc: "Ranged attack dealing 3d8 damage (Acid, Cold, Fire, Lightning, Poison, or Thunder). If 2+ dice match, pulse bounces to another creature within 30 ft.<br><br><strong>Overclock:</strong> +1d8 damage per tier above 1st (+1 NP/tier)." },
  { name: "Rail Toss", os: ["Engineer", "Keeper", "Meta-Physicist"], action: "action", range: 90, duration: "inst", school: "trs", desc: "Launch an unattended 1-5 lb object 90 feet in a straight line. First creature in path makes a Dexterity save or takes 3d8 bludgeoning damage.<br><br><strong>Overclock:</strong> +1d8 damage and +5 lbs max weight per tier above 1st (+1 NP/tier)." },
  { name: "Ransack", os: ["Doctor", "Shade", "Trader"], action: "bonus", range: 90, duration: "1 hour", concentration: true, school: "nec", desc: "Upload an entropic siphon to a quarry: deal +1d6 necrotic/force damage on hits and impose Disadvantage on ability checks using one chosen ability. Move as Bonus Action on target death." },
  { name: "Repair Object", os: ["Engineer"], action: "action", range: 30, duration: "inst", school: "trs", desc: "Deploy micro-welders directly to a damaged Droid, Cyber-Construct, or vehicle within range, restoring 2d8 + your nanocasting ability modifier Hit Points.<br><br><strong>Overclock:</strong> +2d8 repair per tier above 1st (+1 NP/tier)." },
  { name: "Rocket Leap", os: ["Adventurer", "Enforcer", "Martial Artist"], action: "action", range: "touch", duration: "1 minute", school: "trs", desc: "Jump distance is tripled. Once on each of its turns, target can leap up to 30 feet using 10 feet of movement." },
  { name: "Shield", os: ["Nano-Technician"], action: "reaction", range: "self", duration: "1 round", school: "abj", desc: "Trigger: Hit by an attack roll or targeted by Micro Flechette. Gain +5 bonus to AC until start of next turn and take no damage from Micro Flechette." },
  { name: "Shockwave Smite", os: ["Enforcer", "Keeper"], action: "bonus", range: "self", duration: "inst", school: "evo", desc: "Trigger: Melee hit. Strike detonates in a concussive boom dealing +1d8 thunder damage; each creature in a 15-ft cone in direction of target makes a Strength save or falls Prone.<br><br><strong>Overclock:</strong> +1d8 thunder damage per tier above 1st (+1 NP/tier)." },
  { name: "Shrapnel Burst", os: ["Adventurer", "Agent", "Fixer", "Soldier"], action: "bonus", range: "self", duration: "inst", school: "con", desc: "Trigger: Ranged hit. Target and each creature within 5 ft make a Dexterity save, taking 2d4 piercing + 2d4 piercing if moving before your next turn on failure (half damage, no move penalty on success).<br><br><strong>Overclock:</strong> Both initial and move damage increase by 2d4 per tier above 1st (+1 NP/tier)." },
  { name: "Slick", os: ["Engineer", "Fixer", "Trader"], action: "action", range: 60, duration: "1 minute", school: "con", desc: "Coat a 10-ft square in lubricant (Difficult Terrain). Any creature entering or starting turn there must succeed on a Dexterity save or fall Prone." },
  { name: "Sleep", os: ["Agent", "Bureaucrat", "Doctor", "Fixer"], action: "action", range: 60, duration: "1 minute", concentration: true, school: "enc", desc: "5-ft radius soporific aerosol: Wisdom save or Incapacitated; repeats save at start of turns, falling Unconscious on failure. Ends if damaged or shaken awake." },
  { name: "Slipstream", os: ["Adventurer", "Fixer", "Martial Artist", "Shade"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "trs", desc: "Movement does not provoke Opportunity Attacks. Once before ending, gain Advantage on one attack (+1d8 force damage on hit) and +30 ft walking speed for the turn." },
  { name: "Smokescreen", os: ["Adventurer", "Agent", "Fixer", "Soldier"], action: "action", range: 120, duration: "1 hour", concentration: true, school: "con", desc: "Thermal smoke fills 20-ft radius sphere (Heavily Obscured). Dispersed by 10+ mph wind in 4 rounds.<br><br><strong>Overclock:</strong> +20 ft radius per tier above 1st (+1 NP/tier)." },
  { name: "Source Empowered Strike", os: ["Keeper"], action: "bonus", range: "self", duration: "inst", school: "evo", desc: "Trigger: Melee weapon hit. Channel raw Notum dealing +2d8 radiant/force damage (+3d8 vs Aberrations, Fiends, or Undead clones).<br><br><strong>Overclock:</strong> +1d8 damage per tier above 1st (+1 NP/tier)." },
  { name: "Sprint", os: ["Agent", "Fixer", "Martial Artist", "Soldier"], action: "bonus", range: "self", duration: "10 minutes", concentration: true, school: "trs", desc: "Bypass leg servo safeties: take the Dash action as a Bonus Action on each of your subsequent turns for the duration." },
  { name: "Suppression Gas", os: ["Bureaucrat", "Doctor", "Keeper"], action: "bonus", range: 30, duration: "1 minute", school: "abj", desc: "Tranquilizer haze wards creature: enemy attempting attack/harmful program against it makes a Wisdom save or must retarget or waste action. Ends if warded target attacks/casts." },
  { name: "Surgical Laser", os: ["Doctor"], action: "action", range: 120, duration: "1 round", school: "evo", desc: "Ranged attack dealing 4d6 radiant damage. Optical glare gives Advantage on the next attack roll made against the target before end of your next turn.<br><br><strong>Overclock:</strong> +1d6 damage per tier above 1st (+1 NP/tier)." },
  { name: "Target Lock", os: ["Adventurer", "Agent", "Soldier"], action: "bonus", range: 90, duration: "1 hour", concentration: true, school: "div", desc: "Telemetry lock deals +1d6 weapon damage to quarry and grants Advantage on Perception/Survival to track it. Move as Bonus Action when target drops to 0 HP." },
  { name: "Target Paint", os: ["Adventurer", "Agent", "Fixer", "Soldier"], action: "action", range: 60, duration: "1 minute", concentration: true, school: "evo", desc: "20-ft cube bioluminescent chaff: Dexterity save or outlined in light. Attacks against outlined targets have Advantage, and targets cannot benefit from Invisible." },
  { name: "Tether Shot", os: ["Adventurer", "Enforcer", "Soldier"], action: "bonus", range: "self", duration: "1 minute", concentration: true, school: "con", desc: "Next weapon hit restrains target with micro-grapple (Strength save). While restrained, takes 1d6 piercing at start of turns (action to make Strength check vs DC to detach).<br><br><strong>Overclock:</strong> +1d6 piercing damage per tier above 1st (+1 NP/tier)." },
  { name: "Terrain Knowledge", os: ["Adventurer", "Fixer", "Martial Artist", "Shade", "Soldier"], action: "action", range: "touch", duration: "1 hour", school: "trs", desc: "Upload wayfinding vectors and optimal stride routines, increasing the target's movement speed by 10 feet for the duration.<br><br><strong>Overclock:</strong> +1 target per tier above 1st (+1 NP/tier)." },
  { name: "Tesla Arc", os: ["Engineer", "Nano-Technician"], action: "action", range: 30, duration: "1 minute", concentration: true, school: "evo", desc: "Ranged attack dealing 2d12 lightning damage. On subsequent turns, use Bonus Action to automatically deal 1d12 lightning damage if target remains within 30 ft.<br><br><strong>Overclock:</strong> +1d12 initial damage per tier above 1st (+1 NP/tier)." },
  { name: "Thicken Skin", os: ["Adventurer", "Enforcer", "Keeper", "Martial Artist", "Soldier"], action: "action", range: "self", duration: "1 hour", school: "nec", desc: "Dermal nanites reinforce muscle and bone density, granting 2d4 + 4 Temporary Hit Points.<br><br><strong>Overclock:</strong> +5 Temporary Hit Points per tier above 1st (+1 NP/tier)." },
  { name: "Toxin Scan", os: ["Adventurer", "Doctor", "Engineer"], action: "action", range: "self", duration: "10 minutes", concentration: true, ritual: true, school: "div", desc: "Chemical sensors sample air and surfaces within 30 feet, revealing presence, general location, and biological/synthetic identity of poisons, venoms, contagions, and pathogenic agents." }
];

// =========================================================================
// 3. BUILD ITEM DOCUMENTS (Adhering to AGENTS.md: _id, _key, activities)
// =========================================================================
function buildDoc(prog, level) {
  const slug = prog.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const id = generateId(`sor-prog-t${level}-`, slug);
  const actId = generateId("act-", slug);

  // Auto-detect activity details if not explicitly passed
  let activity = prog.activity;
  if (!activity) {
    if (prog.desc.includes("ranged program attack") || prog.desc.includes("Ranged program attack") || prog.desc.includes("Ranged attack") || prog.desc.includes("ranged attack")) {
      activity = { type: "attack", attack: { type: "ranged", classification: "spell" } };
    } else if (prog.desc.includes("melee program attack") || prog.desc.includes("melee attack") || prog.desc.includes("melee hit") || prog.desc.includes("melee strike")) {
      activity = { type: "attack", attack: { type: "melee", classification: "spell" } };
    } else if (prog.desc.includes("saving throw") || prog.desc.includes("save")) {
      let ability = ["wis"];
      if (prog.desc.includes("Dexterity save")) ability = ["dex"];
      else if (prog.desc.includes("Constitution save")) ability = ["con"];
      else if (prog.desc.includes("Strength save")) ability = ["str"];
      else if (prog.desc.includes("Charisma save")) ability = ["cha"];
      else if (prog.desc.includes("Intelligence save")) ability = ["int"];
      activity = { type: "save", save: { ability, dc: { calculation: "spellcasting" } } };
    } else if (prog.desc.includes("regains") || prog.desc.includes("restoring") || prog.desc.includes("Temporary Hit Points")) {
      activity = { type: "heal" };
    } else {
      activity = { type: "utility" };
    }
  }

  const doc = {
    _id: id,
    name: prog.name,
    type: "spell",
    img: level === 0 ? "icons/magic/light/beam-strike-violet.webp" : "icons/magic/fire/beam-jet-stream-yellow.webp",
    system: {
      description: {
        value: `<p>${prog.desc}</p><p><strong>Operating Systems:</strong> ${prog.os.join(", ")}</p><p><strong>NCU Footprint:</strong> 1 Slot | <strong>Base Nanopool:</strong> ${level === 0 ? "0 NP" : "2 NP"}</p>`
      },
      source: { custom: "Suns of Rubi Core" },
      level: level,
      school: prog.school || "evo",
      properties: [
        ...(prog.ritual ? ["ritual"] : []),
        ...(prog.concentration ? ["concentration"] : []),
        "vocal",
        "somatic"
      ],
      activation: { type: prog.action || "action", value: 1, condition: "" },
      duration: {
        value: prog.duration?.includes("minute") ? prog.duration.split(" ")[0] : (prog.duration?.includes("hour") ? prog.duration.split(" ")[0] : (prog.duration?.includes("day") ? prog.duration.split(" ")[0] : "")),
        units: prog.duration === "inst" ? "inst" : (prog.duration?.includes("minute") ? "minute" : (prog.duration?.includes("hour") ? "hour" : (prog.duration?.includes("day") ? "day" : (prog.duration?.includes("round") ? "round" : "special"))))
      },
      target: { affects: { count: prog.range === "self" ? "" : "1", type: prog.range === "self" ? "self" : "creature" } },
      range: {
        value: typeof prog.range === "number" ? prog.range : null,
        units: typeof prog.range === "number" ? "ft" : (prog.range === "touch" ? "touch" : "self")
      },
      preparation: { mode: "prepared", prepared: false },
      activities: {}
    },
    _key: `!items!${id}`
  };

  const act = {
    _id: actId,
    type: activity.type || "utility",
    activation: { type: prog.action || "action", value: 1 }
  };
  if (activity.attack) act.attack = activity.attack;
  if (activity.save) act.save = activity.save;
  if (activity.damage) act.damage = activity.damage;
  if (activity.healing) act.healing = activity.healing;
  if (activity.roll) act.roll = activity.roll;

  if (level > 0) {
    act.consumption = {
      targets: [{ type: "attribute", target: "resources.primary.value", value: "2", scaling: { mode: "amount", formula: "1" } }]
    };
  }

  doc.system.activities[actId] = act;
  return { id, slug, doc };
}

console.log("Writing Tier 0 items...");
tier0.forEach(p => {
  const { slug, doc } = buildDoc(p, 0);
  fs.writeFileSync(path.join(DIR_T0, `${slug}.json`), JSON.stringify(doc, null, 2), "utf8");
});

console.log("Writing Tier 1 items...");
tier1.forEach(p => {
  const { slug, doc } = buildDoc(p, 1);
  fs.writeFileSync(path.join(DIR_T1, `${slug}.json`), JSON.stringify(doc, null, 2), "utf8");
});

// =========================================================================
// 4. GENERATE 14 CLASS OS DIRECTORY JOURNALS
// =========================================================================
const classes = [
  "Adventurer", "Agent", "Bureaucrat", "Doctor", "Enforcer",
  "Engineer", "Fixer", "Keeper", "Martial Artist", "Meta-Physicist",
  "Nano-Technician", "Shade", "Soldier", "Trader"
];

function getUuid(name, level) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const id = generateId(`sor-prog-t${level}-`, slug);
  return `@UUID[Compendium.suns-of-rubi-core.nanoprograms.Item.${id}]{${name}}`;
}

console.log("Generating Class OS Directory Journals...");
classes.forEach(cls => {
  const cSlug = cls.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const jId = generateId("sor-jrnl-", cSlug);
  const pId = generateId("sor-page-", cSlug);

  const t0Matches = tier0.filter(p => p.os.includes(cls));
  const t1Matches = tier1.filter(p => p.os.includes(cls));

  let html = `<h1>${cls} Operating System</h1>`;
  html += `<p>This directory catalogs all compiled nano-formulas available to the <strong>${cls}</strong> OS. Click any entry to inspect its telemetry, or drag the link directly onto your character sheet to install the routine into your NCU.</p>`;

  html += `<h2>Tier 0: At-Will Routines (${t0Matches.length})</h2><ul>`;
  t0Matches.forEach(p => { html += `<li>${getUuid(p.name, 0)}</li>`; });
  html += `</ul>`;

  html += `<h2>Tier 1: Leveled Nanoprograms (${t1Matches.length})</h2><ul>`;
  t1Matches.forEach(p => { html += `<li>${getUuid(p.name, 1)}</li>`; });
  html += `</ul>`;

  const doc = {
    _id: jId,
    name: `${cls} OS Directory`,
    pages: [{
      _id: pId,
      name: `${cls} OS Catalog`,
      type: "text",
      text: { format: 1, content: html },
      title: { show: true, level: 1 },
      _key: `!journal.pages!${jId}.${pId}`
    }],
    ownership: { default: 2 },
    _key: `!journal!${jId}`
  };

  fs.writeFileSync(path.join(DIR_JRNL, `${cSlug}-os.json`), JSON.stringify(doc, null, 2), "utf8");
});

console.log(`\nCOMPILATION COMPLETE:`);
console.log(`- Tier 0 Programs generated: ${tier0.length}`);
console.log(`- Tier 1 Programs generated: ${tier1.length}`);
console.log(`- Total unique nanoprograms: ${tier0.length + tier1.length}`);
console.log(`- Class OS Journals generated: ${classes.length}`);
