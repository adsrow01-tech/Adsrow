import { Link } from "react-router-dom";
import { ArrowRight, Building2, Dumbbell, Globe2, Utensils } from "lucide-react";
import { audiencePacks, cityPack, packageAudienceFilters } from "../lib/packageData";
import "../styles/home-packages.css";

const previewPacks = [...audiencePacks, cityPack];

/* Per-pack Lucide icon + pastel accent family from the shared .ads-card
   system (globals.css): blue, green, orange, lavender-purple. */
const packIcons = { neighbourhood: Building2, "dine-out": Utensils, fitness: Dumbbell, city: Globe2 };
const packAccents = { neighbourhood: 1, "dine-out": 4, fitness: 3, city: 2 };

function previewPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function CampaignPackagesComparison() {
  return (
    <section className="hpk" aria-labelledby="hpk-title">
      <div className="hpk-wrap">
        <div className="hpk-top">
          <div>
            <div className="hpk-eyebrow">Campaign packages</div>
            <h2 id="hpk-title">Start small. <span>Scale what works.</span></h2>
            <p className="hpk-sub">Pick the people you want to reach. Every pack includes proof of every play and free first ad design.</p>
          </div>
          <Link className="hpk-all" to="/packages">
            See all packages &amp; pricing <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <Link className="hpk-try" to="/packages#try-it">
          <span><small>New advertisers</small>Try your first campaign for <b>₹99 a day</b></span>
          <span>See Try It <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>

        <div className="hpk-grid">
          {previewPacks.map((pack, index) => {
            const PackIcon = packIcons[pack.id] ?? Globe2;
            const accent = packAccents[pack.id] ?? (index % 4) + 1;
            return (
              <Link
                className={`hpk-card ads-card ads-card-interactive ads-accent-${accent}`}
                key={pack.id}
                to={`/packages#${pack.id}`}
              >
                <div className="ads-card-head-row">
                  <span className="ads-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="feature-icon" aria-hidden="true"><PackIcon size={22} /></span>
                </div>
                <span className="nm">{pack.id === "city" ? pack.name : pack.name.replace(" Pack", "")}</span>
                <span className="who">
                  {pack.id === "neighbourhood" ? "Families at home, morning and evening" :
                    pack.id === "fitness" ? "Health-focused gym regulars" : pack.who}
                </span>
                <span className="pr">
                  <span>from <b>{previewPrice(pack.dailyPrice)}</b>/day</span>
                  <span className="go">View →</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hpk-fit">
          Which pack fits me? I run a…
          {packageAudienceFilters.map((filter) => (
            <Link key={filter.slug} to={`/packages?for=${filter.slug}`}>
              {filter.homeLabel}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
