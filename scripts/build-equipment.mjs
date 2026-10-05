/**
 * scripts/build-equipment.mjs
 *
 * Deterministic build script generating:
 * - 60 Weapons in src/items/weapons/ (type: "weapon")
 * - 15 Armors & Shields in src/items/armor/ (type: "equipment")
 * - 24 Gear, Consumables & Tools in src/items/gear/ (type: "consumable", "loot", "tool", "equipment")
 * - 19 Hardware Mods in src/items/hardware-mods/ (type: "equipment")
 *
 * Adheres strictly to AGENTS.md:
 * - Unique 16-character alphanumeric _id for every document
 * - _key: "!items!" + _id
 * - Modern Foundry v12/v14 system.activities
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
// 1. WEAPONS (60 items)
// ---------------------------------------------------------------------------
const WEAPONS_DATA = [
  // A. Simple Ranged (5)
  {
    id: "WpnHoldoutBlast1",
    name: "Holdout Blaster",
    file: "holdout-blaster.json",
    price: 100, weight: 1, type: "simpleR",
    damage: { num: 1, den: 4, type: "radiant" },
    range: { value: 30, long: 120 },
    properties: ["lgt", "close-quarters", "reload-12"],
    mastery: "vex",
    desc: "Compact energy sidearm designed for concealed personal defense. Light, Close-Quarters, Reload (12)."
  },
  {
    id: "WpnPulsePistol01",
    name: "Pulse Pistol",
    file: "pulse-pistol.json",
    price: 250, weight: 2, type: "simpleR",
    damage: { num: 1, den: 6, type: "radiant" },
    range: { value: 40, long: 160 },
    properties: ["lgt", "close-quarters", "reload-16"],
    mastery: "nick",
    desc: "Standard civilian and corporate officer energy pistol. Rapid-firing pulses with Close-Quarters handling."
  },
  {
    id: "WpnSubmachineGn1",
    name: "Submachine Gun",
    file: "submachine-gun.json",
    price: 300, weight: 4, type: "simpleR",
    damage: { num: 1, den: 6, type: "piercing" },
    range: { value: 30, long: 90 },
    properties: ["lgt", "close-quarters", "continuous-fire", "auto-6", "reload-12"],
    mastery: "nick",
    auxActivity: {
      type: "save",
      name: "Full Auto Spray",
      activation: { type: "action", value: 1, condition: "Expend 6 rounds" },
      target: { template: { type: "cube", size: "10", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "dex", formula: "" } },
      damage: { parts: [{ number: 1, denomination: 6, types: ["piercing"] }] }
    },
    desc: "Compact automatic ballistic weapon firing high-velocity caseless slugs. Features Full Auto spray mode."
  },
  {
    id: "WpnLightCarbine1",
    name: "Light Carbine",
    file: "light-carbine.json",
    price: 350, weight: 5, type: "simpleR",
    damage: { num: 1, den: 8, type: "radiant" },
    range: { value: 80, long: 320 },
    properties: ["two", "burst-4", "reload-24"],
    mastery: "slow",
    desc: "Balanced light energy carbine suited for security details and perimeter patrols."
  },
  {
    id: "WpnSlugDartGun01",
    name: "Slug Dart Gun",
    file: "slug-dart-gun.json",
    price: 150, weight: 2, type: "simpleR",
    damage: { num: 1, den: 4, type: "piercing" },
    range: { value: 40, long: 120 },
    properties: ["fin", "lgt", "close-quarters", "reload-6"],
    mastery: "sap",
    desc: "Pneumatic needle gun firing poisoned flechettes or acoustic tracking darts silently."
  },

  // B. Martial Ranged (13)
  {
    id: "WpnHvyBlastPist1",
    name: "Heavy Blaster Pistol",
    file: "heavy-blaster-pistol.json",
    price: 450, weight: 3, type: "martialR",
    damage: { num: 1, den: 8, type: "radiant" },
    range: { value: 50, long: 200 },
    properties: ["close-quarters", "reload-16"],
    mastery: "vex",
    desc: "High-yield sidearm favored by bounty hunters and Enforcers for punishing stopping power."
  },
  {
    id: "WpnHandCannon001",
    name: "Hand Cannon",
    file: "hand-cannon.json",
    price: 500, weight: 4, type: "martialR",
    damage: { num: 1, den: 10, type: "piercing" },
    range: { value: 40, long: 160 },
    properties: ["close-quarters", "high-recoil-str-11", "reload-6"],
    mastery: "vex",
    desc: "Massive large-caliber ballistic revolver firing high-explosive slug rounds."
  },
  {
    id: "WpnCombatBow0001",
    name: "Combat Bow",
    file: "combat-bow.json",
    price: 350, weight: 3, type: "martialR",
    damage: { num: 1, den: 8, type: "piercing" },
    range: { value: 150, long: 600 },
    properties: ["hvy", "two"],
    mastery: "slow",
    desc: "Reinforced composite bow with magnetic tension pulleys for silent long-range eliminations."
  },
  {
    id: "WpnAutoRifle0001",
    name: "Auto Rifle",
    file: "auto-rifle.json",
    price: 650, weight: 8, type: "martialR",
    damage: { num: 1, den: 6, type: "piercing" },
    range: { value: 80, long: 320 },
    properties: ["two", "continuous-fire", "burst-2", "auto-4", "high-recoil-str-13", "reload-8"],
    mastery: "graze",
    auxActivity: {
      type: "save",
      name: "Auto Fire",
      activation: { type: "action", value: 1, condition: "Expend 4 rounds" },
      target: { template: { type: "cube", size: "10", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "dex", formula: "" } },
      damage: { parts: [{ number: 1, denomination: 6, types: ["piercing"] }] }
    },
    desc: "Military assault rifle featuring selectable burst and automatic fire modes."
  },
  {
    id: "WpnPulseRifle001",
    name: "Pulse Rifle",
    file: "pulse-rifle.json",
    price: 750, weight: 7, type: "martialR",
    damage: { num: 2, den: 4, type: "piercing" },
    range: { value: 100, long: 400 },
    properties: ["two", "fin", "burst-2", "reload-6"],
    mastery: "push",
    desc: "Accurate kinetic pulse battle rifle delivering tightly clustered hyper-velocity rounds."
  },
  {
    id: "WpnScoutRifle001",
    name: "Scout Rifle",
    file: "scout-rifle.json",
    price: 600, weight: 6, type: "martialR",
    damage: { num: 1, den: 8, type: "piercing" },
    range: { value: 120, long: 360 },
    properties: ["two", "reload-6"],
    mastery: "slow",
    desc: "Semi-automatic marksman rifle optimized for mobile reconnaissance and suppressive fire."
  },
  {
    id: "WpnHvyBlastRifl1",
    name: "Heavy Blaster Rifle",
    file: "heavy-blaster-rifle.json",
    price: 800, weight: 8, type: "martialR",
    damage: { num: 1, den: 10, type: "radiant" },
    range: { value: 100, long: 400 },
    properties: ["two", "burst-4", "reload-12"],
    mastery: "push",
    desc: "Mainline corporate frontline energy weapon capable of punching through hardened vehicle armor."
  },
  {
    id: "WpnHvyBowcaster1",
    name: "Heavy Bowcaster",
    file: "heavy-bowcaster.json",
    price: 1750, weight: 15.5, type: "martialR",
    damage: { num: 1, den: 12, type: "radiant" },
    range: { value: 90, long: 360 },
    properties: ["two", "burst-2", "high-recoil-str-17", "reload-4"],
    mastery: "topple",
    desc: "Formidable magnetic crossbow hybrid weapon firing superheated explosive plasma quarrels."
  },
  {
    id: "WpnShotgun000001",
    name: "Shotgun",
    file: "shotgun.json",
    price: 600, weight: 5, type: "martialR",
    damage: { num: 1, den: 10, type: "piercing" },
    range: { value: 60, long: 240 },
    properties: ["fin", "close-quarters", "reload-6"],
    mastery: "vex",
    auxActivity: {
      type: "save",
      name: "Scatter Blast",
      activation: { type: "action", value: 1, condition: "Expend 1 shell" },
      target: { template: { type: "cone", size: "15", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "dex", formula: "" } },
      damage: { parts: [{ number: 1, denomination: 10, types: ["piercing"] }] }
    },
    desc: "Reliable pump-action scattergun devastating in close quarters with cone spray capabilities."
  },
  {
    id: "WpnScattergun001",
    name: "Scattergun",
    file: "scattergun.json",
    price: 1000, weight: 7, type: "martialR",
    damage: { num: 2, den: 6, type: "radiant" },
    range: { value: 30, long: 90 },
    properties: ["two", "burst-2", "high-recoil-str-13", "reload-8"],
    mastery: "topple",
    desc: "Double-barreled energetic breacher discharging dual waves of searing plasma pellets."
  },
  {
    id: "WpnSniperRifle01",
    name: "Sniper Rifle",
    file: "sniper-rifle.json",
    price: 1200, weight: 12, type: "martialR",
    damage: { num: 1, den: 12, type: "piercing" },
    range: { value: 150, long: 600 },
    properties: ["hvy", "two", "high-recoil-str-11", "reload-2"],
    mastery: "slow",
    desc: "Extreme-range anti-materiel rifle equipped with ballistic trajectory computer."
  },
  {
    id: "WpnFusionRifle01",
    name: "Fusion Rifle",
    file: "fusion-rifle.json",
    price: 1000, weight: 8, type: "martialR",
    damage: { num: 2, den: 6, type: "radiant" },
    range: { value: 60, long: 180 },
    properties: ["two", "fin", "energy-projectiles", "lod", "reload-5"],
    mastery: "vex",
    desc: "High-density thermal energy beam rifle requiring brief magnetic spin-up charge."
  },
  {
    id: "WpnTraceRifle001",
    name: "Trace Rifle",
    file: "trace-rifle.json",
    price: 1100, weight: 6, type: "martialR",
    damage: { num: 1, den: 6, type: "radiant" },
    range: { value: 80, long: 240 },
    properties: ["two", "fin", "continuous-fire", "source-resonance", "reload-8"],
    mastery: "sap",
    desc: "Continuous-beam Notum laser rifle that leeches neural stability from the target."
  },

  // C. Heavy Ordnance Platforms (5)
  {
    id: "WpnLmgOrdnance01",
    name: "Light Machine Gun",
    file: "lmg.json",
    price: 1400, weight: 16, type: "martialR",
    damage: { num: 1, den: 10, type: "piercing" },
    range: { value: 80, long: 320 },
    properties: ["hvy", "two", "auto-5", "continuous-fire", "high-recoil-str-15", "reload-10"],
    mastery: "graze",
    auxActivity: {
      type: "save",
      name: "Auto Suppression",
      activation: { type: "action", value: 1, condition: "Expend 5 rounds" },
      target: { template: { type: "cube", size: "10", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "str", formula: "" } },
      damage: { parts: [{ number: 1, denomination: 10, types: ["piercing"] }] }
    },
    desc: "Heavy squad automatic weapon with belt-fed ammunition for sustained fire suppression."
  },
  {
    id: "WpnRotaryCannon1",
    name: "Rotary Auto-Cannon",
    file: "rotary-auto-cannon.json",
    price: 1500, weight: 22, type: "martialR",
    damage: { num: 2, den: 8, type: "radiant" },
    range: { value: 80, long: 320 },
    properties: ["hvy", "two", "auto-10", "high-recoil-str-13", "reload-20"],
    mastery: "graze",
    auxActivity: {
      type: "save",
      name: "Full Sweep Auto",
      activation: { type: "action", value: 1, condition: "Expend 10 cells" },
      target: { template: { type: "cone", size: "15", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "str", formula: "" } },
      damage: { parts: [{ number: 2, denomination: 8, types: ["radiant"] }] }
    },
    desc: "Motorized six-barrel plasma minigun laying down relentless sweeping fire."
  },
  {
    id: "WpnLinearRailgn1",
    name: "Linear Fusion Railgun",
    file: "linear-fusion-railgun.json",
    price: 1800, weight: 18, type: "martialR",
    damage: { num: 2, den: 8, type: "radiant" },
    range: { value: 150, long: 600 },
    properties: ["hvy", "two", "energy-projectiles", "high-recoil-str-15", "lod", "reload-3"],
    mastery: "topple",
    auxActivity: {
      type: "attack",
      name: "Kinetic Slug Mode",
      activation: { type: "action", value: 1, condition: "" },
      range: { value: "150", long: "600", units: "ft" },
      attack: { ability: "str", type: { value: "ranged", classification: "weapon" } },
      damage: { parts: [{ number: 3, denomination: 10, types: ["piercing"] }] }
    },
    desc: "Dual-mode electromagnetic rail accelerator firing concentrated beam bursts or hyper-dense kinetic slugs."
  },
  {
    id: "WpnHvyGrenadeLn1",
    name: "Heavy Grenade Launcher",
    file: "heavy-grenade-launcher.json",
    price: 1600, weight: 14, type: "martialR",
    damage: { num: 1, den: 10, type: "bludgeoning" },
    range: { value: 60, long: 180 },
    properties: ["hvy", "two", "lod", "payload-5", "reload-4"],
    mastery: "topple",
    auxActivity: {
      type: "save",
      name: "Payload Blast",
      activation: { type: "action", value: 1, condition: "" },
      target: { template: { type: "sphere", size: "5", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "dex", formula: "" } },
      damage: { parts: [{ number: 1, denomination: 10, types: ["fire"] }] }
    },
    desc: "Revolving magazine launcher hurling volatile explosive or thermal cannisters."
  },
  {
    id: "WpnHvyRocketPlt1",
    name: "Heavy Rocket Platform",
    file: "heavy-rocket-platform.json",
    price: 2000, weight: 20, type: "martialR",
    damage: { num: 2, den: 10, type: "fire" },
    range: { value: 100, long: 400 },
    properties: ["hvy", "two", "high-recoil-str-15", "lod", "payload-10", "reload-2"],
    mastery: "push",
    auxActivity: {
      type: "save",
      name: "Rocket Warhead Blast",
      activation: { type: "action", value: 1, condition: "" },
      target: { template: { type: "sphere", size: "10", units: "ft" }, affix: false },
      save: { ability: ["dex"], dc: { calculation: "dex", formula: "" } },
      damage: { parts: [{ number: 2, denomination: 10, types: ["fire"] }] }
    },
    desc: "Shoulder-mounted tracking rocket battery delivering high-yield demolition warheads."
  },

  // D. Simple Melee (10)
  {
    id: "WpnVibroStilett1",
    name: "Vibro-Stiletto",
    file: "vibro-stiletto.json",
    price: 50, weight: 1, type: "simpleM",
    damage: { num: 1, den: 4, type: "piercing" },
    properties: ["fin", "lgt", "thr"], range: { value: 20, long: 60 },
    mastery: "nick",
    desc: "Ultra-thin high-frequency vibrating dagger designed for weak-point penetration."
  },
  {
    id: "WpnVibroDart0001",
    name: "Vibro-Dart",
    file: "vibro-dart.json",
    price: 10, weight: 0.5, type: "simpleM",
    damage: { num: 1, den: 4, type: "piercing" },
    properties: ["fin", "hidden", "thr"], range: { value: 20, long: 60 },
    mastery: "sap",
    desc: "Concealed vibrating throwing needle for silent covert takedowns."
  },
  {
    id: "WpnVibroKnucklr1",
    name: "Vibro-Knuckler",
    file: "vibro-knuckler.json",
    price: 75, weight: 1, type: "simpleM",
    damage: { num: 1, den: 6, type: "bludgeoning" },
    properties: ["hidden", "lgt"],
    mastery: "nick",
    desc: "Ultrasonic knuckle duster transferring concussive shockwaves on unarmed impact."
  },
  {
    id: "WpnHandVibroAxe1",
    name: "Hand Vibro-Axe",
    file: "hand-vibro-axe.json",
    price: 75, weight: 2, type: "simpleM",
    damage: { num: 1, den: 6, type: "slashing" },
    properties: ["lgt", "thr"], range: { value: 20, long: 60 },
    mastery: "vex",
    desc: "Lightweight hatchet with an energized micro-serrated blade edge."
  },
  {
    id: "WpnThrowingHamm1",
    name: "Throwing Hammer",
    file: "throwing-hammer.json",
    price: 50, weight: 2, type: "simpleM",
    damage: { num: 1, den: 4, type: "bludgeoning" },
    properties: ["lgt", "thr"], range: { value: 20, long: 60 },
    mastery: "push",
    desc: "Balanced tungsten-weighted hammer effective in melee or short throws."
  },
  {
    id: "WpnStunBaton0001",
    name: "Stun Baton",
    file: "stun-baton.json",
    price: 100, weight: 2, type: "simpleM",
    damage: { num: 1, den: 6, type: "bludgeoning" },
    properties: ["fin", "shock"],
    mastery: "sap",
    desc: "Electrified riot suppression rod delivering debilitating neural shocks."
  },
  {
    id: "WpnTrenchClub001",
    name: "Tungsten Trench Club",
    file: "tungsten-trench-club.json",
    price: 25, weight: 4, type: "simpleM",
    damage: { num: 1, den: 6, type: "bludgeoning" },
    versatile: { num: 1, den: 8, type: "bludgeoning" },
    properties: ["ver"],
    mastery: "slow",
    desc: "Brutal solid-metal trench weapon built for crushing kinetic strikes in close quarters."
  },
  {
    id: "WpnVibroSpear001",
    name: "Vibro-Spear",
    file: "vibro-spear.json",
    price: 120, weight: 4, type: "simpleM",
    damage: { num: 1, den: 6, type: "piercing" },
    versatile: { num: 1, den: 8, type: "piercing" },
    properties: ["thr", "ver"], range: { value: 20, long: 60 },
    mastery: "push",
    desc: "Polearm tipped with a resonant sonic lance point."
  },
  {
    id: "WpnVibroStaff001",
    name: "Vibro-Staff",
    file: "vibro-staff.json",
    price: 100, weight: 4, type: "simpleM",
    damage: { num: 1, den: 6, type: "bludgeoning" },
    versatile: { num: 1, den: 8, type: "bludgeoning" },
    properties: ["ver"],
    mastery: "slow",
    desc: "Sturdy alloy quarterstaff fitted with dual-end sonic vibration generators."
  },
  {
    id: "WpnHvyVibroMace1",
    name: "Heavy Vibro-Mace",
    file: "heavy-vibro-mace.json",
    price: 150, weight: 7, type: "simpleM",
    damage: { num: 1, den: 10, type: "bludgeoning" },
    properties: ["hvy", "two"],
    mastery: "push",
    desc: "Massive two-handed kinetic demolition maul that vibrates through plate armor."
  },

  // E. Martial Melee (14)
  {
    id: "WpnConcealBlade1",
    name: "Concealed Forearm Blade",
    file: "concealed-forearm-blade.json",
    price: 75, weight: 1, type: "martialM",
    damage: { num: 1, den: 4, type: "piercing" },
    properties: ["fin", "fixed", "hidden", "lgt", "powered"],
    mastery: "nick",
    desc: "Spring-loaded wrist blade extending from an under-armor forearm bracer."
  },
  {
    id: "WpnMonofilWhip01",
    name: "Monofilament Vibro-Whip",
    file: "monofilament-vibro-whip.json",
    price: 275, weight: 3, type: "martialM",
    damage: { num: 1, den: 4, type: "slashing" },
    properties: ["fin", "reach", "powered"],
    mastery: "slow",
    desc: "Superheated molecular-wire whip capable of severing limbs at extended reach."
  },
  {
    id: "WpnVibroBlade001",
    name: "Vibro-Blade",
    file: "vibro-blade.json",
    price: 200, weight: 2, type: "martialM",
    damage: { num: 1, den: 6, type: "slashing" },
    properties: ["fin", "lgt", "powered"],
    mastery: "nick",
    desc: "Standard tactical combat shortsword equipped with an ultrasonic power pack."
  },
  {
    id: "WpnBrkrChakram01",
    name: "Breaker Chakram",
    file: "breaker-chakram.json",
    price: 175, weight: 3, type: "martialM",
    damage: { num: 1, den: 6, type: "slashing" },
    properties: ["fin", "returning", "thr", "powered"], range: { value: 30, long: 90 },
    mastery: "vex",
    desc: "Aerodynamic gyroscopic throwing disc with micro-thrusters returning it to the thrower."
  },
  {
    id: "WpnDuelingBlade1",
    name: "Dueling Blade",
    file: "dueling-blade.json",
    price: 350, weight: 2, type: "martialM",
    damage: { num: 1, den: 8, type: "piercing" },
    properties: ["fin", "powered"],
    mastery: "vex",
    desc: "Needle-sharp high-precision fencing blade with an energized harmonic core."
  },
  {
    id: "WpnVibroBroadsw1",
    name: "Vibro-Broadsword",
    file: "vibro-broadsword.json",
    price: 400, weight: 4, type: "martialM",
    damage: { num: 1, den: 8, type: "slashing" },
    versatile: { num: 1, den: 10, type: "slashing" },
    properties: ["ver", "powered"],
    mastery: "sap",
    desc: "Heavy military longsword with vibrating cutting edges that shears through bulkheads."
  },
  {
    id: "WpnWarhammer0001",
    name: "Warhammer",
    file: "warhammer.json",
    price: 350, weight: 5, type: "martialM",
    damage: { num: 1, den: 8, type: "bludgeoning" },
    versatile: { num: 1, den: 10, type: "bludgeoning" },
    properties: ["ver", "powered"],
    mastery: "push",
    desc: "Powered war hammer with kinetic discharge capacitor in the striking face."
  },
  {
    id: "WpnVibroTechstf1",
    name: "Vibro-Techstaff",
    file: "vibro-techstaff.json",
    price: 650, weight: 5, type: "martialM",
    damage: { num: 2, den: 4, type: "bludgeoning" },
    properties: ["two", "fin", "double-2d4", "powered"],
    mastery: "slow",
    auxActivity: {
      type: "attack",
      name: "Opposite End Strike",
      activation: { type: "bonus", value: 1, condition: "When attacking with primary end" },
      attack: { ability: "dex", type: { value: "melee", classification: "weapon" } },
      damage: { parts: [{ number: 2, denomination: 4, types: ["bludgeoning"] }] }
    },
    desc: "Martial double-ended staff featuring independent sonic generators at both ends."
  },
  {
    id: "WpnVibroTwinBld1",
    name: "Vibro-Twin-Blade",
    file: "vibro-twin-blade.json",
    price: 650, weight: 6, type: "martialM",
    damage: { num: 1, den: 8, type: "slashing" },
    properties: ["two", "fin", "double-1d8", "powered"],
    mastery: "cleave",
    auxActivity: {
      type: "attack",
      name: "Secondary Blade Strike",
      activation: { type: "bonus", value: 1, condition: "" },
      attack: { ability: "dex", type: { value: "melee", classification: "weapon" } },
      damage: { parts: [{ number: 1, denomination: 8, types: ["slashing"] }] }
    },
    desc: "Dual-bladed martial weapon requiring fluid martial coordination to spin and strike."
  },
  {
    id: "WpnVibroPike0001",
    name: "Vibro-Pike",
    file: "vibro-pike.json",
    price: 500, weight: 6, type: "martialM",
    damage: { num: 1, den: 10, type: "piercing" },
    properties: ["hvy", "reach", "two", "powered"],
    mastery: "topple",
    desc: "Long reaching tactical pike engineered to halt charging mechanized units."
  },
  {
    id: "WpnCleaverAxe001",
    name: "Motorized Cleaver Axe",
    file: "motorized-cleaver-axe.json",
    price: 650, weight: 8, type: "martialM",
    damage: { num: 1, den: 12, type: "slashing" },
    properties: ["hvy", "two", "powered"],
    mastery: "cleave",
    desc: "Colossal motorized greataxe with cycling teeth that chews through composite armor."
  },
  {
    id: "WpnBreakerMaul01",
    name: "Breaker Maul",
    file: "breaker-maul.json",
    price: 700, weight: 12, type: "martialM",
    damage: { num: 2, den: 6, type: "bludgeoning" },
    properties: ["hvy", "two", "powered"],
    mastery: "topple",
    desc: "Gigantic hydraulic maul delivering earthquake-level kinetic detonations."
  },
  {
    id: "WpnVibroClaymor1",
    name: "Vibro-Claymore",
    file: "vibro-claymore.json",
    price: 750, weight: 7, type: "martialM",
    damage: { num: 2, den: 6, type: "slashing" },
    properties: ["hvy", "two", "powered"],
    mastery: "graze",
    desc: "Enormous two-handed greatsword with full-blade ultrasonic edge frequency."
  },
  {
    id: "WpnElectroNet001",
    name: "Electro-Net",
    file: "electro-net.json",
    price: 150, weight: 3, type: "martialM",
    damage: { num: null, den: null, type: "" },
    properties: ["fin", "special", "thr"], range: { value: 15, long: 15 },
    mastery: "slow",
    desc: "Weighted monofilament capture net that electrocutes and restrains targets (escape DC 13 Str)."
  },

  // F. Source Weapons (13)
  {
    id: "WpnSrcDagger0001",
    name: "Source Dagger",
    file: "source-dagger.json",
    price: 300, weight: 1, type: "simpleM",
    damage: { num: 1, den: 4, type: "radiant" },
    properties: ["fin", "hidden", "lgt", "thr", "source-resonance"], range: { value: 20, long: 60 },
    mastery: "nick",
    desc: "Resonant Notum blade emitting a stabilized beam of plasma light."
  },
  {
    id: "WpnSrcShortbld01",
    name: "Source Shortblade",
    file: "source-shortblade.json",
    price: 400, weight: 1.5, type: "martialM",
    damage: { num: 1, den: 6, type: "radiant" },
    properties: ["fin", "hidden", "lgt", "source-resonance"],
    mastery: "vex",
    desc: "Agile Notum energy blade suited for rapid thrusts and deflections."
  },
  {
    id: "WpnSrcStaff00001",
    name: "Source Staff",
    file: "source-staff.json",
    price: 450, weight: 3, type: "simpleM",
    damage: { num: 1, den: 6, type: "radiant" },
    versatile: { num: 1, den: 8, type: "radiant" },
    properties: ["ver", "source-resonance"],
    mastery: "slow",
    desc: "Notum-focused conduit staff projecting energy halos from both crystal emitters."
  },
  {
    id: "WpnSrcHvyBaton01",
    name: "Source Heavy Baton",
    file: "source-heavy-baton.json",
    price: 400, weight: 5, type: "martialM",
    damage: { num: 1, den: 10, type: "radiant" },
    properties: ["hvy", "two", "source-resonance"],
    mastery: "push",
    desc: "Heavy energy-sheathed cudgel delivering bludgeoning thermal concussions."
  },
  {
    id: "WpnSrcRapier0001",
    name: "Source Rapier",
    file: "source-rapier.json",
    price: 600, weight: 2, type: "martialM",
    damage: { num: 1, den: 8, type: "radiant" },
    properties: ["fin", "hidden", "source-resonance"],
    mastery: "sap",
    desc: "Elegant dueling sword with an ultra-fine needle blade of pure coherent Notum light."
  },
  {
    id: "WpnSourceblade01",
    name: "Sourceblade",
    file: "sourceblade.json",
    price: 500, weight: 3, type: "martialM",
    damage: { num: 1, den: 8, type: "radiant" },
    versatile: { num: 1, den: 10, type: "radiant" },
    properties: ["fin", "ver", "source-resonance"],
    mastery: "vex",
    desc: "The quintessential Notum weapon—a balanced radiant blade cutting effortlessly through matter."
  },
  {
    id: "WpnSrcWhip000001",
    name: "Source Whip",
    file: "source-whip.json",
    price: 650, weight: 2, type: "martialM",
    damage: { num: 1, den: 4, type: "radiant" },
    properties: ["fin", "hidden", "reach", "source-resonance"],
    mastery: "slow",
    desc: "Luminescent ribbon of coherent plasma that coils around weapons and limbs."
  },
  {
    id: "WpnSrcPike000001",
    name: "Source Pike",
    file: "source-pike.json",
    price: 750, weight: 5, type: "martialM",
    damage: { num: 1, den: 10, type: "radiant" },
    properties: ["hvy", "reach", "two", "source-resonance"],
    mastery: "topple",
    desc: "Extended ceremonial and battle polearm tipped with a blazing radiant spearhead."
  },
  {
    id: "WpnSrcCleaver001",
    name: "Source Cleaver",
    file: "source-cleaver.json",
    price: 850, weight: 6, type: "martialM",
    damage: { num: 1, den: 12, type: "radiant" },
    properties: ["hvy", "two", "source-resonance"],
    mastery: "cleave",
    desc: "Brutal broad-headed heavy axe blazing with superheated Notum energy."
  },
  {
    id: "WpnSrcClaymore01",
    name: "Source Claymore",
    file: "source-claymore.json",
    price: 800, weight: 6, type: "martialM",
    damage: { num: 2, den: 6, type: "radiant" },
    properties: ["hvy", "two", "source-resonance"],
    mastery: "graze",
    desc: "Massive two-handed greatsword projecting a 5-foot-long coherent energy blade."
  },
  {
    id: "WpnSrcTwinShoto1",
    name: "Source Twin-Shoto",
    file: "source-twin-shoto.json",
    price: 900, weight: 3.5, type: "martialM",
    damage: { num: 1, den: 6, type: "radiant" },
    properties: ["fin", "lgt", "double-1d6", "source-resonance"],
    mastery: "nick",
    auxActivity: {
      type: "attack",
      name: "Secondary Shoto Strike",
      activation: { type: "bonus", value: 1, condition: "" },
      attack: { ability: "dex", type: { value: "melee", classification: "weapon" } },
      damage: { parts: [{ number: 1, denomination: 6, types: ["radiant"] }] }
    },
    desc: "Paired light energy blades joined at the hilt for lightning-fast acrobatic strikes."
  },
  {
    id: "WpnSrcTwinBlade1",
    name: "Source Twin-Blade",
    file: "source-twin-blade.json",
    price: 1000, weight: 7, type: "martialM",
    damage: { num: 1, den: 8, type: "radiant" },
    properties: ["two", "double-1d8", "source-resonance"],
    mastery: "cleave",
    auxActivity: {
      type: "attack",
      name: "Secondary Blade Strike",
      activation: { type: "bonus", value: 1, condition: "" },
      attack: { ability: "str", type: { value: "melee", classification: "weapon" } },
      damage: { parts: [{ number: 1, denomination: 8, types: ["radiant"] }] }
    },
    desc: "Long two-handed staff weapon projecting full-length radiant energy blades from both ends."
  },
  {
    id: "WpnInterSplitSb1",
    name: "Interlocking Splitsaber",
    file: "interlocking-splitsaber.json",
    price: 1200, weight: 4, type: "martialM",
    damage: { num: 1, den: 8, type: "radiant" },
    versatile: { num: 1, den: 10, type: "radiant" },
    properties: ["fin", "double-1d8", "interlocking", "source-resonance", "ver"],
    mastery: "vex",
    desc: "Exotic twin energy blades that can lock together into a double-blade or detach into two weapons."
  }
];

// ---------------------------------------------------------------------------
// 2. ARMOR & SHIELDS (15 items)
// ---------------------------------------------------------------------------
const ARMOR_DATA = [
  // Light Armor
  {
    id: "ArmCombatJumps01",
    name: "Combat Jumpsuit",
    file: "combat-jumpsuit.json",
    price: 50, weight: 6, type: "light",
    ac: 11, dex: null, stealthDisadv: false, strength: null,
    desc: "Standard durable utility flight suit woven with kinetic ballistic threading."
  },
  {
    id: "ArmKinetWeaveV01",
    name: "Kinetic Weave Vest",
    file: "kinetic-weave-vest.json",
    price: 150, weight: 8, type: "light",
    ac: 11, dex: null, stealthDisadv: false, strength: null,
    desc: "Reinforced torso vest engineered to disperse shockwaves from projectile rounds."
  },
  {
    id: "ArmInfiltSteal01",
    name: "Infiltration Stealth Suit",
    file: "infiltration-stealth-suit.json",
    price: 450, weight: 10, type: "light",
    ac: 12, dex: null, stealthDisadv: false, strength: null,
    desc: "High-tech form-fitting mesh suit coated in radar-absorbent chameleon polymers."
  },

  // Medium Armor
  {
    id: "ArmMeshScoutArm1",
    name: "Mesh Scout Armor",
    file: "mesh-scout-armor.json",
    price: 100, weight: 12, type: "medium",
    ac: 12, dex: 2, stealthDisadv: false, strength: null,
    desc: "Lightweight flexible mesh armor tailored for reconnaissance scouts in rough terrain."
  },
  {
    id: "ArmTactCombatR01",
    name: "Tactical Combat Rig",
    file: "tactical-combat-rig.json",
    price: 250, weight: 18, type: "medium",
    ac: 13, dex: 2, stealthDisadv: false, strength: null,
    desc: "Segmented ballistic plates mounted on load-bearing tactical webbing."
  },
  {
    id: "ArmReinfBattle01",
    name: "Reinforced Battle Vest",
    file: "reinforced-battle-vest.json",
    price: 500, weight: 25, type: "medium",
    ac: 14, dex: 2, stealthDisadv: true, strength: null,
    desc: "Heavy ballistic-plated vest with shoulder and throat gorgets; noisy under quick movements."
  },
  {
    id: "ArmPolymerComb01",
    name: "Polymer Combat Armor",
    file: "polymer-combat-armor.json",
    price: 800, weight: 20, type: "medium",
    ac: 14, dex: 2, stealthDisadv: false, strength: null,
    desc: "State-of-the-art synthetic polymer carapace providing superior defense without noise penalty."
  },
  {
    id: "ArmCeramicCara01",
    name: "Ceramic-Plated Carapace",
    file: "ceramic-plated-carapace.json",
    price: 1500, weight: 30, type: "medium",
    ac: 15, dex: 2, stealthDisadv: true, strength: null,
    desc: "Dense interlocking heat-resistant ceramic plates designed to absorb blaster fire."
  },

  // Heavy Armor
  {
    id: "ArmComposField01",
    name: "Composite Field Plate",
    file: "composite-field-plate.json",
    price: 300, weight: 40, type: "heavy",
    ac: 14, dex: 0, stealthDisadv: true, strength: 13,
    desc: "Full suit of molded composite alloy plates worn over an environmentally sealed undersuit."
  },
  {
    id: "ArmAlloyShockT01",
    name: "Alloy Shock Trooper Suit",
    file: "alloy-shock-trooper-suit.json",
    price: 800, weight: 45, type: "heavy",
    ac: 16, dex: 0, stealthDisadv: true, strength: 13,
    desc: "Frontline stormtrooper heavy armor with impact dampeners and hydraulic seal clamps."
  },
  {
    id: "ArmPowerAssault1",
    name: "Powered Assault Exosuit",
    file: "powered-assault-exosuit.json",
    price: 1800, weight: 55, type: "heavy",
    ac: 17, dex: 0, stealthDisadv: true, strength: 15,
    desc: "Motorized exoskeleton suit reinforcing armor thickness and assisting heavy load movement."
  },
  {
    id: "ArmDreadnought01",
    name: "Dreadnought Heavy Rig",
    file: "dreadnought-heavy-rig.json",
    price: 3500, weight: 65, type: "heavy",
    ac: 18, dex: 0, stealthDisadv: true, strength: 15,
    desc: "Maximum heavy defense plating engineered to withstand direct anti-tank and orbital ordnance hits."
  },

  // Shields
  {
    id: "ArmPhysRiotShld1",
    name: "Physical Riot Shield",
    file: "physical-riot-shield.json",
    price: 100, weight: 6, type: "shield",
    ac: 2, dex: null, stealthDisadv: false, strength: null,
    desc: "Curved clear polycarbonate ballistic shield equipped with a viewing viewport."
  },
  {
    id: "ArmHardLightShl1",
    name: "Hard-Light Shield Emitter",
    file: "hard-light-shield-emitter.json",
    price: 350, weight: 2, type: "shield",
    ac: 2, dex: null, stealthDisadv: false, strength: null,
    desc: "Forearm-mounted projector that deploys a solid-energy hard-light buckler instantly."
  },
  {
    id: "ArmHvyBulwarkSh1",
    name: "Heavy Bulwark Tower Shield",
    file: "heavy-bulwark-tower-shield.json",
    price: 500, weight: 15, type: "shield",
    ac: 2, dex: null, stealthDisadv: true, strength: 15,
    desc: "Massive titanium tower shield granting +2 AC, plus +1 Cover AC against ranged attacks."
  }
];

// ---------------------------------------------------------------------------
// 3. GEAR, CONSUMABLES & TOOLS (24 items)
// ---------------------------------------------------------------------------
const GEAR_DATA = [
  // Ammunition & Power (5)
  {
    id: "GearBlastPowerC1",
    name: "Blaster Power Cell",
    file: "blaster-power-cell.json",
    price: 10, weight: 1, type: "consumable", subtype: "ammo",
    quantity: 30,
    desc: "Standard energetic power magazine containing 30 charges for blaster and laser weapons."
  },
  {
    id: "GearHvyPowerPak1",
    name: "Heavy Power Pack",
    file: "heavy-power-pack.json",
    price: 35, weight: 3, type: "consumable", subtype: "ammo",
    quantity: 50,
    desc: "High-capacity external battery pack containing 50 charges for heavy ordnance and continuous-beam weapons."
  },
  {
    id: "GearSlugMagazin1",
    name: "Slug Magazine",
    file: "slug-magazine.json",
    price: 15, weight: 1, type: "consumable", subtype: "ammo",
    quantity: 20,
    desc: "Detachable box magazine loaded with 20 high-velocity armor-piercing kinetic rounds."
  },
  {
    id: "GearSniperCartr1",
    name: "Sniper Heavy Cartridges",
    file: "sniper-heavy-cartridges.json",
    price: 30, weight: 1, type: "consumable", subtype: "ammo",
    quantity: 6,
    desc: "Match-grade long-range ballistic cartridges designed for anti-materiel sniper rifles."
  },
  {
    id: "GearMissileOrdn1",
    name: "Missile Ordnance",
    file: "missile-ordnance.json",
    price: 100, weight: 2, type: "consumable", subtype: "ammo",
    quantity: 1,
    desc: "Smart-guided high-explosive micro-missile warhead for rocket launchers."
  },

  // Medical Supplies (4)
  {
    id: "GearTraumaMedpc1",
    name: "Trauma Medpac",
    file: "trauma-medpac.json",
    price: 50, weight: 1, type: "consumable", subtype: "potion",
    uses: { spent: 0, recovery: [], max: "3" },
    activity: {
      type: "heal",
      name: "Stabilize and Treat",
      activation: { type: "action", value: 1, condition: "" },
      healing: { types: ["healing"], custom: { enabled: true, formula: "1d4 + 2" } }
    },
    desc: "Emergency field surgery kit containing sterile coagulation foam, sutures, and stims. 3 uses."
  },
  {
    id: "GearBioticStim01",
    name: "Biotic Stim Injector",
    file: "biotic-stim-injector.json",
    price: 75, weight: 0.5, type: "consumable", subtype: "potion",
    uses: { spent: 0, recovery: [], max: "1" },
    activity: {
      type: "heal",
      name: "Inject Stim",
      activation: { type: "bonus", value: 1, condition: "" },
      healing: { types: ["healing"], custom: { enabled: true, formula: "2d4 + 2" } }
    },
    desc: "High-potency epinephrine and antitoxin auto-injector. Heals 2d4 + 2 HP and cleanses the Poisoned condition."
  },
  {
    id: "GearCellNaniteS1",
    name: "Cellular Nanite Salve",
    file: "cellular-nanite-salve.json",
    price: 150, weight: 0.5, type: "consumable", subtype: "potion",
    uses: { spent: 0, recovery: [], max: "1" },
    activity: {
      type: "heal",
      name: "Apply Salve",
      activation: { type: "minute", value: 1, condition: "" },
      healing: { types: ["healing"], custom: { enabled: true, formula: "4d4 + 4" } }
    },
    desc: "Medical nanite paste that rapidly reconstructs cellular damage. Restores 4d4 + 4 HP and removes 1 Exhaustion level."
  },
  {
    id: "GearEmergDefibr1",
    name: "Emergency Defibrillator",
    file: "emergency-defibrillator.json",
    price: 250, weight: 4, type: "consumable", subtype: "potion",
    uses: { spent: 0, recovery: [], max: "1" },
    activity: {
      type: "utility",
      name: "Revive Patient",
      activation: { type: "action", value: 1, condition: "Target died within 1 minute" }
    },
    desc: "Automated cardiac resuscitation unit. Revives a creature that has died within the last minute, bringing them back with 1 HP."
  },

  // Exploration & Comms (7)
  {
    id: "GearBioScanner01",
    name: "Bio-Scanner",
    file: "bio-scanner.json",
    price: 200, weight: 2, type: "loot",
    desc: "Handheld sensory device tracking life signs, toxic atmospheres, and genetic signatures within 300 feet."
  },
  {
    id: "GearCommlink0001",
    name: "Commlink",
    file: "commlink.json",
    price: 100, weight: 0.5, type: "loot",
    desc: "Encrypted personal ear-mounted communicator with orbital relay and sub-space channel capabilities."
  },
  {
    id: "GearFieldHolom01",
    name: "Field Holomap",
    file: "field-holomap.json",
    price: 150, weight: 1, type: "loot",
    desc: "Topographical projection pad rendering real-time 3D orbital radar terrain and underground cavern maps."
  },
  {
    id: "GearPlasmaFlare1",
    name: "Plasma Flare Pack",
    file: "plasma-flare-pack.json",
    price: 20, weight: 1, type: "consumable",
    uses: { spent: 0, recovery: [], max: "4" },
    desc: "Pack of 4 high-intensity magnesium-plasma flares illuminating a 100-foot radius for 1 hour."
  },
  {
    id: "GearMagGrappleG1",
    name: "Magnetic Grapple Gun",
    file: "magnetic-grapple-gun.json",
    price: 100, weight: 3, type: "loot",
    desc: "Pneumatic launcher equipped with 100 feet of high-tensile monofilament line and magnetic clamp head."
  },
  {
    id: "GearRebreatherM1",
    name: "Rebreather Mask",
    file: "rebreather-mask.json",
    price: 120, weight: 2, type: "equipment",
    desc: "Compact sealed full-face mask providing 8 hours of recirculated oxygen in vacuum or toxic atmospheres."
  },
  {
    id: "GearThermCloak01",
    name: "Thermal Field Cloak",
    file: "thermal-field-cloak.json",
    price: 150, weight: 3, type: "equipment",
    desc: "Insulating thermal cloak granting Advantage on saving throws against extreme hot or cold environmental weather."
  },

  // Professional Tool Kits (8)
  {
    id: "ToolArmorers0001",
    name: "Armorer's Tools",
    file: "armorers-tools.json",
    price: 100, weight: 10, type: "tool",
    desc: "Heavy riveting hammers, alloy plates, and heating clamps required to forge and service powered and heavy armor."
  },
  {
    id: "ToolBioMedKit001",
    name: "Bio-Med Kit",
    file: "bio-med-kit.json",
    price: 150, weight: 5, type: "tool",
    desc: "Specialized biotechnology and genetic diagnostics toolkit for culturing serums and analyzing foreign pathogens."
  },
  {
    id: "ToolDemolitions1",
    name: "Demolitions Kit",
    file: "demolitions-kit.json",
    price: 200, weight: 8, type: "tool",
    desc: "Detonators, shape-charge liners, timer ciphers, and defusal probes used to place and disarm heavy ordnance."
  },
  {
    id: "ToolHackersKit01",
    name: "Hacker's Cyber-Kit",
    file: "hackers-cyber-kit.json",
    price: 250, weight: 4, type: "tool",
    desc: "Portable cyber-deck, optical splice cables, and protocol spoofers used to breach corporate mainframe terminals."
  },
  {
    id: "ToolMechanicsRg1",
    name: "Mechanic's Rig",
    file: "mechanics-rig.json",
    price: 150, weight: 12, type: "tool",
    desc: "Wrench set, plasma blowtorch, diagnostic scanners, and hydraulic lifters for ground vehicles and automatons."
  },
  {
    id: "ToolSecurityKit1",
    name: "Security Bypass Kit",
    file: "security-bypass-kit.json",
    price: 100, weight: 2, type: "tool",
    desc: "Electromagnetic pick set, cipher decoders, and laser diffraction shims used to open electronic and mechanical locks."
  },
  {
    id: "ToolDisguiseKit1",
    name: "Disguise & Spoofing Kit",
    file: "disguise-spoofing-kit.json",
    price: 75, weight: 3, type: "tool",
    desc: "Synthetic skin grafts, holographic identity chips, voice modulators, and cosmetics for espionage impersonation."
  },
  {
    id: "ToolGamingSet001",
    name: "Sabacc / Holo-Dice Set",
    file: "gaming-set.json",
    price: 25, weight: 1, type: "tool",
    desc: "Set of holographic betting dice and electronic shifting Sabacc card decks for games of chance."
  }
];

// ---------------------------------------------------------------------------
// 4. HARDWARE MODS (19 items)
// ---------------------------------------------------------------------------
const MODS_DATA = [
  // Weapon Mods (13)
  {
    id: "ModBoxBreathing1",
    name: "Box Breathing",
    file: "box-breathing.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Optics Mod, 1 slot)</p><p>When you haven't moved on your turn and make a ranged weapon attack with Advantage, you can roll one additional weapon damage die on a hit.</p>"
  },
  {
    id: "ModDemolition001",
    name: "Demolitionist",
    file: "demolitionist.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Recycler Mod, 1 slot)</p><p>Whenever you reduce a hostile creature to 0 HP with this weapon, you regain 1 Nanopool point, or your next grenade/payload attack deals an extra 1d8 damage.</p>"
  },
  {
    id: "ModFiringLine001",
    name: "Firing Line",
    file: "firing-line.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Targeting Mesh, 1 slot)</p><p>You gain a +1 bonus to attack and damage rolls with this weapon while you are within 15 feet of at least two conscious allies.</p>"
  },
  {
    id: "ModHeadseeker001",
    name: "Headseeker",
    file: "headseeker.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Burst Compensator, 1 slot)</p><p>When firing in Burst mode, you can reroll any 1s and 2s rolled on the weapon damage dice once.</p>"
  },
  {
    id: "ModOneTwoPunch01",
    name: "One-Two Punch",
    file: "one-two-punch.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (CQC Link, 1 slot)</p><p>Hitting a creature with this weapon at range primes them; your next melee attack against that target before the end of your next turn deals an additional 1d6 kinetic damage.</p>"
  },
  {
    id: "ModSurrounded001",
    name: "Surrounded",
    file: "surrounded.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Threat Matrix Sensor, 1 slot)</p><p>While two or more hostile creatures are within 10 feet of you, this weapon scores a critical hit on a roll of 19–20.</p>"
  },
  {
    id: "ModTapTrigger001",
    name: "Tap the Trigger",
    file: "tap-the-trigger.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Pre-Ignition Chamber, 1 slot)</p><p>If you draw this weapon at the start of your turn, you have Advantage on your first attack roll made with it during that turn.</p>"
  },
  {
    id: "ModTrenchBarrel1",
    name: "Trench Barrel",
    file: "trench-barrel.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Thermal Edge Regulator, 1 slot)</p><p>Hitting a target with a melee attack grants a +2 bonus to ranged weapon damage rolls with this weapon until the end of your next turn.</p>"
  },
  {
    id: "ModVorpalCore001",
    name: "Vorpal Core",
    file: "vorpal-core.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Penetrator Mod, 1 slot)</p><p>This weapon deals an additional 1d8 damage when striking Elite, Legendary, Huge, or Gargantuan targets.</p>"
  },
  {
    id: "ModTransmatTeth1",
    name: "Transmat Tether",
    file: "transmat-tether.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Micro-Beacon, 1 slot)</p><p>As a Free Object Interaction, you can remotely transmat this weapon back into your open hand if it is within 60 feet and you have line of sight to it.</p>"
  },
  {
    id: "ModClusterMunit1",
    name: "Cluster Munitions",
    file: "cluster-munitions.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Launcher Mod, 1 slot)</p><p>Creatures that fail their Dexterity saving throw against this weapon's Payload blast take an additional 1d8 explosive damage from secondary submunitions.</p>"
  },
  {
    id: "ModImpactCasing1",
    name: "Impact Casing",
    file: "impact-casing.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Direct-Fire Sabot, 1 slot)</p><p>When you hit a single creature directly with a payload attack, they automatically fail their saving throw and take an extra 2d8 kinetic damage.</p>"
  },
  {
    id: "ModTrackingGuid1",
    name: "Tracking Smart Guidance",
    file: "tracking-smart-guidance.json",
    desc: "<p><strong>Type:</strong> Weapon Mod (Sensor Suite, 1 slot)</p><p>Targets within the primary blast zone have Disadvantage on saving throws against this weapon's Payload area effect.</p>"
  },

  // Armor Mods (6)
  {
    id: "ModAblativeWeav1",
    name: "Ablative Nanite Weave",
    file: "ablative-nanite-weave.json",
    desc: "<p><strong>Type:</strong> Armor Mod (1 slot, Any Armor)</p><p>Upon completing a Short or Long Rest, you gain Temporary Hit Points equal to your Character Level + your Constitution modifier.</p>"
  },
  {
    id: "ModAdrenalPaced1",
    name: "Adrenal Paced Injector",
    file: "adrenal-paced-injector.json",
    desc: "<p><strong>Type:</strong> Armor Mod (1 slot, Light or Medium Armor)</p><p>You gain a permanent +10 feet bonus to your base walking speed and a +2 bonus to Initiative rolls.</p>"
  },
  {
    id: "ModKineticPlat01",
    name: "Kinetic Absorption Plating",
    file: "kinetic-absorption-plating.json",
    desc: "<p><strong>Type:</strong> Armor Mod (2 slots, Medium or Heavy Armor)</p><p>You gain Damage Reduction 3 (DR 3) against all non-magical kinetic (bludgeoning, piercing, and slashing) damage.</p>"
  },
  {
    id: "ModHardLightDis1",
    name: "Hard-Light Displacement Matrix",
    file: "hard-light-displacement-matrix.json",
    desc: "<p><strong>Type:</strong> Armor Mod (2 slots, Heavy Armor)</p><p>Holographic refraction decoys activate upon combat entry: all attack rolls made against you have Disadvantage during the first round of combat.</p>"
  },
  {
    id: "ModEmergMedByp01",
    name: "Emergency Med Bypass",
    file: "emergency-med-bypass.json",
    desc: "<p><strong>Type:</strong> Armor Mod (2 slots, Any Armor)</p><p>When you are reduced to 0 Hit Points, you drop to 1 Hit Point instead and can immediately use your Reaction to take the Disengage action. (1/Long Rest).</p>"
  },
  {
    id: "ModNotumConduit1",
    name: "Notum Conduit Weave",
    file: "notum-conduit-weave.json",
    desc: "<p><strong>Type:</strong> Armor Mod (1 slot, Light or Medium Armor)</p><p>Notum conducting filaments stabilize your neural focus: you have Advantage on Constitution saving throws made to maintain Concentration on nanoprograms.</p>"
  }
];

// ---------------------------------------------------------------------------
// 5. EXECUTION
// ---------------------------------------------------------------------------

console.log("=== Building Suns of Rubi: Weapons ===");
ensureDir("src/items/weapons");

for (const w of WEAPONS_DATA) {
  const activities = {};

  // Standard Attack Activity
  const isRanged = w.type.endsWith("R");
  const isThrown = w.properties.includes("thr");
  const hasFinesse = w.properties.includes("fin");

  activities.mainAttack000001 = {
    _id: "mainAttack000001",
    type: "attack",
    name: "Strike",
    activation: { type: "action", value: 1, condition: "" },
    duration: { units: "inst", value: "" },
    range: {
      value: w.range ? String(w.range.value) : "5",
      long: w.range?.long ? String(w.range.long) : "",
      units: "ft"
    },
    target: { template: { contiguous: false, units: "ft" }, affix: false, count: 1, type: "creature" },
    attack: {
      ability: isRanged ? "dex" : (hasFinesse ? "" : "str"),
      bonus: "",
      critical: { threshold: 20 },
      flat: false,
      type: {
        value: isRanged ? "ranged" : "melee",
        classification: "weapon"
      }
    },
    damage: {
      critical: { bonus: "" },
      includeBase: true,
      parts: []
    },
    roll: { prompt: false, visible: false },
    uses: { spent: 0, recovery: [], max: "" }
  };

  if (w.auxActivity) {
    const auxId = "auxActivity00001";
    activities[auxId] = {
      _id: auxId,
      ...w.auxActivity
    };
  }

  const doc = {
    _id: w.id,
    name: w.name,
    type: "weapon",
    img: isRanged
      ? "icons/weapons/guns/gun-blaster-laser-silver.webp"
      : (w.properties.includes("source-resonance")
        ? "icons/weapons/swords/sword-blade-energy-glowing-blue.webp"
        : "icons/weapons/swords/sword-broad-serrated-blue.webp"),
    system: {
      description: {
        value: `<p>${w.desc}</p>`,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      price: {
        value: w.price,
        denomination: "cr"
      },
      weight: {
        value: w.weight,
        units: "lb"
      },
      type: {
        value: w.type,
        baseItem: w.file.replace(".json", "")
      },
      damage: {
        base: w.damage.num ? {
          number: w.damage.num,
          denomination: w.damage.den,
          types: [w.damage.type]
        } : { number: null, denomination: null, types: [] },
        versatile: w.versatile ? {
          number: w.versatile.num,
          denomination: w.versatile.den,
          types: [w.versatile.type]
        } : { number: null, denomination: null, types: [] }
      },
      range: {
        value: w.range ? w.range.value : 5,
        long: w.range?.long || null,
        units: "ft"
      },
      mastery: w.mastery,
      properties: w.properties,
      activities
    }
  };

  write(`src/items/weapons/${w.file}`, doc);
}

console.log("\n=== Building Suns of Rubi: Armor & Shields ===");
ensureDir("src/items/armor");

for (const a of ARMOR_DATA) {
  const isShield = a.type === "shield";
  const properties = [];
  if (a.stealthDisadv) properties.push("stealthDisadvantage");

  const doc = {
    _id: a.id,
    name: a.name,
    type: "equipment",
    img: isShield
      ? "icons/equipment/shield/heater-crystal-energy-blue.webp"
      : "icons/equipment/chest/breastplate-metal-banded-grey.webp",
    system: {
      description: {
        value: `<p>${a.desc}</p>`,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      price: {
        value: a.price,
        denomination: "cr"
      },
      weight: {
        value: a.weight,
        units: "lb"
      },
      type: {
        value: a.type,
        baseItem: a.file.replace(".json", "")
      },
      armor: {
        value: a.ac,
        dex: a.dex
      },
      strength: a.strength,
      properties,
      equipped: false,
      activities: {}
    }
  };

  write(`src/items/armor/${a.file}`, doc);
}

console.log("\n=== Building Suns of Rubi: Field Gear & Ammo ===");
ensureDir("src/items/gear");

for (const g of GEAR_DATA) {
  const activities = {};
  if (g.activity) {
    activities.actGearPrimary01 = {
      _id: "actGearPrimary01",
      ...g.activity
    };
  }

  const doc = {
    _id: g.id,
    name: g.name,
    type: g.type,
    img: g.type === "tool"
      ? "icons/tools/instruments/multitool-electronic.webp"
      : (g.subtype === "ammo"
        ? "icons/weapons/ammunition/bullets-cartridges-brass.webp"
        : (g.subtype === "potion"
          ? "icons/consumables/potions/vial-cork-liquid-glowing-green.webp"
          : "icons/commodities/tech/sensor-blue.webp")),
    system: {
      description: {
        value: `<p>${g.desc}</p>`,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      price: {
        value: g.price,
        denomination: "cr"
      },
      weight: {
        value: g.weight,
        units: "lb"
      },
      quantity: g.quantity || 1,
      uses: g.uses || { spent: 0, recovery: [], max: "" },
      activities
    }
  };

  if (g.type === "consumable" && g.subtype) {
    doc.system.type = { value: g.subtype };
  } else if (g.type === "tool") {
    doc.system.type = { value: "specialist", baseItem: g.file.replace(".json", "") };
  }

  write(`src/items/gear/${g.file}`, doc);
}

console.log("\n=== Building Suns of Rubi: Hardware Mods ===");
ensureDir("src/items/hardware-mods");

for (const m of MODS_DATA) {
  const doc = {
    _id: m.id,
    name: m.name,
    type: "equipment",
    img: "icons/commodities/tech/chip-integrated-glowing-blue.webp",
    system: {
      description: {
        value: m.desc,
        chat: ""
      },
      source: {
        custom: "Suns of Rubi",
        book: "Suns of Rubi Core Rulebook",
        rules: "2024"
      },
      price: {
        value: 250,
        denomination: "cr"
      },
      weight: {
        value: 0.1,
        units: "lb"
      },
      type: {
        value: "trinket",
        subtype: "hardware-mod"
      },
      equipped: false,
      activities: {}
    }
  };

  write(`src/items/hardware-mods/${m.file}`, doc);
}

console.log("\n✔ Equipment package build complete.");
