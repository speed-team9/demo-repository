import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface PendingArticle {
  _id?: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  status: string;
  submitter: string;
  submitTime: string;
}

export default function PendingArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<PendingArticle[]>([]);

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(`${apiBaseUrl}/api/articles/review/status?status=pending`);
      const data = await response.json();
      console.log('Fetched articles:', data);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching pending articles:', error);
    }
  };

  const handleReview = async (title: string, status: 'accepted' | 'rejected') => {
    console.log('Reviewing article with title:', title, 'with status:', status);
    
    if (!title) {
      console.error('Invalid article title');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(`${apiBaseUrl}/api/articles/review/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
      });

      if (response.ok) {
        setArticles(articles.map(article => 
          article.title === title ? { ...article, status } : article
        ));
      } else {
        const errorData = await response.json();
        console.error('Review failed:', errorData);
        alert(`Review failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error reviewing article:', error);
      alert('Error reviewing article');
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '12px'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    margin: '0 4px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pending Articles</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Authors</th>
            <th style={thStyle}>Source</th>
            <th style={thStyle}>Publication Year</th>
            <th style={thStyle}>DOI</th>
            <th style={thStyle}>Claim</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => {
            const key = article._id || `article-${index}`;
            
            return (
              <tr key={key}>
                <td style={tdStyle}>{article.title}</td>
                <td style={tdStyle}>{article.authors.join(', ')}</td>
                <td style={tdStyle}>{article.source}</td>
                <td style={tdStyle}>{article.pubyear}</td>
                <td style={tdStyle}>{article.doi}</td>
                <td style={tdStyle}>{article.claim}</td>
                <td style={tdStyle}>
                  {(!article.status || article.status === 'pending') ? (
                    <>
                      <button 
                        style={buttonStyle}
                        onClick={() => handleReview(article.title, 'accepted')}
                      >
                        Accept
                      </button>
                      <button 
                        style={rejectButtonStyle}
                        onClick={() => handleReview(article.title, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span style={{ 
                      color: article.status === 'accepted' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {article.status}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}