import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Provide your Mapbox access token via environment variable. The token
// should be configured in a `.env.local` file as NEXT_PUBLIC_MAPBOX_TOKEN.
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

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
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:
        points && points.length > 0
          ? [points[0].lng, points[0].lat]
          : [0, 0],
      zoom: points && points.length > 0 ? 10 : 2
    });

    // Add markers for each point
    if (points && points.length) {
      points.forEach(p => {
        new mapboxgl.Marker().setLngLat([p.lng, p.lat]).addTo(map);
      });
    }

    // Clean up on unmount
    return () => map.remove();
  }, [points]);

  return <div ref={mapContainerRef} className="w-full h-96 my-4" />;
}
