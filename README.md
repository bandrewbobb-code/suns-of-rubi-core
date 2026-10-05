# Suns of Rubi: Core

A full-featured science-fantasy ruleset and compendium module for **Foundry VTT** (v12 and v14 verified), built on the **dnd5e** system (3.0.0+).

[![Foundry VTT](https://img.shields.io/badge/Foundry%20VTT-v12%20--%20v14-orange.svg)](https://foundryvtt.com/)
[![System](https://img.shields.io/badge/System-dnd5e%203.0%2B-blue.svg)](https://github.com/foundryvtt/dnd5e)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

**Suns of Rubi: Core** brings a rich, cyberpunk and science-fantasy universe to Foundry VTT. It features a complete overhaul of classes, high-tech weapon masteries, nanoprogramming systems, custom equipment, cybernetics, and species.

---

## 📦 What's Included

### 🧑‍🚀 14 Core Classes
Each class includes full 1–20 level progression, custom features, invocations, and mechanics:
- **Adventurer** (Adaptations & Bio-Morphs)
- **Agent** (Operative Personas)
- **Bureaucrat** (Directives & Mechanical Bodyguard companion)
- **Doctor** (Clinical Discoveries)
- **Enforcer** (Warrior Instincts & Rage)
- **Engineer** (Tradeskill Schematics, Nanophotonic Automata & Upgrades)
- **Fixer** (Deals & Smuggler Tricks)
- **Keeper** (Sanctuary Auras & Paths)
- **Martial Artist** (Techniques & Finishers)
- **Meta-Physicist** (Theories, Attunements & Manifestation Node companion)
- **Nano-Technician** (Compilers, Overclocking & Matter Creation Tuning)
- **Shade** (Novictum Inscriptions & Cunning Strikes)
- **Soldier** (Tactical Strategies & Weapon Masteries)
- **Trader** (Trader Analytics & Market Leverage)

### ⚡ 110 Nanoprograms (Tier 0 & Tier 1)
- **34 Tier 0 (At-Will) Nanoprograms**
- **76 Tier 1 (Leveled) Nanoprograms**
- **Custom Notum Disc Icons**: Procedurally rendered 256x256 WebP icons across 6 nano disciplines: *Biological Metamorphosis (Bio Met)*, *Matter Creation (Matter Cre)*, *Matter Metamorphosis (Matter Met)*, *Psychological Modification (Psych Mod)*, *Time/Space*, and *Sensory Improvement (Sensory Imp)*.
- **14 Class Operating System (OS) Directory Journals** with inline links to compendium programs.

### 🛡️ 79 Feats & Talents
- **9 Origin Feats**
- **14 Homeworld Origin Feats** (Adamant, Airy, Aquatic, Awakened Mind, Blazing, Brilliant, Corrosive, Cosmic, Discordant, Flourishing, Frozen, Technologic, Tenebrous, Voidborn)
- **19 Fighting Styles** + Master Selectable Feature
- **17 Fighting Masteries** (with ASI Advancements) + Master Selectable Feature
- **20 Source Weapon Fighting Forms** + Master Selectable Feature

### ⚔️ Equipment & Cybernetics
- **60 Weapons**: Sourceweapons, energy blades, pulse rifles, shotguns, railguns, heavy ordnances.
- **15 Armors & Shields**: Shock trooper suits, dreadnought rigs, riot shields, hard-light emitters.
- **24 Field Gear & Consumables**: Trauma medpacs, bio-scanners, hacker kits, nanite salves.
- **19 Hardware Mods**: Custom weapon and armor augmentations.

### 👽 Species & Backgrounds
- **10 Playable Species**: Atrox, Cyborg, Drakken, Galadon, Hiisi, Krenari, Nanomage, Opifex, Solitus, Yuttos.
- **35 Unique Species Features**
- **15 Backgrounds**: Including the customizable *Frontier Outrunner* with origin feat advancement choices.

### 🤖 Companion Actors
- **Mechanical Bodyguard**
- **Manifestation Node** (Aberration / Construct)
- **Automaton Drones** (Android, Cyber-Hound, Gladiator, Launcher, Slayerdroid, Warbot)

### 💻 Notum Interface HUD
- Real-time character sheet HUD widget for **Nanopool (NP)** and **NCU Buffer** tracking.
- Tracks used vs. max NCU based on equipped hardware chips and active buff programs.
- Quick-cycle Nanopool recharge button and animated overflow warning indicators.

---

## 🚀 Installation

### In Foundry VTT
1. Launch Foundry VTT and navigate to the **Add-on Modules** tab.
2. Click **Install Module**.
3. In the **Manifest URL** field at the bottom, paste:
   ```
   https://raw.githubusercontent.com/bandrewbobb-code/suns-of-rubi-core/main/module.json
   ```
4. Click **Install**.
5. Enable **Suns of Rubi: Core** in your world under **Manage Modules**.

---

## 🛠️ Development & Building

If you are contributing to or customizing this module:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Foundry VTT CLI](https://github.com/foundryvtt/foundryvtt-cli)

### Setup & Compilation
```bash
# Clone the repository
git clone https://github.com/bandrewbobb-code/suns-of-rubi-core.git
cd suns-of-rubi-core

# Install dependencies
npm install

# Compile all source JSON into binary LevelDB packs
npm run build
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Suns of Rubi is a fan-created science-fantasy setting inspired by classic sci-fi MMORPGs and space operas.
Compatible with the 5th Edition System (dnd5e) on Foundry Virtual Tabletop.
