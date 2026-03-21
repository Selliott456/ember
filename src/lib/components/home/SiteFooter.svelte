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
      <a href="/about">About</a>
      <a href="/faq">FAQ</a>
      <a href="/shipping">Shipping</a>
      <a href="/returns">Returns</a>
      <a href="/contact">Contact</a>
    </nav>

    <div class="socials" aria-label="Social links">
      <a href="https://instagram.com" aria-label="Instagram">IG</a>
      <a href="https://tiktok.com" aria-label="TikTok">TT</a>
      <a href="https://pinterest.com" aria-label="Pinterest">PT</a>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: 5rem;
    padding: 3rem 1.5rem;
    border-top: 1px solid #262a2e;
    background: #0d0f11;
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
    gap: 0.9rem;
  }

  @media (max-width: 760px) {
    .inner {
      grid-template-columns: 1fr;
    }
  }
</style>
