// Simple recommendation engine for travel destinations. This module uses a
// static dataset and computes a basic similarity score between the user's
// stated preferences and each destination's category tags. You can
// replace this with a more sophisticated model using TensorFlow.js if you
// have suitable training data.

// Removed TensorFlow import as it's not used and causes peer dependency issues

// Example dataset of points of interest with category tags. In a real
// application you would fetch this from a travel API or database.
const places = [
  { name: 'Louvre Museum', location: { lat: 48.8606, lng: 2.3376 }, categories: ['art', 'museum'] },
  { name: 'Eiffel Tower', location: { lat: 48.8584, lng: 2.2945 }, categories: ['historical', 'site'] },
  { name: 'Bondi Beach', location: { lat: -33.8908, lng: 151.2743 }, categories: ['beach', 'adventure'] },
  { name: 'Mount Fuji', location: { lat: 35.3606, lng: 138.7274 }, categories: ['adventure', 'nature'] },
  { name: 'Tsukiji Market', location: { lat: 35.6655, lng: 139.7708 }, categories: ['food', 'market'] }
];

/**
 * Recommend a list of destinations based on user preferences. The function
 * splits the preference string into tokens and counts how many categories
 * match for each place. It then returns the top N matches.
 *
 * @param {string} preferences Free-form user input describing interests
 * @param {number} [topN=3] How many recommendations to return
 * @returns {Array<{name: string, location: {lat: number, lng: number}, categories: string[]}>}
 */
export function recommend(preferences, topN = 3) {
  if (!preferences) return places.slice(0, topN);
  const prefTokens = preferences.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = places.map(place => {
    const matchCount = place.categories.filter(cat => prefTokens.includes(cat)).length;
    return { place, score: matchCount };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(item => item.place);
}

/**
 * Export the raw dataset for consumers that want to inspect available
 * destinations or build their own recommendation logic.
 */
export const dataset = places;