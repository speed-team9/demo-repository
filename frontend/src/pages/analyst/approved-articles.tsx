import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Article {
  _id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  status: string;
  keyInsights?: string;
  tags?: string[];
  reviewStatus?: string;
}

export default function ApprovedArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApprovedArticles();
  }, []);

  const fetchApprovedArticles = async () => {
    try {
      console.log('=== FETCH ARTICLES START ===');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const url = `${apiBaseUrl}/api/articles/review/status?status=accepted`;
      console.log('Fetch URL:', url);
      
      const response = await fetch(url);
      console.log('Fetch response status:', response.status);
      
      const data = await response.json();
      console.log('Fetched articles count:', data.length);
      console.log('Fetched articles:', data);
      
      setArticles(data);
      console.log('=== FETCH ARTICLES END ===');
    } catch (error) {
      console.error('Error fetching approved articles:', error);
    }
  };

  const handleEdit = async (articleId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(`${apiBaseUrl}/api/articles/${articleId}`);
      const data = await response.json();
      setSelectedArticle(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    console.log('=== UPDATE START ===');
    console.log('Selected article before update:', selectedArticle);
    
    const updateData = {
      title: selectedArticle.title,
      authors: selectedArticle.authors,
      source: selectedArticle.source,
      pubyear: selectedArticle.pubyear,
      doi: selectedArticle.doi,
      claim: selectedArticle.claim,
      keyInsights: selectedArticle.keyInsights,
      tags: selectedArticle.tags
    };
    
    console.log('Data to be sent to backend:', updateData);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const url = `${apiBaseUrl}/api/articles/${selectedArticle._id}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Update successful, server response:', result);
        setShowModal(false);
        setSelectedArticle(null);
        await fetchApprovedArticles();
      } else {
        const errorText = await response.text();
        console.error('Update failed, error response:', errorText);
        alert('Update failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article: ' + error);
    }
    console.log('=== UPDATE END ===');
  };

  const handleChange = (field: string, value: string) => {
    if (!selectedArticle) return;
    
    if (field === 'authors' || field === 'tags') {
      const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
      setSelectedArticle(prev => prev ? { ...prev, [field]: arrayValue } : null);
    } else {
      setSelectedArticle(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const tableContainerStyle = {
    width: '100%',
    overflowX: 'auto' as const,
    marginTop: '20px'
  };

  const tableStyle = {
    minWidth: '1200px',
    borderCollapse: 'collapse' as const,
    fontFamily: 'Arial, sans-serif'
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    whiteSpace: 'nowrap' as const
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    whiteSpace: 'nowrap' as const,
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'sticky' as const,
    right: 0
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical' as const
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Approved Articles</h1>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Authors</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Publication Year</th>
              <th style={thStyle}>DOI</th>
              <th style={thStyle}>Claim</th>
              <th style={thStyle}>Key Insights</th>
              <th style={thStyle}>Tags</th>
              <th style={{ ...thStyle, position: 'sticky', right: 0, backgroundColor: '#f5f5f5' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td style={tdStyle} title={article.title}>{article.title}</td>
                <td style={tdStyle} title={article.authors.join(', ')}>{article.authors.join(', ')}</td>
                <td style={tdStyle} title={article.source}>{article.source}</td>
                <td style={tdStyle}>{article.pubyear}</td>
                <td style={tdStyle} title={article.doi}>{article.doi}</td>
                <td style={tdStyle} title={article.claim}>{article.claim}</td>
                <td style={tdStyle} title={article.keyInsights}>{article.keyInsights || '-'}</td>
                <td style={tdStyle} title={article.tags?.join(', ')}>{article.tags?.join(', ') || '-'}</td>
                <td style={{ ...tdStyle, position: 'sticky', right: 0, backgroundColor: 'white' }}>
                  <button style={buttonStyle} onClick={() => handleEdit(article._id)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedArticle && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Edit Article</h2>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Authors:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.authors.join(', ')}
                  onChange={(e) => handleChange('authors', e.target.value)}
                  placeholder="Separate authors with commas"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Source:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Publication Year:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.pubyear}
                  onChange={(e) => handleChange('pubyear', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DOI:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.doi}
                  onChange={(e) => handleChange('doi', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Claim:</label>
                <textarea
                  style={textareaStyle}
                  value={selectedArticle.claim}
                  onChange={(e) => handleChange('claim', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Key Insights:</label>
                <textarea
                  style={textareaStyle}
                  value={selectedArticle.keyInsights || ''}
                  onChange={(e) => handleChange('keyInsights', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tags:</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={selectedArticle.tags?.join(', ') || ''}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Separate tags with commas"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={buttonStyle} type="submit">
                  Update
                </button>
                <button 
                  style={{ ...buttonStyle, backgroundColor: '#6c757d' }} 
                  type="button" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}