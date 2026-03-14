import React, { useState } from 'react';

const FormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    productName: '',
    description: '',
    productLiveUrl: ''
  });
  const [status, setStatus] = useState<'' | 'saving' | 'success' | 'error'>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', productName: '', description: '', productLiveUrl: '' });
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      setStatus('error');
    }
  };

  return (
    <div className="submit-page">
      <div className="glass-panel submit-form">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Submit Your Project</h2>
        {status === 'success' && (
          <div style={{ padding: '1rem', background: '#e6f4ea', border: '1px solid var(--success-color)', borderRadius: '4px', marginBottom: '1.5rem', color: '#137333', fontSize: '0.875rem', fontWeight: 500 }}>
            Successfully submitted! Thank you.
          </div>
        )}
        
        {status === 'error' && (
          <div style={{ padding: '1rem', background: '#fce8e6', border: '1px solid var(--danger-color)', borderRadius: '4px', marginBottom: '1.5rem', color: '#c5221f', fontSize: '0.875rem', fontWeight: 500 }}>
            Failed to submit. Check back later or ensure the server is running.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Jane Doe"
            />
          </div>
          
          <div className="input-group">
            <label>Product Name</label>
            <input 
              type="text" 
              name="productName" 
              value={formData.productName} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Cool App"
            />
          </div>
          
          <div className="input-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows={4}
              placeholder="Tell us about your product..."
            ></textarea>
          </div>
          
          <div className="input-group">
            <label>Product Live URL</label>
            <input 
              type="url" 
              name="productLiveUrl" 
              value={formData.productLiveUrl} 
              onChange={handleChange} 
              required 
              placeholder="https://yourproduct.com"
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={status === 'saving'}
          >
            {status === 'saving' ? 'Submitting...' : 'Submit Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
