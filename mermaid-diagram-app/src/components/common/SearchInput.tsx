import React, { useMemo, useState } from 'react';
import TextInput from './TextInput';

export interface SearchResult {
  kind: 'n' | 'g';
  id: string;
  label: string;
  score: number;
}

export interface SearchInputProps {
  id: string;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  maxResults?: number;
  nodes: { id: string; name: string }[];
  groups: { id: string; type: string }[];
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

const calcScore = (query: string, target: string): number => {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === -1) return 0;
  // percentage of characters matched relative to target length
  return Math.round((q.length / t.length) * 100);
};

const SearchInput: React.FC<SearchInputProps> = ({
  id,
  label = "Search",
  hideLabel = false,
  placeholder = "Search nodes and groups",
  maxResults = 20,
  nodes,
  groups,
  onResultClick,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

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

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowResults(newQuery.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className={`search-input-wrapper ${className}`}>
      <TextInput
        id={id}
        label={label}
        hideLabel={hideLabel}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />

      {showResults && results.length > 0 && (
        <div className="search-results-panel">
          {results.map(r => (
            <div 
              key={`${r.kind}:${r.id}`} 
              className="search-result-row" 
              title={r.label}
              onClick={() => handleResultClick(r)}
            >
              <span className={`search-result-kind ${r.kind === 'n' ? 'kind-node' : 'kind-group'}`}>
                {r.kind}:
              </span>
              <span className="search-result-label">{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput; 