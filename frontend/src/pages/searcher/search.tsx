import { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  status: string;
}

export default function SearchPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const params = new URLSearchParams();
      if (formData.title) params.append('title', formData.title);
      if (formData.author) params.append('author', formData.author);
      
      const response = await fetch(`${apiBaseUrl}/api/articles/search?${params.toString()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching articles:', error);
      setResults([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: ''
    });
    setResults([]);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = Array.isArray(results) ? results.slice(indexOfFirstResult, indexOfLastResult) : [];
  const totalPages = Math.ceil((Array.isArray(results) ? results.length : 0) / resultsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Search Articles</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title keywords"
          />
        </div>
        
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
        </div>
        
        <div>
          <button type="submit">
            Search
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {Array.isArray(results) && results.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <div>
            Found {results.length} results
          </div>

          <div>
            {currentResults.map((result) => (
              <div key={result.id}>
                <h3>{result.title}</h3>
                <div>
                  <span>Authors: {Array.isArray(result.authors) ? result.authors.join(', ') : result.authors}</span> | 
                  <span> Source: {result.source}</span> | 
                  <span> Year: {result.pubyear}</span>
                </div>
                <p>{result.claim}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div>
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {Array.isArray(results) && results.length === 0 && (
        <div>No results found</div>
      )}
    </div>
  );
}