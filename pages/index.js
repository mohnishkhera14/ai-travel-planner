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
          Stylesheets for MapLibre and Tailwind CSS are now loaded via a
          custom Document (see pages/_document.js).  Keep the head
          minimal here to avoid duplicating CSS links.
        */}
      </Head>
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-4">AI‑Powered Travel Planner & Recommendation Dashboard</h1>
        <p className="mb-6 text-gray-700">
          Plan the perfect trip with the help of artificial intelligence. Generate personalised
          itineraries, get smart recommendations and visualise your route on an interactive map.
        </p>
        {/* Itinerary form */}
        <ItineraryForm onItinerary={handleItinerary} onLoading={setLoading} />
        {loading && <p className="mt-4 text-gray-600">Loading...</p>}
        {/* Display itinerary when available */}
        {itinerary && (
          <div className="mt-8 bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Itinerary</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{itinerary}</ReactMarkdown>
            </div>
            <button
              onClick={handleSummarize}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Summarise Trip
            </button>
          </div>
        )}
        {/* Display summary when available */}
        {summary && (
          <div className="mt-8 bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Trip Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
        {/* Display recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommended Places</h2>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="text-gray-700">
                  {rec.name}
                </li>
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