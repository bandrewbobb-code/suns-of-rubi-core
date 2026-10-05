# Antigravity Developer Directives: suns-of-rubi-core

## 1. System Role & Transpilation Rules
- Act strictly as a deterministic data transpiler.
- Never alter names, rebalance dice formulas, change action economy, or invent generic 5e/SW5e mechanics.
- Use the exact rules text provided by the user; wrap it inside Foundry VTT document structures.

## 2. Document Identifiers & Keys (Strict Mode)
- Every generated Item or Actor JSON MUST contain a unique 16-character alphanumeric `_id` at root.
- Document keys must match:
  - Items: `"_key": "!items!<16-character-_id>"`
  - Actors: `"_key": "!actors!<16-character-_id>"`
- In Actor documents, EVERY embedded item in the `items: [...]` array MUST include its own `_id` and compound key:
  `"_key": "!actors.items!<actor-_id>.<item-_id>"`

## 3. Actor & Token Schema (Foundry v14)
- All NPC/Actor documents must include `"depth": 1` within `prototypeToken` to pass v14 canvas validation.

## 4. Foundry V4 Activities Architecture
- NEVER put activations, ranges, targets, saves, or damage directly on the item root.
- All functional mechanics MUST be declared within `system.activities` using standard activity types (`attack`, `save`, `damage`, `heal`, `utility`).
- Reference compendium items strictly via UUID: `Compendium.suns-of-rubi-core.<pack-name>.<_id>`.

## 5. Compendium Packaging Rules
- Pack commands with `@foundryvtt/foundryvtt-cli` must target `--out packs` when using `-n <pack-name>` to prevent subfolder duplication.
- Always include the recursive flag (`-r`) when packing directories containing subfolders (such as directives, exploits, or doctrines).
- Ensure all packs declared in `module.json` exist as compiled directories in `packs/`, even if empty.

## 6. Vocabulary & 5e Schema Rosetta Stone
- Nanoprogram -> Foundry `type: "spell"` (levels 0–9)
- Nanopool Points -> Spell points / `@scale.<class>.nanopool-points`
- Overclocking -> Upcasting (`scaling.mode: "level"` or cantrip scaling)
- Operating System (OS) -> Class spell list
- Class Invocations (Directives, Exploits, Doctrines, level 2 customization features, same progression as the Warlock Invocation) -> Foundry `type: "feat"`, `system.type.value: "class"`
- Companion Assets (Mechanical Bodyguard, Combat Drones) -> Foundry `type: "npc"`, linked via `ItemGrant`
