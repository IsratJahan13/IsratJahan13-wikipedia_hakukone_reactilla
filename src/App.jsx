import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en'); // Default language is English

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim() === '') return;
    try {
      const endpoint = `https://${language}.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok');
      const json = await response.json();
      setResults(json.query.search);
      setSearchInfo(json.query.searchinfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  document.documentElement.setAttribute('data-theme', theme);

  return (
    <div className="app">
      <header>
        <h1>Wikipedia Hakukone</h1>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <form className="search-box" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <input
              type="search"
              placeholder="Mitä etsit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="searchInput"
            />
            <button type="submit" className="search-button">
              <FaSearch id="search-icon" />
            </button>
          </div>
        </form>
        <div className="language-selector">
          <label htmlFor="language">Language: </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="fi">Finnish</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        {searchInfo.totalhits && <p>Search Results: {searchInfo.totalhits}</p>}
      </header>
      <div className="results">
        {results.map((result) => (
          <div className="result" key={result.pageid}>
            <h3>{result.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
            <a href={`https://${language}.wikipedia.org/?curid=${result.pageid}`} target="_blank" rel="noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;