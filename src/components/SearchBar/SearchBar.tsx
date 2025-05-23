import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';
import { Search } from 'lucide-react';
import { searchUsers } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  level: number;
}

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleExpand = () => setIsExpanded(prev => !prev);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setQuery('');
        setResults([]);
        setError('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => 
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setNoResults(false);
        setError('');
        return;
      }
      try {
        const users = await searchUsers(query);
        setResults(users);
        setNoResults(users.length === 0);
        setError('');
      } catch {
        setResults([]);
        setNoResults(false);
        setError('No hay usuarios con ese nombre');
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleNavigate = (id: string) => {
    setQuery('');
    setResults([]);
    setNoResults(false);
    setIsExpanded(false);
    navigate(`/profile/${id}`);
  };

  return (
    <div ref={containerRef} className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}>
      <button onClick={toggleExpand} className={styles.searchIcon}>
        <Search size={20} />
      </button>
      {isExpanded && (
        <>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar..."
            className={styles.searchInput}
            autoFocus
          />
          {(results.length > 0 || noResults || error) && (
            <ul className={styles.resultsDropdown}>
              {results.map((user) => (
                <li key={user._id} onClick={() => handleNavigate(user._id)} className={styles.resultItem}>
                  <img src={user.profilePicture || '/default-profile.png'} alt={user.username} />
                  <span>{user.username} (lvl {user.level})</span>
                </li>
              ))}
              {noResults && <li className={styles.resultMessage}>No se encontraron usuarios.</li>}
              {error && <li className={styles.resultError}>{error}</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;