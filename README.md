AI Travel Planner
=================

This project is a **Next.js** based AI‑powered travel assistant. It leverages serverless functions,
the Google Maps API and generative AI to plan personalised itineraries and optimise travel routes
in real time.

### Features

* **Personalised itinerary generation** – use AI models (e.g. GPT and travel APIs) to recommend
  destinations based on user preferences, budgets and travel dates.
* **Real‑time route optimisation** – integrate the Google Maps API to calculate optimal
  routes, taking traffic and weather into account.
* **Smart cost management** – track expenses and suggest budget‑friendly alternatives while
  travelling.
* **Cultural insights** – provide historical and cultural context for destinations using
  generative AI and curated datasets.
* **Responsive & accessible UI** – built with Next.js and Tailwind CSS for mobile‑first
  performance and accessibility.

### Getting started

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/your‑username/ai‑travel‑planner.git
   cd ai‑travel‑planner
   npm install
   ```

2. Create a `.env.local` file in the project root with your API keys:

   ```env
   OPENAI_API_KEY=your‑openai‑key
   GOOGLE_MAPS_API_KEY=your‑maps‑api‑key
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

Serverless functions live under `pages/api`. The main UI is in `pages/index.js`. Feel free to
extend the app with additional pages, API routes and integrations such as chatbots or voice
search.
