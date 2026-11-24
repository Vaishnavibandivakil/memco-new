export function NewsletterSignup() {
  return (
    <div className="cl-newsletter">
      <div className="cl-newsletter-copy">
        <h2>Newsletter</h2>
        <p>Jutaku updates, straight to your inbox.</p>
      </div>
      <div className="cl-newsletter-form">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <div className="cl-newsletter-row">
          <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Your email address" maxLength={254} />
          <button type="button" disabled aria-label="Subscribe to the newsletter" title="Newsletter signup coming soon"><span aria-hidden="true">↗</span></button>
        </div>
        <p className="cl-newsletter-note">Signup coming soon.</p>
      </div>
    </div>
  );
}
