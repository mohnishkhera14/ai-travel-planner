import { Configuration, OpenAIApi } from 'openai';
import { recommend } from '../../lib/recommendation';

/**
 * API route for generating a travel itinerary. It expects a POST request
 * containing destination, startDate, endDate and preferences. It then
 * invokes the OpenAI Chat API to produce a day-by-day plan and uses a
 * simple recommendation engine to suggest points of interest. If the
 * OPENAI_API_KEY environment variable is not configured or the API
 * request fails, a fallback itinerary is returned instead.
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

  let itinerary = '';
  // Attempt to call OpenAI if an API key is provided
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert travel planner.' },
          { role: 'user', content: itineraryPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      });
      itinerary = response.data.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI API error:', err);
    }
  }
  // Fallback itinerary if OpenAI is not available
  if (!itinerary) {
    itinerary = `## Day 1\nArrive in ${destination} and explore the city centre. Visit a local café and take a walking tour.\n\n## Day 2\nSpend the day visiting museums and galleries. Enjoy dinner at a highly rated restaurant.\n\n## Day 3\nTake a day trip to a nearby attraction. Sample local cuisine and shop for souvenirs.`;
  }
  const recommendations = recommend(preferences);
  return res.status(200).json({ itinerary, recommendations });
}
