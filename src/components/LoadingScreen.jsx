export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen-content">
        <img
          className="loading-screen-logo"
          src="/brand/adsrow-logo-primary.png"
          alt="Adsrow"
          width={180}
          height={39}
          fetchPriority="high"
          decoding="async"
        />
        <div className="loading-screen-status">
          <span className="loading-screen-text">Preparing your advertising experience...</span>
          <span className="loading-screen-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
