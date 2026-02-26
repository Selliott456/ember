<script lang="ts">
  import { page } from "$app/stores";
  $: canonical = $page.url.origin + $page.url.pathname;
</script>

<svelte:head>
  <title>Ember skate supply</title>
  <meta
    name="description"
    content="Ember skate supply – premium apparel made for motion."
  />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ember skate supply" />
  <meta
    property="og:description"
    content="Ember skate supply – premium apparel made for motion."
  />
  <meta property="og:url" content={canonical} />
</svelte:head>

<main class="page">
  <section class="hero">
    <div class="hero-brand">
      <img
        class="hero-logo"
        src="/images/branding/image.png"
        alt="Ember logo"
        loading="eager"
      />
      <p class="hero-tagline">PREMIUM APPAREL MADE FOR MOTION.</p>
    </div>
    <img
      class="hero-image"
      src="/images/hero-image.png"
      alt="Skate crew wearing Ember apparel"
      loading="eager"
    />
  </section>
</main>

<style>
  .page {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 1.5rem 3.5rem;
  }

  .hero {
    position: relative;
    margin: 0 calc(50% - 50vw) 2.75rem;
  height: 60vh;
    border-radius: 0;
    overflow: hidden;
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  background-color: rgba(0, 48, 63, 0.7); /* darker brand ink vignette */
    mix-blend-mode: multiply;
  z-index: 0;
  }

  .hero-image {
    display: block;
    width: 100%;
  height: 100%;
  object-fit: cover;
  }

.hero-brand {
  position: absolute;
  left: 1.5rem;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
   z-index: 1;
}

.hero-logo {
  display: block;
  max-width: 360px;
  width: 100%;
  height: auto;
}

.hero-tagline {
  margin-top: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
}

  @media (max-width: 768px) {
    .hero {
      margin: 0 0 2rem;
    }
  }
</style>
