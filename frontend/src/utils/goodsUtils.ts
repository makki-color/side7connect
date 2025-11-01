
export const saveSearchHistory = (query: string, setSearchHistory: (history: string[]) => void) => {
  if (typeof window !== 'undefined') {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(query)) {
      const newHistory = [query, ...history.slice(0, 4)];
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    }
  }
};

export const removeSearchHistoryItem = (
  target: string,
  setSearchHistory: (history: string[]) => void
) => {
  if (typeof window === 'undefined') return;
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  const newHistory = history.filter((q: string) => q !== target);
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  setSearchHistory(newHistory);
};