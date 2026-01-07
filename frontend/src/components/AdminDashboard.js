import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  
  const API_URL = 'http://localhost:8001/api/admin/reviews';
  
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_URL);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'; // Green
    if (rating === 3) return 'linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%)'; // Yellow
    return 'linear-gradient(135deg, #f56565 0%, #c53030 100%)'; // Red
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📊 Live Admin Insights</h2>
        <span className="live-badge">● Live Feed</span>
      </div>
      
      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>Waiting for new customer feedback...</p>
        </div>
      ) : (
        <div className="grid-container">
          {reviews.map((r) => (
            <div key={r.id} className="insight-card">
              {/* Colored Header */}
              <div className="card-header" style={{ background: getRatingColor(r.user_rating) }}>
                <span className="rating-number">{r.user_rating} ★</span>
                <span className="date-text">{new Date(r.created_at).toLocaleTimeString()}</span>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <p className="review-text">"{r.review_text}"</p>
                
                <div className="ai-section">
                  <h4>🤖 AI Summary</h4>
                  <p>{r.ai_summary}</p>
                </div>

                <div className="action-section">
                  <h4>⚡ Recommended Actions</h4>
                  <div className="action-tags">
                    {/* Split actions by newline or bullet point if possible, otherwise just show text */}
                    <span className="action-chip">{r.ai_actions}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;