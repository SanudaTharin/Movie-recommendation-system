import React, { useState } from 'react';
import './App.css';

function App() {
  const [movie, setMovie] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0); // NEW

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  const getRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);
    setSelectedMovieIndex(0);

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie })
      });

      const data = await response.json();
      const titles = data.recommendations || [];

      const detailedRecs = await Promise.all(
        titles.map(async (title) => {
          try {
            const omdbRes = await fetch(
              `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`
            );
            const omdbData = await omdbRes.json();

            return {
              title: omdbData.Title || title,
              genre: omdbData.Genre || 'N/A',
              year: omdbData.Year || 'N/A',
              plot: omdbData.Plot || 'Plot not available',
              rating: omdbData.imdbRating || 'N/A',
              poster: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
            };
          } catch (err) {
            return {
              title,
              genre: 'N/A',
              year: 'N/A',
              plot: 'Error fetching plot',
              rating: 'N/A',
              poster: null,
            };
          }
        })
      );

      setRecommendations(detailedRecs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMovie = recommendations[selectedMovieIndex];

  return (
    <div className="app-container">
      <h1 className="title">Movie Recommender</h1>
      <input
        type="text"
        placeholder="Enter a movie name"
        className="movie-input"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
      />
      <button className="submit-button" onClick={getRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      {loading ? (
        <p className="loading">Fetching recommendations...</p>
      ) : recommendations.length > 0 && (
        <>
          {/* Big Card */}
          <div className="featured-card">
            {selectedMovie?.poster && <img src={selectedMovie.poster} alt={selectedMovie.title} className="poster" />}
            <div className="movie-info">
              <h2>{selectedMovie.title} ({selectedMovie.year})</h2>
              <p><strong>Genre:</strong> {selectedMovie.genre}</p>
              <p><strong>IMDb Rating:</strong> <span style={{ color: 'gold' }}>⭐</span> {selectedMovie.rating}</p>
              <p><strong>Plot:</strong> {selectedMovie.plot}</p>
            </div>
          </div>

          {/* Small Cards Row */}
          <div className="small-card-container">
            {recommendations.map((rec, index) => (
              <div
                className={`small-card ${index === selectedMovieIndex ? 'active' : ''}`}
                key={index}
                onClick={() => setSelectedMovieIndex(index)}
              >
                <h4>{rec.title}</h4>
                <p><span style={{ color: 'gold' }}>⭐</span> {rec.rating}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
