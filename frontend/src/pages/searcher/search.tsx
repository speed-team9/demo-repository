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
  rating?: number;
}

export default function SearchPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({}); // ✅ 存储用户已提交的评分
  const [ratingInputs, setRatingInputs] = useState<Record<string, string>>({}); // 当前输入
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const resultsPerPage = 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API || '';
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
    setFormData({ title: '', author: '' });
    setResults([]);
    setCurrentPage(1);
  };

  const handleRatingChange = async (articleId: string, articleTitle: string, rating: number) => {
    if (rating < 1 || rating > 5) return;

    setRatingInputs(prev => ({ ...prev, [articleTitle]: rating.toString() }));
    setLoadingStates(prev => ({ ...prev, [articleTitle]: true }));

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API || '';
      const response = await fetch(`${apiBaseUrl}/api/articles/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: articleTitle, rating })
      });

      if (response.ok) {
        const result = await response.json();

        setUserRatings(prev => ({
          ...prev,
          [articleTitle]: result.rating
        }));

        setResults(prev =>
          prev.map(article =>
            article.id === articleId
              ? { ...article, rating: result.rating }
              : article
          )
        );
      } else {
        const error = await response.json();
        alert(`Failed to rate: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [articleTitle]: false }));
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = Array.isArray(results) ? results.slice(indexOfFirstResult, indexOfLastResult) : [];
  const totalPages = Math.ceil((Array.isArray(results) ? results.length : 0) / resultsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 Search Articles</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter keywords..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {Array.isArray(results) && results.length > 0 ? (
        <div>
          <h2>📋 Search Results</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Found <strong>{results.length}</strong> results</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Title
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Authors
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Source
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Year
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Claim
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f1f3f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #dee2e6'
                  }}>
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentResults.map((result) => (
                  <tr key={result.id}>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}>
                      <strong>{result.title}</strong>
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}>
                      {Array.isArray(result.authors) ? result.authors.join(', ') : result.authors}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}>
                      {result.source}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}>
                      {result.pubyear}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}>
                      {result.claim}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'top',
                      textAlign: 'center'
                    }}>
                      <select
                        value={ratingInputs[result.title] ?? ''}
                        onChange={(e) => handleRatingChange(result.id, result.title, Number(e.target.value))}
                        disabled={loadingStates[result.title]}
                        style={{
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Rate...</option>
                        {[1, 2, 3, 4, 5].map(star => (
                          <option key={star} value={star}>
                            {star} Star{star > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>

                      {!loadingStates[result.title] && typeof userRatings[result.title] === 'number' && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#2e7d32' }}>
                          Your rating: <strong>{userRatings[result.title]}</strong>/5
                        </div>
                      )}

                      {loadingStates[result.title] && (
                        <div style={{ fontSize: '12px', color: '#0070f3', marginTop: '5px' }}>
                          Saving...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f8f9fa',
                  color: '#0070f3',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === page ? '#0070f3' : '#f8f9fa',
                    color: currentPage === page ? 'white' : '#0070f3',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f8f9fa',
                  color: '#0070f3',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '18px',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          {Array.isArray(results) && results.length === 0
            ? 'No results found. Try adjusting your search terms.'
            : 'Enter search criteria above'}
        </div>
      )}
    </div>
  );
}