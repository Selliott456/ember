<footer class="site-footer">
  <div class="inner">
    <div class="brand">
      <a href="/" aria-label="Ember home">
        <img
          src="/images/branding/ember_crop.png"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
      </a>
      <p>Premium apparel made for motion.</p>
    </div>

    <nav aria-label="Footer">
      <a href="/products">Shop</a>
      <a href="/faq">FAQ</a>
      <a href="/shipping">Shipping</a>
      <a href="/returns">Returns</a>
      <a href="/contact">Contact</a>
    </nav>

    <div class="socials" aria-label="Social links">
      <a
        href="https://instagram.com/ember_apparel_co"
        aria-label="Instagram @ember_apparel_co"
        target="_blank"
        rel="noreferrer"
        class="social-link instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="social-icon">
          <rect x="4" y="4" width="16" height="16" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="1.6" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6" />
          <circle cx="17" cy="7" r="1" fill="currentColor" />
        </svg>
      </a>
      <a
        href="https://tiktok.com/@ember_apparel_co"
        aria-label="TikTok @ember_apparel_co"
        target="_blank"
        rel="noreferrer"
        class="social-link tiktok"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="social-icon">
          <path
            d="M15.6 3c.3 2.1 1.6 3.6 3.8 4v2.8c-1.3 0-2.6-.4-3.8-1.1v6.3c0 3.2-2.6 5.8-5.8 5.8S4 18.2 4 15s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V3h2.8z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: 5rem;
    padding: 3rem 1.5rem;
    border-top: 1px solid #262a2e;
    background: #0d0f11;
    width: 100dvw;
    max-width: 100dvw;
    margin-left: calc(50% - 50dvw);
    margin-right: calc(50% - 50dvw);
    box-sizing: border-box;
  }

  .inner {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr auto;
    gap: 2rem;
    align-items: start;
  }

  .brand a {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  .brand a img {
    display: block;
    width: clamp(86px, 12vw, 118px);
    height: auto;
  }

  .brand p {
    margin: 0.75rem 0 0;
    color: #c0c5c9;
    font-size: 0.9rem;
  }

  nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 0.65rem 1.2rem;
  }

  nav a,
  .socials a {
    color: #c8cbce;
    text-decoration: none;
    font-size: 0.9rem;
  }

  nav a:hover,
  .socials a:hover {
    color: #f2f3f2;
  }

  .socials {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
  }

  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .social-icon {
    width: 1.9rem;
    height: 1.9rem;
    flex: 0 0 auto;
  }

  @media (max-width: 760px) {
    .inner {
      grid-template-columns: 1fr;
    }
  }
</style>
