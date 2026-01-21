import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

// Provide your Mapbox access token via environment variable. The token
// should be configured in a `.env.local` file as NEXT_PUBLIC_MAPBOX_TOKEN.
// MapLibre is an open‑source fork of Mapbox GL JS.  It does not require an
// access token to render maps using public tile sources.  If you supply your
// own self‑hosted vector tiles or styles, configure the style URL below.
maplibregl.accessToken = undefined;

/**
 * Map component renders a Mapbox map with optional markers for each point of
 * interest provided by the itinerary generator. It centres the map on the
 * first point (if available) or the world otherwise. This component is
 * intentionally simple and can be extended to draw routes using the
 * Mapbox Directions API or to cluster markers.
 */
export default function Map({ points }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialise the map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // Use the default open‑source style from MapLibre demo.  You can
      // substitute your own tiles or style JSON here.  See
      // https://maplibre.org/ for details.
      style: 'https://demotiles.maplibre.org/style.json',
      center:
        points && points.length > 0
          ? [points[0].lng, points[0].lat]
          : [0, 0],
      zoom: points && points.length > 0 ? 10 : 2
    });

    // Add markers for each point
    if (points && points.length) {
      points.forEach(p => {
        new maplibregl.Marker().setLngLat([p.lng, p.lat]).addTo(map);
      });
    }

    // Clean up on unmount
    return () => map.remove();
  }, [points]);

  return <div ref={mapContainerRef} className="w-full h-96 my-4" />;
}