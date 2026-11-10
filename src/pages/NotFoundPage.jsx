export default function NotFoundPage() {
  return (
    <section className="section not-found-page" aria-labelledby="not-found-title">
      <div className="container not-found-page__inner">
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1 id="not-found-title">That page isn’t here.</h1>
        <p>We couldn’t find the page you were looking for. It may have moved, or the link may be outdated.</p>
        <a className="button button-primary" href="/">Back to homepage <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
