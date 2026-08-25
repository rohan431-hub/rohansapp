import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ maxWidth: 500, margin: '50px auto', padding: 20, textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1>Feedback App</h1>
          <p>Welcome, <strong>{user?.signInDetails?.loginId || user?.username}</strong>!</p>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 20, borderRadius: 8, margin: '20px 0' }}>
            <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>Authentication & Backend Successfully Connected!</p>
          </div>
          <button 
            onClick={signOut} 
            style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </main>
      )}
    </Authenticator>
  );
}