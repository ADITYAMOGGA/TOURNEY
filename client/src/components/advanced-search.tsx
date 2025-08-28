import { useState, useEffect, useRef } from "react";
import { Search, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSuggestion {
  query: string;
  type: "recent" | "popular" | "suggestion";
}

interface AdvancedSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export function AdvancedSearch({ searchQuery, setSearchQuery, placeholder = "Search tournaments..." }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tournament-recent-searches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("tournament-recent-searches", JSON.stringify(updated));
  };

  // Popular search suggestions
  const popularSuggestions = [
    "Free Fire BR Solo",
    "Clash Squad 4v4",
    "Prize pool ₹10000",
    "Tonight tournaments",
    "Free entry"
  ];

  // Generate suggestions based on input
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      const recent = recentSearches.map(q => ({ query: q, type: "recent" as const }));
      const popular = popularSuggestions.map(q => ({ query: q, type: "popular" as const }));
      setSuggestions([...recent, ...popular].slice(0, 8));
      return;
    }

    const filtered = popularSuggestions
      .filter(s => s.toLowerCase().includes(query))
      .map(q => ({ query: q, type: "suggestion" as const }));
    
    const matchingRecent = recentSearches
      .filter(s => s.toLowerCase().includes(query))
      .map(q => ({ query: q, type: "recent" as const }));

    setSuggestions([...matchingRecent, ...filtered].slice(0, 6));
  }, [searchQuery, recentSearches]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 border-2 border-gray-300 dark:border-gray-600 focus:border-primary-orange dark:focus:border-primary-orange rounded-lg bg-white dark:bg-dark-card text-gray-900 dark:text-white transition-all duration-200"
          data-testid="input-advanced-search"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            data-testid="button-clear-search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {recentSearches.length > 0 && suggestions.some(s => s.type === "recent") && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase">Recent Searches</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("tournament-recent-searches");
                      }}
                      className="text-xs p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Clear
                    </Button>
                  </div>
                  {suggestions.filter(s => s.type === "recent").map((suggestion, index) => (
                    <motion.button
                      key={`recent-${index}`}
                      whileHover={{ backgroundColor: "rgba(255, 102, 0, 0.1)" }}
                      onClick={() => handleSearch(suggestion.query)}
                      className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-orange"
                      data-testid={`suggestion-recent-${index}`}
                    >
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-sm">{suggestion.query}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {suggestions.some(s => s.type !== "recent") && (
                <div>
                  <div className="px-3 py-2">
                    <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {suggestions.some(s => s.type === "suggestion") ? "Suggestions" : "Popular Searches"}
                    </span>
                  </div>
                  {suggestions.filter(s => s.type !== "recent").map((suggestion, index) => (
                    <motion.button
                      key={`suggestion-${index}`}
                      whileHover={{ backgroundColor: "rgba(255, 102, 0, 0.1)" }}
                      onClick={() => handleSearch(suggestion.query)}
                      className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-orange"
                      data-testid={`suggestion-popular-${index}`}
                    >
                      <Search className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-sm">{suggestion.query}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}