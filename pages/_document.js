import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document to include global stylesheets.  This file runs on the
 * server and is used to augment the application's <html> and <body> tags.
 * We place external CSS links here rather than in individual pages so
 * they are only included once and avoid duplication.  The MapLibre
 * stylesheet is required for the interactive map, and the Tailwind
 * stylesheet provides the utility classes used throughout the UI.
 */
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://cdn.jsdelivr.net/npm/maplibre-gl@3.5.0/dist/maplibre-gl.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.4/dist/tailwind.min.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;