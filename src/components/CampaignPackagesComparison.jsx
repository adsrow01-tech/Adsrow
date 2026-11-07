import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { audiencePacks, cityPack, packageAudienceFilters } from "../lib/packageData";
import "../styles/home-packages.css";

const previewPacks = [...audiencePacks, cityPack];

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
          {previewPacks.map((pack) => (
            <Link
              className={`hpk-card${pack.id === "city" ? " dk" : ""}`}
              key={pack.id}
              to={`/packages#${pack.id}`}
            >
              <span className="ic" aria-hidden="true">{pack.icon ?? "🌆"}</span>
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
          ))}
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
