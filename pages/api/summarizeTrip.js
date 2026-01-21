// Removed dependency on the proprietary OpenAI API.  Replace with your own
// summarization implementation if you have an open‑source model or service.

/**
 * API route to summarise a generated itinerary into a travel blog post or
 * short summary. Uses the OpenAI API if available or falls back to a
 * simple static summary. Expects a POST request with the `itinerary`
 * field containing the markdown itinerary text.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
  const { itinerary } = req.body;
  if (!itinerary) {
    return res.status(400).json({ error: 'Missing itinerary' });
  }
  // Provide a simple static summary.  To integrate an open‑source model,
  // replace this assignment with your own summarization logic.
  const summary = 'This trip promises a balance of cultural exploration, culinary delights and outdoor adventures. You will discover iconic landmarks, sample local cuisine and create lasting memories.';
  return res.status(200).json({ summary });
}