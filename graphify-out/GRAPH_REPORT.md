# Graph Report - pewny-region-fe  (2026-09-26)

## Corpus Check
- Corpus is ~8,347 words - fits in a single context window. You may not need a graph.

## Summary
- 291 nodes · 578 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Map Visualization
- Filters & Data Fetching
- Build Configuration
- React App Core
- UI Components
- TypeScript Config
- PWA Assets
- Runtime Dependencies
- UI Panel System
- Dev Dependencies
- PWA Manifest

## God Nodes (most connected - your core abstractions)
1. `react` - 21 edges
2. `compilerOptions` - 18 edges
3. `react-i18next` - 14 edges
4. `CountyFeature` - 13 edges
5. `Variable` - 12 edges
6. `getTeryt()` - 11 edges
7. `ScoreRange` - 10 edges
8. `CountyScore` - 9 edges
9. `RegionMap()` - 8 edges
10. `getScoreColor()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `RegionMap()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/map/components/RegionMap.tsx → src/app/providers/ThemeContext.tsx
- `FilterListProps` --references--> `Variable`  [EXTRACTED]
  src/features/filters/components/FilterList.tsx → src/types/api.ts
- `UseVariablesResult` --references--> `Variable`  [EXTRACTED]
  src/features/filters/hooks/useVariables.ts → src/types/api.ts
- `ChartCardProps` --references--> `VariableDetail`  [EXTRACTED]
  src/features/map/components/ChartCard.tsx → src/types/api.ts
- `CountyDetailsPanelProps` --references--> `Variable`  [EXTRACTED]
  src/features/map/components/CountyDetailsPanel.tsx → src/types/api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **** — npm_start_script, npm_test_script, npm_build_script, npm_eject_script [EXTRACTED]
- **** — web_app_manifest, apple_touch_icon, logo_192, logo_512 [EXTRACTED]
- **** — react_logo, logo_192, logo_512 [EXTRACTED]

## Communities (13 total, 2 thin omitted)

### Community 0 - "Map Visualization"
Cohesion: 0.09
Nodes (45): ref_geojson, leaflet, CountyDetailsPanelProps, MapLegend(), MapLegendProps, RegionMap(), RegionMapProps, SearchControl() (+37 more)

### Community 1 - "Filters & Data Fetching"
Cohesion: 0.11
Nodes (27): react-i18next, fetchVariables(), FilterList(), FilterListProps, FiltersPanel(), FiltersPanelProps, useGenerateCountyScores(), UseGenerateCountyScoresResult (+19 more)

### Community 2 - "Build Configuration"
Cohesion: 0.05
Nodes (36): browserslist, development, production, eslintConfig, extends, name, private, scripts (+28 more)

### Community 3 - "React App Core"
Cohesion: 0.09
Nodes (22): react-dom, @testing-library/react, App(), Theme, ThemeContext, ThemeContextType, ThemeProvider(), ThemeProviderProps (+14 more)

### Community 4 - "UI Components"
Cohesion: 0.13
Nodes (25): TimeRangePicker(), TimeRangePickerProps, src_features_map_types_scoreslookup, HIGHLIGHT_WEIGHT, BRAND_BLUE, CHART_AXIS_DARK, CHART_AXIS_LIGHT, CHART_DOT_DARK (+17 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+11 more)

### Community 6 - "PWA Assets"
Cohesion: 0.12
Nodes (18): Apple Touch Icon, Create React App, Favicon, Index TypeScript Entry, Logo 192x192, Logo 512x512, Production Build Script, Eject Script (+10 more)

### Community 7 - "Runtime Dependencies"
Cohesion: 0.14
Nodes (14): dependencies, i18next, i18next-browser-languagedetector, leaflet, react, react-dom, react-i18next, react-leaflet (+6 more)

### Community 8 - "UI Panel System"
Cohesion: 0.26
Nodes (8): react, react-leaflet, PanelProps, MapViewportEffects(), MapViewportEffectsProps, useInvalidateMapSizeOnToggle(), useMapDragCleanup(), useMapZoomGuard()

### Community 9 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, autoprefixer, postcss, tailwindcss, @types/geojson, @types/leaflet, @types/node, @types/react (+5 more)

### Community 10 - "PWA Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

## Knowledge Gaps
- **94 isolated node(s):** `name`, `version`, `private`, `type`, `@testing-library/dom` (+89 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 115 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `UI Panel System` to `Map Visualization`, `Filters & Data Fetching`, `Build Configuration`, `React App Core`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `Filters & Data Fetching` to `Map Visualization`, `Build Configuration`, `React App Core`, `UI Components`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Build Configuration`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Map Visualization` be split into smaller, more focused modules?**
  _Cohesion score 0.09074410163339383 - nodes in this community are weakly interconnected._
- **Should `Filters & Data Fetching` be split into smaller, more focused modules?**
  _Cohesion score 0.1091753774680604 - nodes in this community are weakly interconnected._
- **Should `Build Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05384615384615385 - nodes in this community are weakly interconnected._