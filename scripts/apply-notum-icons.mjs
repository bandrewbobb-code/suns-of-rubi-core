import fs from "fs";
import path from "path";

const ICONS_DIR = path.join("assets", "icons", "nanos");
const TIER_DIRS = [
  path.join("src", "nanoprograms", "tier-0"),
  path.join("src", "nanoprograms", "tier-1")
];

// Fallback school-to-discipline mapping
const SCHOOL_TO_DISCIPLINE = {
  abj: "mattermet",
  con: "mattercre",
  div: "sensoryimp",
  enc: "psychmod",
  evo: "mattercre",
  ill: "sensoryimp",
  nec: "biomet",
  trs: "mattermet"
};

// Keyword-based discipline inference for finer matching
function inferDiscipline(name, school, desc) {
  const text = `${name} ${desc}`.toLowerCase();
  
  // Time/Space
  if (/\b(grav|gravity|chute|fall|speed|sprint|leap|teleport|time|spatial|inertia|slipstream)\b/.test(text)) {
    return "timespace";
  }
  // Bio Met
  if (/\b(heal|hp|hit point|stim|bandage|cellular|cure|toxin|poison|decontaminate|vital|rupture|blood|organic|biotin)\b/.test(text)) {
    return "biomet";
  }
  // Sensory Imp
  if (/\b(scan|sensor|telemetry|detect|lock|paint|sight|vision|alarm|mask|stealth|perception|hologram|radar)\b/.test(text)) {
    return "sensoryimp";
  }
  // Psych Mod
  if (/\b(mind|mental|fear|fright|charm|sleep|stress|speech|taunt|ego|demotivat|will|spasm|psychic)\b/.test(text)) {
    return "psychmod";
  }
  // Matter Met
  if (/\b(armor|shield|barrier|plate|deflect|density|hardness|fortify|megaboost)\b/.test(text)) {
    return "mattermet";
  }
  // Matter Cre
  if (/\b(blast|bolt|plasma|laser|fire|torch|ice|chill|acid|flechette|shrapnel|tesla|shock|spark)\b/.test(text)) {
    return "mattercre";
  }

  return SCHOOL_TO_DISCIPLINE[school] || "mattercre";
}

let specificCount = 0;
let plateCount = 0;

for (const dir of TIER_DIRS) {
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const slug = path.basename(file, ".json");
    const doc = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const specificIconPath = path.join(ICONS_DIR, `${slug}.webp`);
    if (fs.existsSync(specificIconPath)) {
      doc.img = `modules/suns-of-rubi-core/assets/icons/nanos/${slug}.webp`;
      specificCount++;
    } else {
      const disc = inferDiscipline(doc.name, doc.system.school, doc.system.description?.value || "");
      doc.img = `modules/suns-of-rubi-core/assets/icons/nanos/plate-${disc}.webp`;
      plateCount++;
    }

    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf8");
  }
}

console.log(`Updated nanoprograms icons:`);
console.log(`- Specific glyph icons: ${specificCount}`);
console.log(`- Discipline plate fallbacks: ${plateCount}`);
console.log(`- Total: ${specificCount + plateCount}`);
