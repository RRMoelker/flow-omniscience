# Mermaid Diagram App

A React TypeScript application that renders interactive Mermaid diagrams with advanced filtering and transformation capabilities. The app visualizes graph data, allowing real-time filters and graph transformations with an intuitive UI.

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit `http://localhost:3000` to see the interactive diagram.

## 📋 Project Overview

This application demonstrates a sophisticated graph visualization system where users can:
- View complex data transformation pipelines as interactive diagrams
- Apply multiple filters to focus on specific graph paths
- Perform graph transformations to simplify complex structures
- Interact with nodes through SVG buttons for quick operations
- Pan and zoom the diagram for better exploration

## 🏗️ Architecture Overview

### Core Concepts

1. **Graph Data Model**: The app uses a strict `Graph` type with `Node` and `Edge` objects
2. **Operations System**: Filters and transformations are unified as "operations" with metadata
3. **Mermaid Integration**: Graph data is converted to Mermaid syntax for rendering
4. **Interactive Elements**: SVG buttons are injected into nodes for user interactions
5. **Hover Highlighting**: Nodes are highlighted on hover for better UX

### Key Data Types

```typescript
// Core graph structure
interface Graph {
  nodes: Node[];
  edges: Edge[];
}

// Node types: 'process', 'data', or 'group' (for collapsed groups)
interface Node {
  id: string;
  label: string;
  type: 'process' | 'data' | 'group';
  group?: string; // Optional grouping attribute
}

// Operations system
interface OperationMeta {
  id: string;
  label: string;
  priority: number;
  operation: (graph: Graph) => Graph;
}
```

## 📁 File Structure

```
src/
├── components/
│   ├── display/
│   │   ├── hoverHighlighter.ts    # Node hover highlighting
│   │   └── svgButtonRenderer.ts   # SVG button injection
│   ├── DiagramRenderer.tsx        # Core diagram rendering
│   ├── FilterInputs.tsx           # Operations UI
│   └── CameraController.tsx       # Zoom/pan controls
├── data/
│   ├── operations/
│   │   ├── filters/               # Filter operations
│   │   │   ├── startFilter.ts
│   │   │   ├── endFilter.ts
│   │   │   └── passThroughFilter.ts
│   │   └── transforms/            # Transformation operations
│   │       └── groupCollapseTransformation.ts
│   ├── graph/
│   │   └── graphUtils.ts          # Pure graph utility functions
│   ├── graphData.ts               # Sample data and types
│   ├── mermaidConverter.ts        # Graph → Mermaid conversion
│   ├── operationsManager.ts       # Operations composition
│   └── types.ts                   # All type definitions
├── styles/
│   └── App.css                    # Component styles
└── App.tsx                        # Main app component
```

## 🔧 Key Components

### 1. Operations System (`/data/operations/`)

**Concept**: Filters and transformations are unified as "operations" - functions that take a `Graph` and return a modified `Graph`.

**Structure**:
- Each operation is a separate file with a single default export
- Operations follow the pattern: `(graph: Graph) => Graph`
- Operations have metadata: `id`, `label`, `priority`
- Operations are composed in priority order by `operationsManager.ts`

**Example Operation**:
```typescript
// startFilter.ts
const startFilter = (graph: Graph): Graph => {
  // Find reachable nodes from start nodes
  // Return filtered graph
};

export default {
  id: 'start-filter',
  label: 'Start Filter',
  priority: 1,
  operation: startFilter
};
```

### 2. Mermaid Integration (`mermaidConverter.ts`)

**Purpose**: Converts our `Graph` data structure to Mermaid syntax.

**Key Functions**:
- `graphToMermaid(graph: Graph): string` - Main conversion
- `applyOperations(graph: Graph, operations: OperationMeta[]): Graph` - Apply operations before rendering

**Rendering Process**:
1. Apply all operations in priority order
2. Convert filtered/transformed graph to Mermaid syntax
3. Render with `mermaid.render()`
4. Inject SVG buttons and add hover highlighting

### 3. Interactive Elements

**SVG Buttons** (`svgButtonRenderer.ts`):
- Injected into nodes after Mermaid rendering
- Support operations: start/end/pass-through nodes, group collapse
- Only show relevant buttons per node type

**Hover Highlighting** (`hoverHighlighter.ts`):
- Highlights hovered nodes
- Makes other nodes transparent
- Uses CSS transitions for smooth effects

### 4. Operations UI (`FilterInputs.tsx`)

**Features**:
- Unified panel showing all active operations
- Icons distinguish filters vs transformations
- Real-time operation management
- Priority-based ordering

## 🎨 Styling System

**CSS Organization**:
- `src/styles/App.css` - Component-specific styles
- Hover highlighting with CSS transitions
- Responsive layout with flexbox
- SVG button styling and positioning

**Key Classes**:
- `.mermaid-diagram-container` - Main diagram wrapper
- `.operations-panel` - Operations UI
- `.node.hovered` - Hovered node highlighting
- `.svg-button` - Interactive node buttons

## 🔄 State Management

**App State** (`App.tsx`):
```typescript
const [operations, setOperations] = useState<OperationMeta[]>([]);
const [graphData, setGraphData] = useState<Graph>(sampleGraphData);
```

**State Flow**:
1. User adds/removes operations via UI
2. Operations are applied to graph data
3. Modified graph is converted to Mermaid
4. Diagram re-renders with new state

## 🚨 Common Issues & Solutions

### 1. Mermaid Rendering Errors
**Problem**: Diagram doesn't render or shows errors
**Solution**: 
- Ensure `mermaid.initialize()` is called before rendering
- Use `mermaid.render()` instead of `mermaid.run()`
- Check for valid graph data structure

### 2. SVG Button Positioning
**Problem**: Buttons appear in wrong positions
**Solution**:
- Wait for Mermaid rendering to complete before injecting buttons
- Use `setTimeout` to ensure DOM is ready
- Check node element positioning in SVG

### 3. Hover Highlighting Not Working
**Problem**: Node highlighting doesn't work
**Solution**:
- Verify CSS selectors match Mermaid-generated classes
- Check that hover event listeners are properly attached
- Ensure node IDs match between graph data and SVG elements

### 4. Operations Not Applying
**Problem**: Filters/transformations don't work
**Solution**:
- Check operation priority order in `operationsManager.ts`
- Verify operation function returns valid `Graph` object
- Ensure operation metadata is correctly structured

## 🧪 Development Guidelines

### Adding New Operations

1. **Create operation file** in `/data/operations/filters/` or `/data/operations/transforms/`
2. **Follow the pattern**:
   ```typescript
   const myOperation = (graph: Graph): Graph => {
     // Your logic here
     return modifiedGraph;
   };
   
   export default {
     id: 'my-operation',
     label: 'My Operation',
     priority: 5,
     operation: myOperation
   };
   ```
3. **Update imports** in `operationsManager.ts` if needed

### Adding New Node Types

1. **Update `Node` type** in `types.ts`:
   ```typescript
   type: 'process' | 'data' | 'group' | 'newType'
   ```
2. **Update Mermaid conversion** in `mermaidConverter.ts`
3. **Add styling** for new node type in CSS
4. **Update button logic** in `svgButtonRenderer.ts` if needed

### Modifying Graph Data

1. **Update sample data** in `graphData.ts`
2. **Ensure data structure** matches `Graph` interface
3. **Test with existing operations** to verify compatibility

## 🔮 Future Enhancements

### Potential Features
- **Export functionality** - Save diagrams as PNG/SVG
- **Undo/Redo** - Operation history management
- **Custom node types** - User-defined node categories
- **Advanced transformations** - More complex graph operations
- **Performance optimization** - Virtual scrolling for large graphs

### Technical Improvements
- **State management** - Consider Redux/Zustand for complex state
- **Testing** - Add comprehensive unit and integration tests
- **Accessibility** - Improve keyboard navigation and screen reader support
- **Mobile support** - Better touch interactions for mobile devices

## 📚 Maintenance Instructions

### For Future AI Developers

**When modifying this codebase**:

1. **Understand the operations system** - All filters/transformations are functions that transform graphs
2. **Respect the type system** - Use strict typing for all new features
3. **Test Mermaid integration** - Always verify diagram rendering works
4. **Maintain hover highlighting** - Keep the interactive UX smooth
5. **Follow the file structure** - Keep operations, components, and data organized

**Key files to understand**:
- `types.ts` - All type definitions
- `operationsManager.ts` - How operations are composed
- `mermaidConverter.ts` - Graph to diagram conversion
- `DiagramRenderer.tsx` - Main rendering logic

**Common patterns**:
- Operations are pure functions: `(graph: Graph) => Graph`
- SVG manipulation happens after Mermaid rendering
- State updates trigger re-rendering of the entire diagram
- CSS handles visual effects, JavaScript handles logic

This architecture provides a clean separation of concerns while maintaining flexibility for future enhancements.
