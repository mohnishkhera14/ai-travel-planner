import { Configuration, OpenAIApi } from 'openai';

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
  const apiKey = process.env.OPENAI_API_KEY;
  let summary = '';
  if (apiKey) {
    try {
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      const prompt = `Summarise the following travel itinerary into a concise travel blog post. Highlight the most interesting activities and provide an engaging narrative.\n\n${itinerary}`;
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a creative travel blogger.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.7
      });
      summary = response.data.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI API error:', err);
    }
  }
  if (!summary) {
    summary = 'This trip promises a balance of cultural exploration, culinary delights and outdoor adventures. You will discover iconic landmarks, sample local cuisine and create lasting memories.';
  }
  return res.status(200).json({ summary });
}