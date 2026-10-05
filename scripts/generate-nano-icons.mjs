import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUTPUT_DIR = "assets/icons/nanos";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 1. Discipline Palettes
const DISCIPLINES = {
  biomet: { color: "#00E676", core: "#051A10", label: "Bio Met" },
  mattercre: { color: "#FF1744", core: "#1A0508", label: "Matter Cre" },
  mattermet: { color: "#00B0FF", core: "#05121A", label: "Matter Met" },
  psychmod: { color: "#D500F9", core: "#16051A", label: "Psych Mod" },
  timespace: { color: "#FFD600", core: "#1A1705", label: "Time/Space" },
  sensoryimp: { color: "#00E5FF", core: "#05181A", label: "Sensory Imp" }
};

// 2. Procedural SVG Notum Disc Template
function generatePlateSVG(accentColor, coreColor) {
  return `
  <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
        <stop offset="65%" stop-color="${coreColor}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#080B10" stop-opacity="1"/>
      </radialGradient>
      <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Outer Octagonal Ring -->
    <polygon points="76,14 180,14 242,76 242,180 180,242 76,242 14,180 14,76" 
             fill="#0E121A" stroke="#1F2838" stroke-width="4"/>

    <!-- Inner Notum Reactor Chamber -->
    <polygon points="80,24 176,24 232,80 232,176 176,232 80,232 24,176 24,80" 
             fill="url(#coreGlow)" stroke="${accentColor}" stroke-width="3" filter="url(#bloom)"/>

    <!-- Circuit Inlays -->
    <path d="M 40 80 L 70 80 L 90 60 L 166 60 L 186 80 L 216 80" stroke="${accentColor}" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M 40 176 L 70 176 L 90 196 L 166 196 L 186 176 L 216 176" stroke="${accentColor}" stroke-width="1.5" fill="none" opacity="0.4"/>
    <circle cx="128" cy="128" r="82" stroke="${accentColor}" stroke-width="1" stroke-dasharray="8 6" fill="none" opacity="0.5"/>
    <circle cx="128" cy="128" r="70" stroke="${accentColor}" stroke-width="1.5" fill="none" opacity="0.8"/>
  </svg>
  `;
}

// 3. Built-In Base Vector Glyphs (Scalable, Crisp, 100% Commercial Safe)
const BUILTIN_GLYPHS = {
  cross: `<svg viewBox="0 0 100 100"><path fill="#FFF" d="M38 15 h24 v23 h23 v24 h-23 v23 h-24 v-23 h-23 v-24 h23 z"/></svg>`,
  burst: `<svg viewBox="0 0 100 100"><polygon fill="#FFF" points="50,5 62,35 95,38 70,60 78,92 50,75 22,92 30,60 5,38 38,35"/></svg>`,
  shield: `<svg viewBox="0 0 100 100"><path fill="#FFF" d="M50 10 L85 22 C85 60 50 88 50 88 C50 88 15 60 15 22 Z"/></svg>`,
  neural: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="16" fill="#FFF"/><path stroke="#FFF" stroke-width="6" fill="none" d="M50 20 L50 34 M50 66 L50 80 M20 50 L34 50 M66 50 L80 50 M28 28 L38 38 M62 62 L72 72 M28 72 L38 62 M62 38 L72 28"/></svg>`,
  speed: `<svg viewBox="0 0 100 100"><polygon fill="#FFF" points="20,20 60,20 40,50 80,50 30,90 45,58 15,58"/></svg>`,
  eye: `<svg viewBox="0 0 100 100"><path fill="#FFF" d="M50 25 C25 25 8 50 8 50 C8 50 25 75 50 75 C75 75 92 50 92 50 C92 50 75 25 50 25 Z M50 62 A12 12 0 1 1 50 38 A12 12 0 0 1 50 62 Z"/></svg>`
};

// 4. Registry of Core Programs -> Discipline & Glyph
const PROGRAM_ICON_MANIFEST = [
  // Bio Met
  { name: "emergency-stim", disc: "biomet", glyph: "cross" },
  { name: "nano-bandage", disc: "biomet", glyph: "cross" },
  { name: "decontaminate", disc: "biomet", glyph: "cross" },
  { name: "cellular-rupture", disc: "biomet", glyph: "burst" },

  // Matter Cre
  { name: "phosphor-torch", disc: "mattercre", glyph: "burst" },
  { name: "micro-flechette", disc: "mattercre", glyph: "speed" },
  { name: "plasma-strike", disc: "mattercre", glyph: "burst" },
  { name: "prism-pulse", disc: "mattercre", glyph: "burst" },
  { name: "tesla-arc", disc: "mattercre", glyph: "speed" },

  // Matter Met
  { name: "armor-megaboost", disc: "mattermet", glyph: "shield" },
  { name: "force-barrier", disc: "mattermet", glyph: "shield" },
  { name: "mirror-shield", disc: "mattermet", glyph: "shield" },
  { name: "shield", disc: "mattermet", glyph: "shield" },

  // Psych Mod
  { name: "demotivational-speech", disc: "psychmod", glyph: "neural" },
  { name: "intensify-stress", disc: "psychmod", glyph: "neural" },
  { name: "neuro-spasm", disc: "psychmod", glyph: "neural" },
  { name: "ego-taunt", disc: "psychmod", glyph: "neural" },
  { name: "sleep", disc: "psychmod", glyph: "neural" },

  // Time / Space
  { name: "grav-chute", disc: "timespace", glyph: "speed" },
  { name: "sprint", disc: "timespace", glyph: "speed" },
  { name: "slipstream", disc: "timespace", glyph: "speed" },
  { name: "hedge-risk", disc: "timespace", glyph: "speed" },

  // Sensory Imp
  { name: "target-lock", disc: "sensoryimp", glyph: "eye" },
  { name: "target-paint", disc: "sensoryimp", glyph: "eye" },
  { name: "deep-scan", disc: "sensoryimp", glyph: "eye" },
  { name: "alarm", disc: "sensoryimp", glyph: "eye" },
  { name: "mask", disc: "sensoryimp", glyph: "eye" }
];

async function buildIcons() {
  console.log("Generating Notum disc icon library...");

  // Generate 6 Base Discipline Plates
  for (const [key, meta] of Object.entries(DISCIPLINES)) {
    const svgPlate = Buffer.from(generatePlateSVG(meta.color, meta.core));
    await sharp(svgPlate)
      .resize(256, 256)
      .webp({ quality: 95 })
      .toFile(path.join(OUTPUT_DIR, `plate-${key}.webp`));
  }

  // Composite Manifest
  for (const item of PROGRAM_ICON_MANIFEST) {
    const disc = DISCIPLINES[item.disc];
    const plateBuffer = Buffer.from(generatePlateSVG(disc.color, disc.core));
    const glyphSvg = Buffer.from(BUILTIN_GLYPHS[item.glyph]);

    const resizedGlyph = await sharp(glyphSvg)
      .resize(112, 112)
      .png()
      .toBuffer();

    const dest = path.join(OUTPUT_DIR, `${item.name}.webp`);

    await sharp(plateBuffer)
      .resize(256, 256)
      .composite([{ input: resizedGlyph, top: 72, left: 72 }])
      .webp({ quality: 95 })
      .toFile(dest);

    console.log(`Created: ${dest} [${disc.label}]`);
  }

  console.log("Notum icon generation complete!");
}

buildIcons().catch(console.error);
