<script lang="ts">
  export let imageSrc = "/images/naeba_hero.png";
</script>

<section class="naeba-hero" style={`--hero-image: url('${imageSrc}')`}>
  <div class="overlay"></div>
  <div class="content">
    <p class="eyebrow">Naeba Collection</p>
    <h2>Built for cold air, long days, and strange little detours</h2>
    <p class="body">
      Inspired by ski trips, mountain towns, and the kind of people who make the
      whole thing memorable, Naeba brings together motion, warmth, and a
      slightly offbeat winter energy. It&apos;s a collection shaped by snow,
      travel, roadside rituals, and the style that shows up somewhere between
      the slopes and the last stop home.
    </p>
  </div>
</section>

<style>
  .naeba-hero {
    position: relative;
    margin: 0 calc(50% - 50vw) 1.4rem;
    min-height: clamp(400px, 60vw, 560px);
    background-image: var(--hero-image);
    background-size: cover;
    background-position: center;
    overflow: hidden;
    display: grid;
    align-items: end;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(8, 14, 20, 0.9),
      rgba(8, 14, 20, 0.55),
      rgba(8, 14, 20, 0.24)
    );
  }

  .content {
    position: relative;
    z-index: 1;
    max-width: 1120px;
    margin: 0 auto;
    padding: clamp(1.2rem, 3vw, 2rem) 1.2rem clamp(1.3rem, 3.2vw, 2.4rem);
    color: #f4f6f7;
    animation: fade-up 420ms ease-out both;
  }

  .eyebrow {
    margin: 0 0 0.45rem;
    font-size: 0.74rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #dbe6ef;
  }

  h2 {
    margin: 0;
    max-width: 22ch;
    font-size: clamp(1.9rem, 4.2vw, 3rem);
    line-height: 1.08;
    letter-spacing: 0.015em;
  }

  .body {
    margin: 0.95rem 0 0;
    max-width: 65ch;
    font-size: clamp(0.95rem, 1.7vw, 1.08rem);
    line-height: 1.6;
    color: rgba(244, 246, 247, 0.94);
  }

  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
