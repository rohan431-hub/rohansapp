import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('');

  async function submitFeedback(e) {
    e.preventDefault();
    setStatus('Submitting feedback...');
    // We will connect this to AWS in the next phases
    setTimeout(() => setStatus('Feedback submitted successfully! (Test mode)'), 1000);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Submit Feedback</h2>
      <form onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Your Name:
          <input type="text" required style={{ width: '100%', padding: '8px' }} />
        </label>
        <label>Rating (1-5):
          <select style={{ width: '100%', padding: '8px' }}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </label>
        <label>Comments:
          <textarea required style={{ width: '100%', padding: '8px', height: '80px' }}></textarea>
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0073bb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Send Feedback
        </button>
      </form>
      <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>{status}</p>
    </main>
  );
}