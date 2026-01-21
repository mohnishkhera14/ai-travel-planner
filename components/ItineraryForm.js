import { useState, useEffect } from 'react';

/**
 * ItineraryForm is responsible for collecting user input such as destination,
 * travel dates and optional preferences. It exposes callbacks for loading
 * state management and for delivering the generated itinerary back to the
 * parent component. The component also integrates a simple voice search
 * using the Web Speech API so travellers can speak their destination
 * instead of typing it. If the browser does not support speech recognition
 * the voice search button will not be displayed.
 */
export default function ItineraryForm({ onItinerary, onLoading }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferences, setPreferences] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);

  // Detect whether the browser supports the Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // Start listening for a spoken destination and update the destination field
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setDestination(transcript);
    };
    recognition.start();
  };

  // Submit the form and call the API route to generate the itinerary
  const handleSubmit = async e => {
    e.preventDefault();
    // Basic validation
    if (!destination || !startDate || !endDate) return;
    onLoading(true);
    try {
      const res = await fetch('/api/generateItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, startDate, endDate, preferences })
      });
      const data = await res.json();
      onItinerary(data);
    } catch (err) {
      console.error('Failed to generate itinerary', err);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-4 bg-white p-6 rounded shadow-md"
    >
      {/* Destination input with optional voice search */}
      <div>
        <label className="block font-medium mb-1 text-gray-700">Destination</label>
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="e.g. Paris, France"
        />
        {speechSupported && (
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Speak destination
          </button>
        )}
      </div>
      {/* Date inputs */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block font-medium mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
      {/* Preferences textarea */}
      <div>
        <label className="block font-medium mb-1 text-gray-700">Preferences</label>
        <textarea
          value={preferences}
          onChange={e => setPreferences(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows="3"
          placeholder="Activities, budget, interests..."
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Generate Itinerary
      </button>
    </form>
  );
}