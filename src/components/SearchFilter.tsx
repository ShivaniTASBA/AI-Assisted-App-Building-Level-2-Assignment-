/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, History } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  errorMsg: string | null;
}

const POPULAR_CITIES = ['Tokyo', 'New York', 'London', 'Paris', 'Sydney', 'Cairo'];

export default function SearchFilter({ onSearch, isLoading, errorMsg }: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading recent searches from localStorage:', e);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setValidationError('Please enter a city name.');
      return;
    }

    if (trimmed.length < 2) {
      setValidationError('City name must be at least 2 characters long.');
      return;
    }

    const lowerQuery = trimmed.toLowerCase();
    const isGibberish = ['abc', 'xyz', 'asd', 'qwe', 'zxc', 'asdf', 'qwer', 'test', 'testing', 'dummy'].includes(lowerQuery);
    if (isGibberish) {
      setValidationError(`City "${trimmed}" is invalid. Please try another search query.`);
      return;
    }

    setValidationError(null);
    onSearch(trimmed);
    saveToHistory(trimmed);
  };

  // Helper to save queries to recent searches history
  const saveToHistory = (city: string) => {
    const formatted = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== formatted.toLowerCase());
      const updated = [formatted, ...filtered].slice(0, 5); // Limit to 5
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recent searches:', e);
      }
      return updated;
    });
  };

  // Clear search input
  const handleClear = () => {
    setQuery('');
    setValidationError(null);
  };

  // Clear all recent searches
  const handleClearHistory = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('weather_recent_searches');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            id="city-search-input"
            type="text"
            className={`w-full pl-11 pr-10 py-3 bg-slate-50/60 border ${
              validationError || errorMsg ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
            } rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-base`}
            placeholder="Search for a city... (e.g. Kyoto, Vancouver)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (validationError) setValidationError(null);
            }}
          />
          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          id="submit-search-btn"
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 text-base shrink-0"
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span>Search</span>
        </button>
      </form>

      {/* Validation or API error display inside the search panel for micro-feedback */}
      {(validationError || errorMsg) && (
        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block shrink-0" />
          {validationError || errorMsg}
        </p>
      )}

      {/* Quick Access Presets & Recent Searches History in a side-by-side horizontal grid on md+ screens */}
      {recentSearches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 pt-4 border-t border-slate-100/60">
          {/* Quick Access Presets */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              Popular Destinations
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((city) => (
                <button
                  id={`preset-city-${city.toLowerCase()}`}
                  key={city}
                  type="button"
                  onClick={() => {
                    setQuery(city);
                    setValidationError(null);
                    onSearch(city);
                    saveToHistory(city);
                  }}
                  className="px-3 py-1 bg-slate-50 hover:bg-sky-50 hover:text-sky-600 border border-slate-100 rounded-lg text-xs text-slate-600 transition-all font-medium active:scale-95"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-slate-400" />
                Recent Searches
              </h3>
              <button
                id="clear-history-btn"
                onClick={handleClearHistory}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 hover:underline transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((city) => (
                <button
                  id={`recent-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
                  key={city}
                  type="button"
                  onClick={() => {
                    setQuery(city);
                    setValidationError(null);
                    onSearch(city);
                    saveToHistory(city);
                  }}
                  className="px-3 py-1 bg-slate-50/50 hover:bg-slate-100 border border-slate-100/60 rounded-lg text-xs text-slate-600 transition-all font-medium flex items-center gap-1"
                >
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-slate-100/60">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            Popular Destinations
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CITIES.map((city) => (
              <button
                id={`preset-city-${city.toLowerCase()}`}
                key={city}
                type="button"
                onClick={() => {
                  setQuery(city);
                  setValidationError(null);
                  onSearch(city);
                  saveToHistory(city);
                }}
                className="px-3 py-1 bg-slate-50 hover:bg-sky-50 hover:text-sky-600 border border-slate-100 rounded-lg text-xs text-slate-600 transition-all font-medium active:scale-95"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
