# Mermaid Diagram App

A React TypeScript application for creating and manipulating interactive Mermaid diagrams with advanced graph operations.

## Project Overview

This app allows users to build complex graph diagrams using a pipeline of operations: **Sources** → **Constructive** → **Transformations** → **Filters**. Each operation type has a specific priority and purpose in the graph processing pipeline.

## Core Concepts

### Operation Pipeline
Operations are processed in priority order:
- **Sources (Priority 0)**: Create initial graph data
- **Constructive (Priority 100)**: Add nodes/edges to existing graphs
- **Transformations (Priority 200)**: Modify graph structure (collapse groups, etc.)
- **Filters (Priority 300)**: Remove nodes/edges based on criteria

### Graph Structure
- **Nodes**: Represent entities with properties (id, label, group, etc.)
- **Edges**: Represent relationships between nodes
- **Groups**: Logical groupings of nodes for operations

### Interactive Features
- **Camera Controls**: Pan and zoom the diagram view
- **Node Operations**: Set start/end nodes, pass-through filters, group collapse
- **Real-time Processing**: Operations are applied immediately to update the diagram

## Project Structure

```
src/
├── components/
│   ├── display/           # Visual components (SVG buttons, hover effects)
│   ├── input/            # Input panels and operation controls
│   ├── CameraController.tsx
│   ├── DiagramRenderer.tsx
│   └── NodeInfoPanel.tsx
├── data/
│   ├── graph/            # Graph data structures
│   ├── operations/       # Operation implementations
│   │   ├── sources/      # Source operations
│   │   ├── constructive/ # Constructive operations
│   │   ├── filters/      # Filter operations
│   │   └── transforms/   # Transformation operations
│   ├── mermaidConverter.ts
│   └── types.ts
└── styles/
    └── App.css
```

## Key Components

### DiagramRenderer
- Renders Mermaid diagrams from graph data
- Handles SVG button overlays for node operations
- Manages hover highlighting

### CameraController
- Provides pan/zoom controls
- Uses direct DOM manipulation (no React re-renders)
- Preserves diagram state during camera operations

### InputWindow System
- Modular input sections for different operation types
- Reusable `InputSection` component with slot-based design
- Organized by operation priority

## Operation System

### Adding Operations
Operations are inserted at the correct priority position:
```typescript
// Sources go at the beginning
setOperations(prev => [newSourceOperation, ...prev]);

// Constructive operations go after sources
setOperations(prev => {
  const sourceCount = prev.filter(op => op.priority === 0).length;
  return [...prev.slice(0, sourceCount), newConstructiveOp, ...prev.slice(sourceCount)];
});
```

### Operation Types
- **Sources**: `createExampleSource()`, `createRemoteSource()`
- **Constructive**: `createAllConstructive()`, `createAddGroupConstructive()`
- **Filters**: `createStartFilter()`, `createEndFilter()`, `createPassThroughFilter()`
- **Transforms**: `createGroupCollapseTransformation()`

## Development Guidelines for LLMs

### Making Limited Edits

1. **Understand the Operation Pipeline**: Operations must be added in correct priority order
2. **Preserve Camera Controls**: Camera operations should not trigger re-renders
3. **Maintain Separation**: Visual components should not interfere with each other
4. **Follow Type Safety**: All operations must implement the `OperationMeta` interface

### Common Patterns

#### Adding New Operations
1. Create operation function in appropriate directory (`sources/`, `constructive/`, etc.)
2. Export from `operationsManager.ts`
3. Add UI controls in relevant input component
4. Handle in App.tsx with proper priority insertion

#### Modifying Graph Processing
1. Update `applyOperations()` in `operationsManager.ts`
2. Ensure operations are applied in priority order
3. Test with different operation combinations

#### UI Changes
1. Use existing `InputSection` component for new panels
2. Follow the slot-based pattern for modularity
3. Preserve camera control independence

### File Responsibilities

- **App.tsx**: Main state management and operation coordination
- **DiagramRenderer.tsx**: Pure rendering, no business logic
- **CameraController.tsx**: Direct DOM manipulation only
- **operationsManager.ts**: Central operation processing logic
- **mermaidConverter.ts**: Graph to Mermaid syntax conversion

### Testing Changes
1. Verify operations are applied in correct order
2. Test camera controls don't interfere with other interactions
3. Ensure graph updates reflect in diagram immediately
4. Check that operation removal works correctly

## Current State

- ✅ Camera controls work independently (no re-renders)
- ✅ Operation pipeline with correct priority ordering
- ✅ Modular input system with reusable components
- ✅ Real-time graph processing and updates
- ✅ SVG button overlays for node operations
- ❌ Node selection removed (was interfering with other interactions)
- ✅ Node info panel preserved (shows null for now)

## Future Enhancements

- Re-implement node selection without interference
- Add more operation types
- Improve graph layout algorithms
- Add operation validation and error handling
- Implement operation history/undo functionality 