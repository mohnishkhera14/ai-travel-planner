import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Travel Planner</title>
      </Head>
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-4">AI Travel Planner</h1>
        <p className="mb-4">
          Welcome to your AI‑powered travel companion. This app will help you plan personalised
          itineraries, optimise routes and explore places like a local.
        </p>
        <p>
          Start by entering your destination and travel dates. The AI will generate a tailored
          itinerary just for you.
        </p>
      </main>
    </>
  );
}
