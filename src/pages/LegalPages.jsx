import { Link } from "react-router-dom";

function LegalLayout({ eyebrow, title, intro, children }) {
  return (
    <section className="legal-page section">
      <div className="container legal-container">
        <Link to="/signup" className="legal-back">← Back to sign up</Link>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="legal-intro">{intro}</p>
        <div className="legal-content">{children}</div>
      </div>
    </section>
  );
}

export function TermsPage() {
  return (
    <LegalLayout eyebrow="ADSROW" title="Terms and Conditions" intro="These terms explain the basic conditions for using the Adsrow website and its account features.">
      <h2>Using Adsrow</h2>
      <p>Use the website and your account lawfully and provide information that is accurate and up to date. You are responsible for keeping your account credentials secure.</p>
      <h2>Enquiries and campaigns</h2>
      <p>Submitting an enquiry lets the Adsrow team review your requirements. An enquiry does not create a confirmed placement, price, campaign, or contract until Adsrow confirms those details separately.</p>
      <h2>Website content</h2>
      <p>Adsrow may update website information, services, availability, and campaign details as the network develops.</p>
      <h2>Contact</h2>
      <p>If you have questions about these terms, please use the <Link to="/contact">Contact Us</Link> page.</p>
    </LegalLayout>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout eyebrow="ADSROW" title="Privacy Policy" intro="This page describes how Adsrow uses information provided through its website and account features.">
      <h2>Information you provide</h2>
      <p>Adsrow may receive your name, email address, mobile number, account details, and enquiry information when you create an account or contact the team.</p>
      <h2>How information is used</h2>
      <p>Information is used to provide account access, respond to enquiries, maintain website security, and communicate about requested services.</p>
      <h2>Authentication and service providers</h2>
      <p>Adsrow uses Supabase for authentication and Web3Forms for enquiry delivery. Passwords are handled by the authentication provider and are not stored in Adsrow application code.</p>
      <h2>Your choices</h2>
      <p>For questions about your information or to request an update, please use the <Link to="/contact">Contact Us</Link> page.</p>
    </LegalLayout>
  );
}
