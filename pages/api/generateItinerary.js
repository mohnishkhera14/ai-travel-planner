// The OpenAI client has been removed from this project to avoid
// dependency on a proprietary API.  You can integrate your own
// open‑source language model here if desired.
import { recommend } from '../../lib/recommendation';

/**
 * API route for generating a travel itinerary. It expects a POST request
 * containing destination, startDate, endDate and preferences. It then
 * generates a day-by-day plan and uses a simple recommendation
 * engine to suggest points of interest.  In this open-source version
 * there is no dependency on a proprietary API.  If you wish to use
 * a language model, integrate your own open-source model in place of
 * the fallback itinerary below.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
  const { destination, startDate, endDate, preferences } = req.body;
  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const itineraryPrompt = `You are a travel concierge. Create a day-by-day itinerary for a trip to ${destination} from ${startDate} to ${endDate}. Focus on personalised experiences based on the following preferences: ${preferences || 'no specific preferences'}. Suggest both popular sights and lesser known gems, include dining recommendations, and briefly describe each day. Format the itinerary as Markdown with headings for each day.`;

  // Always generate a simple fallback itinerary.  Feel free to replace this
  // block with calls to an open‑source language model running on your own
  // infrastructure.  This fallback suggests a few general activities.
  const itinerary = `## Day 1\nArrive in ${destination} and explore the city centre. Visit a local café and take a walking tour.\n\n## Day 2\nSpend the day visiting museums and galleries. Enjoy dinner at a highly rated restaurant.\n\n## Day 3\nTake a day trip to a nearby attraction. Sample local cuisine and shop for souvenirs.`;
  const recommendations = recommend(preferences);
  return res.status(200).json({ itinerary, recommendations });
}