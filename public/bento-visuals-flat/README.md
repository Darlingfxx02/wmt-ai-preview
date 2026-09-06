# Flat bento — separate material edition

- Original unchanged: `../bento-visuals/` (Dark Square v004).
- Current material edition: `http://localhost:5173/#why`.
- Flat edition: `http://localhost:5173/?bento=flat#why`.
- Rebuild: `python3 scripts/build-flat-bento.py` from repository root.

Neutral surfaces use solid fills. Depth comes from separate faces and overlaps.
All blur/drop-shadow filters and gradient highlights are removed.
The only gradient is the orange ramp from `src/OrangeMaterial.jsx`, including its
same deterministic 64×64 square noise, grouped into paths. Thin signal strokes
stay solid orange to retain consistent line weight.

`manifest.json` records original and derived file hashes.
