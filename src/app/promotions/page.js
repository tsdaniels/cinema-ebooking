'use client';

import { useEffect, useState } from 'react';

export default function ManagePromotions() {
  const [movies, setMovies] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState({ movieId: '', title: '', message: '' });

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then(setMovies);

    fetch('/api/promotions')
      .then((res) => res.json())
      .then(setPromotions);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload();
  };

  const sendPromotion = async (id) => {
    const res = await fetch('/api/promotions/send', {
      method: 'POST',
      body: JSON.stringify({ promotionId: id }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      alert('Promotion sent!');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-red-500 border-b-4 border-red-600 pb-2">
        🎟️ Manage Promotions
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 space-y-4"
      >
        <select
          value={form.movieId}
          onChange={(e) => setForm({ ...form, movieId: e.target.value })}
          required
          className="w-full p-3 text-lg bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">🎬 Select a movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Promotion Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-3 text-lg bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <textarea
          placeholder="Promotion Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          className="w-full p-3 text-lg bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition">
          📢 Submit Promotion
        </button>
      </form>

      <div className="w-full max-w-4xl mt-10">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          📜 Existing Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.length > 0 ? (
            promotions.map((promo) => (
              <div
                key={promo._id}
                className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800 hover:border-blue-500 transition"
              >
                <h3 className="text-xl font-semibold text-white">
                  {promo.title}
                </h3>
                <p className="text-sm text-gray-400">
                  🎬 {promo.movieId?.title}
                </p>
                <p className="text-sm text-gray-400">💬 {promo.message}</p>
                <button
                  onClick={() => sendPromotion(promo._id)}
                  disabled={promo.sent}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md disabled:opacity-50"
                >
                  {promo.sent ? '✅ Sent' : '📨 Send Promotion'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No promotions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
