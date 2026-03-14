import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Submission {
  id: string;
  name: string;
  productName: string;
  description: string;
  productLiveUrl: string;
  timestamp: string;
}

interface DashboardProps {
  isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/submissions');
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.sort((a: Submission, b: Submission) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } else {
          console.error("Failed to fetch");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar with all tiles */}
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Submissions ({submissions.length})</h3>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No submissions yet</div>
        ) : (
          <div className="submission-list">
            {submissions.map((sub) => (
              <div 
                key={sub.id} 
                className={`submission-item ${selectedSubmission?.id === sub.id ? 'active' : ''}`}
                onClick={() => setSelectedSubmission(sub)}
              >
                <div style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  {sub.productName}
                </div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  by {sub.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {new Date(sub.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {selectedSubmission ? (
        <div className="dashboard-content">
          {/* Details Panel on the Left */}
          <div className="details-panel glass-panel" style={{ border: 'none', borderRadius: 0, background: 'var(--surface-color)' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{selectedSubmission.productName}</h2>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Submitted by <span style={{ color: 'var(--text-main)' }}>{selectedSubmission.name}</span>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Description</h4>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                {selectedSubmission.description}
              </p>
            </div>
            
            <div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Live URL</h4>
              <a 
                href={selectedSubmission.productLiveUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'var(--primary-color)', wordBreak: 'break-all', textDecoration: 'none', fontWeight: 500 }}
              >
                {selectedSubmission.productLiveUrl}
              </a>
            </div>
          </div>

          {/* Iframe Preview on the Right */}
          <div className="preview-panel">
            <iframe 
              src={selectedSubmission.productLiveUrl} 
              className="preview-frame"
              title="Product Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            ></iframe>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', color: 'var(--text-muted)' }}>
          Select a submission tile to view details and preview
        </div>
      )}
    </div>
  );
};

export default Dashboard;
