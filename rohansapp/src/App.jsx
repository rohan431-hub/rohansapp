import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient();

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <FeedbackDashboard signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

function FeedbackDashboard({ signOut, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userEmail = user?.signInDetails?.loginId || user?.username || 'Authenticated User';

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    setLoading(true);
    try {
      const response = await client.models.Feedback.list();
      if (response && response.data) {
        setFeedbacks(response.data);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await client.models.Feedback.create({
        title: title.trim(),
        comment: comment.trim(),
        rating: parseInt(rating, 10),
        submittedBy: userEmail,
      });

      setTitle('');
      setComment('');
      setRating('5');
      await fetchFeedbacks();
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ background: '#ffffff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#0f172a' }}>Feedback Collector</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
              Logged in as: <strong style={{ color: '#0f172a' }}>{userEmail}</strong>
            </p>
          </div>
          <button
            onClick={signOut}
            style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >
            Sign Out
          </button>
        </header>

        {/* Submission Form */}
        <section style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18, color: '#1e293b' }}>Submit New Feedback</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Subject / Title
              </label>
              <input
                type="text"
                placeholder="e.g., Application Performance, Feature Request"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
                <option value="2">⭐⭐ (2 - Below Average)</option>
                <option value="1">⭐ (1 - Poor)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Your Feedback
              </label>
              <textarea
                placeholder="Write your comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{ background: submitting ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: 6, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15, transition: 'background 0.2s' }}
            >
              {submitting ? 'Saving Feedback...' : 'Submit Feedback'}
            </button>
          </form>
        </section>

        {/* Feedback List */}
        <section style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>
              Submitted Feedbacks ({feedbacks.length})
            </h2>
            <button
              onClick={fetchFeedbacks}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Loading feedback records...</p>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
              <p style={{ margin: 0, color: '#64748b' }}>No feedback submissions yet. Submit the first one above!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#f8fafc' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{item.title}</h3>
                    <span style={{ fontSize: 14 }}>{'⭐'.repeat(item.rating || 5)}</span>
                  </div>
                  <p style={{ margin: '8px 0 12px', color: '#334155', fontSize: 14, whiteSpace: 'pre-wrap' }}>
                    {item.comment}
                  </p>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    Submitted by: <strong>{item.submittedBy || 'Anonymous'}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}