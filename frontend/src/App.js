import React from 'react';
import './App.css'; 
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Feedback System</h1>
        <p>Real-time Sentiment Analysis & Automated Actions</p>
      </header>
      
      <UserDashboard />
      <AdminDashboard />
    </div>
  );
}

export default App;
