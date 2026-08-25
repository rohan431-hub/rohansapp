import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
const client = generateClient();

export default function App() {
  const { user, signOut } = useAuthenticator();
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const { data: items } = await client.models.UserProfile.list();
      setProfiles(items);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  return (
    <main className="card" style={{ maxWidth: '450px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>Feedback Collector</h1>
      <p>Logged in as: <strong>{user?.signInDetails?.loginId || user?.username}</strong></p>

      <section style={{ margin: '1.5rem 0', textAlign: 'left', background: '#f0f4f8', padding: '1rem', borderRadius: '6px' }}>
        <h3>Registered User Profiles:</h3>
        {profiles.length === 0 ? (
          <p>No confirmed profiles yet.</p>
        ) : (
          <ul>
            {profiles.map((p) => (
              <li key={p.id}>{p.email}</li>
            ))}
          </ul>
        )}
      </section>

      <button 
        onClick={signOut} 
        style={{ padding: '10px 20px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </main>
  );
}