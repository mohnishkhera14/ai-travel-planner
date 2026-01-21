import Head from 'next/head';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import ItineraryForm from '../components/ItineraryForm';
import Map from '../components/Map';
import ReactMarkdown from 'react-markdown';

/**
 * Home page for the AI Travel Planner. This page stitches together the
 * itinerary form, map view, recommendations and trip summary. It uses
 * serverless API routes under `pages/api` to generate content via
 * OpenAI. The map component is loaded dynamically to avoid SSR issues.
 */
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');
  const [mapPoints, setMapPoints] = useState([]);

  const handleItinerary = data => {
    setItinerary(data.itinerary);
    setRecommendations(data.recommendations);
    // Extract map coordinates from recommendations if available
    const points = data.recommendations
      .filter(r => r.location && typeof r.location.lat === 'number')
      .map(r => ({ lat: r.location.lat, lng: r.location.lng }));
    setMapPoints(points);
  };

  const handleSummarize = async () => {
    if (!itinerary) return;
    setLoading(true);
    try {
      const res = await fetch('/api/summarizeTrip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary })
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Failed to summarise trip', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Travel Planner</title>
        {/*
          Use CDN-delivered styles instead of proprietary CSS.  The map
          component now uses MapLibre, so include its stylesheet from
          a public CDN.  We also load Tailwind CSS via CDN to style the
          interface without requiring a build step.  See
          https://maplibre.org/ for more information on MapLibre and
          https://tailwindcss.com/docs/installation/play-cdn for the
          Tailwind CDN reference.
        */}
        <link
          href="https://cdn.jsdelivr.net/npm/maplibre-gl@3.5.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.4/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-4">AI‑Powered Travel Planner & Recommendation Dashboard</h1>
        <p className="mb-6">
          Plan the perfect trip with the help of artificial intelligence. Generate personalised
          itineraries, get smart recommendations and visualise your route on an interactive map.
        </p>
        {/* Itinerary form */}
        <ItineraryForm onItinerary={handleItinerary} onLoading={setLoading} />
        {loading && <p className="mt-4 text-gray-600">Loading...</p>}
        {/* Display itinerary when available */}
        {itinerary && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Your Itinerary</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{itinerary}</ReactMarkdown>
            </div>
            <button
              onClick={handleSummarize}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Summarise Trip
            </button>
          </div>
        )}
        {/* Display summary when available */}
        {summary && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Trip Summary</h2>
            <p>{summary}</p>
          </div>
        )}
        {/* Display recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Recommended Places</h2>
            <ul className="list-disc list-inside">
              {recommendations.map((rec, idx) => (
                <li key={idx}>{rec.name}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Map for visualising points */}
        {mapPoints && mapPoints.length > 0 && <Map points={mapPoints} />}
      </main>
    </>
  );
}