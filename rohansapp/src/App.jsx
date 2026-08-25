import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient();

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <FeedbackApp signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

function FeedbackApp({ signOut, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    const { data: items } = await client.models.Feedback.list();
    setFeedbacks(items);
  }

  async function createFeedback(e) {
    e.preventDefault();
    if (!title || !comment) return;

    await client.models.Feedback.create({
      title,
      comment,
      rating: parseInt(rating, 10),
      submittedBy: user?.signInDetails?.loginId || user?.username,
    });

    setTitle('');
    setComment('');
    setRating(5);
    fetchFeedback();
  }

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Feedback Collector</h2>
        <button onClick={signOut} style={{ padding: '6px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
      <p>Logged in as: <strong>{user?.signInDetails?.loginId || user?.username}</strong></p>

      <form onSubmit={createFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#f7fafc', padding: 20, borderRadius: 8 }}>
        <h3>Submit New Feedback</h3>
        <input
          type="text"
          placeholder="Topic / Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Your comments or feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <label>
          Rating (1-5):
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ marginLeft: 8, padding: 4 }}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </label>
        <button type="submit" style={{ padding: '10px', background: '#319795', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Feedback
        </button>
      </form>

      <div style={{ marginTop: 30 }}>
        <h3>Submitted Feedback ({feedbacks.length})</h3>
        {feedbacks.length === 0 ? (
          <p style={{ color: '#718096' }}>No feedback submitted yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {feedbacks.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', padding: 15, borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{item.title}</strong>
                  <span>{'⭐'.repeat(item.rating || 5)}</span>
                </div>
                <p style={{ margin: '8px 0', color: '#4a5568' }}>{item.comment}</p>
                <small style={{ color: '#a0aec0' }}>By: {item.submittedBy || 'Anonymous'}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}