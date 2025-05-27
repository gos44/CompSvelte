<script lang="ts">
  export let title: string;
  export let subtitle: string | undefined = undefined;
  export let customClass: string = '';
</script>

<div class="card {customClass}">
  <h2 class="card-title">{title}</h2>
  {#if subtitle}
    <h3 class="card-subtitle">{subtitle}</h3>
  {/if}
  <div class="card-content">
    <slot></slot>
  </div>
</div>

<style>
  .card {
    background-color: var(--color-complementary-white); /* Usando variable */
    border: 1px solid #e0e0e0; /* Puedes dejar este si prefieres un gris genérico */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    max-width: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card-title {
    font-size: 1.5rem;
    color: var(--color-primary-teal); /* Usando variable para el título principal */
    margin-bottom: 0.5rem;
  }

  .card-subtitle {
    font-size: 1rem;
    color: var(--color-complementary-medium-teal); /* Usando variable para el subtítulo */
    margin-bottom: 1rem;
  }

  .card-content {
    text-align: left;
  }

  .card-content :global(p),
  .card-content :global(ul),
  .card-content :global(li),
  .card-content :global(button) {
    color: #555; /* Puedes mantener este o cambiarlo a una variable si hay un color de texto general */
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .card-content :global(ul) {
    list-style-type: disc;
    padding-left: 20px;
  }
</style>