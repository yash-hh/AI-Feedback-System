import React, { useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  
  const API_URL = 'http://localhost:8001/api/feedback'; 
  
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API_URL, {
        rating: parseInt(rating),
        review
      });
      setResponse(res.data.ai_response);
    } catch (err) {
      alert("Error submitting feedback. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>User Feedback Portal</h2>
      
      {!response ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>How would you rate your experience?</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">★★★★★ - Excellent</option>
              <option value="4">★★★★☆ - Good</option>
              <option value="3">★★★☆☆ - Average</option>
              <option value="2">★★☆☆☆ - Poor</option>
              <option value="1">★☆☆☆☆ - Terrible</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Tell us more about it:</label>
            <textarea 
              placeholder="What did you like or dislike? (AI will analyze this)..." 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              required
              rows="4"
            />
          </div>
          
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Analyzing with AI...' : 'Submit Feedback'}
          </button>
        </form>
      ) : (
        <div className="ai-response-box">
          <div className="ai-content">
            <h3>✨ AI Analysis Complete</h3>
            <p>"{response}"</p>
            <button className="secondary-btn" onClick={() => {setResponse(null); setReview('');}}>
              Submit New Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;