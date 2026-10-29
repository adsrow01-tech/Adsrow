import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { targetAreas } from "../lib/siteContent";

const VIJAYAWADA_CENTER = [80.6480, 16.5062];
const OPEN_STREET_MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

// Adsrow currently stores service areas, not verified per-screen coordinates.
// These are deliberately labelled demo area markers in the UI.
const screenAreas = [
  { name: "Bhavanipuram", lat: 16.5110, lon: 80.6400 },
  { name: "Governorpet", lat: 16.5190, lon: 80.6260 },
  { name: "Labbipet", lat: 16.5070, lon: 80.6410 },
  { name: "Moghalrajpuram", lat: 16.5030, lon: 80.6460 },
  { name: "Benz Circle", lat: 16.4970, lon: 80.6670 },
  { name: "Patamata", lat: 16.4933, lon: 80.6612 },
  { name: "Gunadala", lat: 16.5203, lon: 80.6642 },
  { name: "Ajit Singh Nagar", lat: 16.5482, lon: 80.6492 },
].filter(({ name }) => targetAreas.includes(name));

function areaFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: screenAreas.map((area) => ({
      type: "Feature",
      properties: { name: area.name },
      geometry: { type: "Point", coordinates: [area.lon, area.lat] },
    })),
  };
}

function popupMarkup(areaName) {
  return `<div class="adsrow-map-popup-content"><strong>${areaName}</strong><span>Demo area marker</span><small>Exact screen coordinates and status are not verified.</small></div>`;
}

export default function VijayawadaCoverageMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapHasLoadedRef = useRef(false);
  const [mapStatus, setMapStatus] = useState("loading");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return undefined;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: OPEN_STREET_MAP_STYLE,
      center: VIJAYAWADA_CENTER,
      zoom: 12.1,
      minZoom: 10.5,
      maxZoom: 16,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "© OpenStreetMap contributors" }), "bottom-right");

    map.on("load", () => {
      mapHasLoadedRef.current = true;
      setMapStatus("ready");
    });
    map.on("error", () => {
      if (!mapHasLoadedRef.current) setMapStatus("error");
    });

    const markerElements = screenAreas.map((area) => {
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.className = "home-maplibre-screen-marker";
      markerElement.title = `${area.name} — demo area marker`;
      markerElement.setAttribute("aria-label", `${area.name}, demo screen area marker`);
      markerElement.innerHTML = "<span class=\"home-maplibre-screen-glow\"></span><span class=\"home-maplibre-screen-display\"><span></span></span>";

      const marker = new maplibregl.Marker({ element: markerElement, anchor: "center" })
        .setLngLat([area.lon, area.lat])
        .addTo(map);
      markerElement.addEventListener("click", (event) => {
        event.stopPropagation();
        new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 22, className: "adsrow-map-popup" })
          .setLngLat([area.lon, area.lat])
          .setHTML(popupMarkup(area.name))
          .addTo(map);
      });
      return { marker, markerElement };
    });
    markersRef.current = markerElements;

    function updateMarkerVisibility() {
      const showIndividualMarkers = map.getZoom() >= 11.5;
      markerElements.forEach(({ markerElement }) => {
        markerElement.style.display = showIndividualMarkers ? "grid" : "none";
      });
    }

    map.on("load", () => {
      map.addSource("adsrow-screen-areas", {
        type: "geojson",
        data: areaFeatureCollection(),
        cluster: true,
        clusterMaxZoom: 11.4,
        clusterRadius: 60,
      });
      map.addLayer({
        id: "adsrow-screen-clusters",
        type: "circle",
        source: "adsrow-screen-areas",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#164A9A",
          "circle-radius": ["step", ["get", "point_count"], 22, 5, 27, 8, 32],
          "circle-stroke-color": "#00E6E2",
          "circle-stroke-width": 3,
          "circle-opacity": .96,
        },
      });
      map.addLayer({
        id: "adsrow-screen-cluster-count",
        type: "symbol",
        source: "adsrow-screen-areas",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 14 },
        paint: { "text-color": "#FFFFFF" },
      });
      updateMarkerVisibility();
    });
    map.on("zoom", updateMarkerVisibility);
    map.on("click", "adsrow-screen-clusters", async (event) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const clusterId = feature.properties?.cluster_id;
      const source = map.getSource("adsrow-screen-areas");
      if (!source || clusterId === undefined) return;
      const expansionZoom = await source.getClusterExpansionZoom(clusterId);
      map.easeTo({ center: feature.geometry.coordinates, zoom: expansionZoom });
    });
    map.on("mouseenter", "adsrow-screen-clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "adsrow-screen-clusters", () => { map.getCanvas().style.cursor = ""; });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="section home-location-section">
      <div className="container home-location-layout">
        <div className="home-location-copy">
          <p className="eyebrow">CITY COVERAGE</p>
          <h2>Digital screens across <span>Vijayawada.</span></h2>
          <p>Explore the Vijayawada areas that are part of the Adsrow coverage map. Specific venues and live screens in each area need confirmation.</p>
          <p className="home-location-note"><span className="home-location-note-dot" />Screen markers are illustrative area references, not confirmed installed-screen coordinates.</p>
        </div>
        <figure className="home-location-map" aria-labelledby="network-location-map-caption">
          <div ref={mapContainerRef} className="home-maplibre-map" aria-label="Interactive Vijayawada screen coverage map">
            {mapStatus !== "ready" && (
              <div className={`home-map-status home-map-status-${mapStatus}`} role={mapStatus === "error" ? "alert" : "status"}>
                <strong>{mapStatus === "error" ? "Map tiles could not be loaded" : "Loading Vijayawada map…"}</strong>
                <span>{mapStatus === "error" ? "Check your connection and try again." : "Loading OpenStreetMap roads and neighborhoods."}</span>
              </div>
            )}
          </div>
          <figcaption id="network-location-map-caption" className="home-location-map-caption">
            <span className="home-map-legend-item"><span className="home-map-legend-screen" />Demo screen area</span>
            <span className="home-map-legend-item"><span className="home-map-legend-cluster" />Screen cluster</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
