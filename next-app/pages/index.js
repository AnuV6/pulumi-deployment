import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/message');
        if (!response.ok) {
          throw new Error('Failed to fetch message');
        }
        const data = await response.json();
        setMessage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Next.js Backend Demo</title>
        <meta name="description" content="Demo of Next.js backend integration" />
      </Head>

      <main>
        <h1>Welcome to the Backend Demo</h1>
        
        <div className="card">
          <h2>Backend Response:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : (
            <div>
              <p><strong>Message:</strong> {message.message}</p>
              <p><strong>Timestamp:</strong> {new Date(message.timestamp).toLocaleString()}</p>
              <p><strong>Environment:</strong> {message.environment}</p>
              <p><strong>Database Status:</strong> {message.database}</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }


        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 100%;
        }

        .card:hover {
          border-color: #0070f3;
        }

        .error {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}
