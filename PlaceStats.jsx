import React, { useState, useEffect } from "react";

function PlaceStats() {
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // Handle error (e.g., permission denied)
        }
      );
    }
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`http://localhost:5000/api/place?place=${encodeURIComponent(place)}`);
      if (!res.ok) throw new Error("No data found");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Could not fetch data for this place.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <span role="img" aria-label="news">📰</span>
        Place News & Safety Stats
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter place name (e.g. Goa)"
          value={place}
          onChange={e => setPlace(e.target.value)}
        />
        <button
          onClick={fetchStats}
          disabled={loading || !place.trim()}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
            loading || !place.trim()
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Get Stats"}
        </button>
      </div>
      {error && (
        <div className="text-red-600 mb-2 text-sm">{error}</div>
      )}
      {result && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              result.decision === "go" ? "bg-green-500" : "bg-yellow-500"
            }`} />
            <span className="font-semibold text-lg">
              {result.decision?.toUpperCase()}
            </span>
          </div>
          <div className="text-gray-700 mb-2">
            <b>Score:</b> {result.score}
          </div>
          <div className="text-gray-700 mb-2">
            <b>Risk:</b> {result.scores?.risk?.toFixed(2)} &nbsp;|&nbsp;
            <b>Sentiment:</b> {result.scores?.sentiment?.toFixed(2)} &nbsp;|&nbsp;
            <b>Temperature:</b> {result.scores?.temperature ?? "N/A"}
          </div>
          <h4 className="font-semibold mt-4 mb-2 text-blue-600">Top Articles:</h4>
          <ul className="space-y-2">
            {result.top_articles?.map((a, i) => (
              <li key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium hover:underline"
                >
                  {a.title}
                </a>
                <div className="text-xs text-gray-500 mt-1">
                  {a.risk && <span className="mr-2">[{a.risk}]</span>}
                  {a.tags && a.tags.length > 0 && <span>({a.tags.join(", ")})</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlaceStats;