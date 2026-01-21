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
        {/*
          Apply a subtle background colour on the body to improve visual contrast.
          Using Tailwind's gray scale via className on the <body> tag ensures
          the page appears less plain without requiring custom CSS.  We chose
          bg-gray-100 for a light neutral backdrop.  Note that className can
          safely be added here because the Document component is rendered
          server-side and supports React props.
        */}
        <body className="bg-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;