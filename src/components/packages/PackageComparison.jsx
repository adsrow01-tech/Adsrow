"use strict";

import { useState } from "react";
import { ArrowUpRight, Globe, BarChart, TrendingUp } from "lucide-react";

/**
 * Package comparison component.
 * 
 * This component displays detailed comparison tables and
 * highlights the selected package for easy comparison.
 */
export default function PackageComparison() {
  const [selectedPack, setSelectedPack] = useState(null);

  const handlePackSelect = (packId) => {
    setSelectedPack(packId === selectedPack ? null : packId);
  };

  const packages = [
    {
      id: "starter",
      screens: 10,
      duration: 7,
      bestFor: "Testing an offer in one area or venue type",
    },
    {
      id: "growth",
      screens: 20,
      duration: 15,
      bestFor: "Restaurants, clinics and coaching centres",
    },
    {
      id: "impact",
      screens: 30,
      duration: 30,
      bestFor: "Launches and dealership drives",
    },
    {
      id: "full-network",
      screens: "Full network",
      duration: "Custom",
      bestFor: "City-wide takeovers by regional and national brands",
    },
  ];

  return (
    <section className="package-comparison" id="package-comparison">
      <div className="package-comparison-wrap">
        <header className="package-comparison-header">
          <div className="package-comparison-eyebrow">Compare Packages</div>
          <h2 className="package-comparison-title">Side-by-side package comparison</h2>
          <p className="package-comparison-subtitle">
            Select a package to see detailed comparison with others.
          </p>
        </header>

        <div className="package-comparison-grid">
          {packages.map((pack) => (
            <article
              key={pack.id}
              className={`package-comparison-card ${selectedPack === pack.id ? "highlighted" : ""}`}
              onClick={() => handlePackageSelect(pack.id)}
            >
              <div className="package-comparison-number">0{packages.findIndex(p => p.id === pack.id) + 1}</div>
              <h3 className="package-comparison-name">{pack.name}</h3>
              <div className="package-comparison-specs">
                <div className="comparison-spec">
                  <span className="spec-label">Screens</span>
                  <span className="spec-value">{pack.screens === "Full network" ? "Full network" : pack.screens}</span>
                </div>
                <div className="comparison-spec">
                  <span className="spec-label">Duration</span>
                  <span className="spec-value">{pack.duration === "Custom" ? "Custom" : `${pack.duration} days`}</span>
                </div>
                <div className="comparison-spec">
                  <span className="spec-label">Best for</span>
                  <span className="spec-value">{pack.bestFor}</span>
                </div>
              </div>
              {selectedPack === pack.id && (
                <div className="package-comparison-details">
                  <h4>Package Details</h4>
                  <p>
                    {pack.bestFor}. Ideal for {pack.bestFor.toLowerCase()} campaigns.
                    {pack.duration === "Custom" && " Custom timelines available."}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}