import React, { useMemo, useState } from 'react';
import Button from '../common/Button';
import TextInput from '../common/TextInput';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
  nodes: { id: string; name: string }[];
  groups: { id: string; type: string }[];
  maxResults?: number;
}

type SearchResult = {
  kind: 'n' | 'g';
  id: string;
  label: string;
  score: number;
};

const calcScore = (query: string, target: string): number => {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === -1) return 0;
  // percentage of characters matched relative to target length
  return Math.round((q.length / t.length) * 100);
};

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ onAddAllConstructive, nodes, groups, maxResults = 20 }) => {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const nodeMatches: SearchResult[] = nodes.map(n => ({
      kind: 'n' as const,
      id: n.id,
      label: n.name || n.id,
      score: calcScore(query, n.name || n.id)
    })).filter(r => r.score > 0);

    const groupMatches: SearchResult[] = groups.map(g => ({
      kind: 'g' as const,
      id: g.id,
      label: g.id,
      score: calcScore(query, g.id)
    })).filter(r => r.score > 0);

    return [...nodeMatches, ...groupMatches]
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, maxResults);
  }, [query, nodes, groups, maxResults]);

  return (
    <div className="constructive-row">
      <Button onClick={onAddAllConstructive} variant="add">All Nodes</Button>

      <div className="search-input-wrapper">
        <TextInput
          id="constructiveSearch"
          label="Search"
          hideLabel
          placeholder="Search nodes and groups"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        />

        {results.length > 0 && (
          <div className="search-results-panel">
            {results.map(r => (
              <div key={`${r.kind}:${r.id}`} className="search-result-row" title={r.label}>
                <span className={`search-result-kind ${r.kind === 'n' ? 'kind-node' : 'kind-group'}`}>
                  {r.kind}:
                </span>
                <span className="search-result-label">{r.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructiveOperations; 