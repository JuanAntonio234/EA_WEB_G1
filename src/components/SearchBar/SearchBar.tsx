import { useState } from 'react';
import styles from './SearchBar.module.css';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const toggleExpand = () => setIsExpanded(prev => !prev);

  return (
    <div className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}>
      <button onClick={toggleExpand} className={styles.searchIcon}>
        <Search size={20} />
      </button>
      {isExpanded && (
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar..."
          className={styles.searchInput}
          autoFocus
        />
      )}
    </div>
  );
};

export default SearchBar;
