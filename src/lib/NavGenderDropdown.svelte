<script lang="ts">
  export let label: "Women" | "Men" | "Unisex";
  export let gender: string;

  const collections = [
    { key: "fieldnotes", label: "Field Notes" },
    { key: "basecamp", label: "Base Camp" },
    { key: "conditions", label: "Conditions" },
    { key: "naeba", label: "Naeba" },
  ];

  const productTypes = [
    { key: "tee", label: "Tees" },
    { key: "hoodie", label: "Hoodies" },
    { key: "sweater", label: "Sweaters" },
    { key: "pants", label: "Pants / Trousers" },
    { key: "jeans", label: "Jeans" },
  ];
</script>

<div class="site-nav-item has-dropdown">
  <a href={`/products?gender=${gender}`}>{label}</a>
  <div
    class="nav-dropdown"
    aria-label={`Filter ${label.toLowerCase()} products`}
  >
    <div class="nav-dropdown-column">
      <h3>Shop by collection</h3>
      {#each collections as c}
        <a href={`/products?gender=${gender}&collection=${c.key}`}>{c.label}</a>
      {/each}
    </div>
    <div class="nav-dropdown-column">
      <h3>Shop by product</h3>
      {#each productTypes as t}
        <a href={`/products?gender=${gender}&type=${t.key}`}>{t.label}</a>
      {/each}
    </div>
  </div>
</div>
