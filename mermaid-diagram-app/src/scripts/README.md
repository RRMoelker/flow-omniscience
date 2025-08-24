# Scripts

This folder contains utility scripts for the Mermaid Diagram App.

## ingestExt.ts

A script that generates a basic example graph and outputs it to a JSON file.

### Usage

#### Using npm script (recommended):
```bash
npm run ingest <output-path>
```

#### Using ts-node directly:
```bash
npx ts-node src/scripts/ingestExt.ts <output-path>
```

### Examples

```bash
# Generate a basic graph and save to public/data/custom.json
npm run ingest ./public/data/custom.json

# Generate a basic graph and save to a custom location
npm run ingest ./my-custom-graph.json
```

### Output

The script will:
1. Create a basic example graph with:
   - 3 groups (example_group, data_group, process_group)
   - 5 nodes (start, data1, process1, data2, end_node)
   - 4 edges connecting the nodes in a simple flow
2. Convert the graph to formatted JSON
3. Write the JSON to the specified file path
4. Display success message with graph statistics

### Graph Structure

The generated graph represents a simple data processing pipeline:
- **Start Node** → **Input Data** → **Process Data** → **Processed Data** → **End Node**

### Error Handling

- The script will exit with an error if no output path is provided
- File write errors are caught and displayed
- The script exits with code 1 on any errors

### Customization

To modify the generated graph, edit the `createGraph()` function in `ingestExt.ts`. You can:
- Add more groups, nodes, or edges
- Change the graph structure
- Modify node types and group assignments
- Add custom properties to nodes or edges

## testValidator.ts

A script that tests the graph validator functionality, including the new reserved keywords check.

### Usage

```bash
npm run test-validator
```

### What It Tests

1. **Reserved Keywords Detection**: Tests that the validator catches Mermaid reserved keywords
2. **Valid Graph Validation**: Tests that valid graphs pass validation
3. **Specific Keywords**: Tests individual reserved keywords like 'end', 'start', 'graph'

### Reserved Keywords

The validator now checks for these Mermaid reserved keywords that cannot be used as node or group IDs:

- **Graph Structure**: `end`, `start`, `subgraph`, `graph`, `flowchart`
- **Graph Types**: `sequence`, `class`, `state`, `git`, `pie`, `journey`, `gantt`
- **Styling**: `classDef`, `link`, `click`, `style`, `direction`
- **Directions**: `TB`, `TD`, `BT`, `RL`, `LR`

### Error Messages

When reserved keywords are found, the validator provides:
- Clear error message explaining the issue
- List of all reserved keywords found
- Affected node/group IDs with context
- Suggestion to use alternative names

### Example Error Output

```
Found 3 reserved keyword(s) used as ID(s): end, start, graph. 
These are reserved by Mermaid and cannot be used as node or group IDs.

Affected IDs: group:end, node:start, node:graph
```
