<script lang="ts">
  // Props que el componente puede recibir
  export let title: string = 'Título por defecto';
  export let subtitle: string | undefined = undefined;
  export let customClass: string = ''; // Para añadir clases CSS adicionales
</script>

<div class="card {customClass}">
  {#if title}
    <h2 class="card-title">{title}</h2>
  {/if}

  {#if subtitle}
    <h3 class="card-subtitle">{subtitle}</h3>
  {/if}

  <div class="card-content">
    <slot></slot>
  </div>
</div>

<style lang="scss">
  /* Colores usando variables CSS para facilitar cambios */
  :root {
    --card-bg: #ffffff;
    --card-border: #e0e0e0;
    --card-shadow: rgba(0, 0, 0, 0.08);
    --title-color: #333333;
    --subtitle-color: #555555;
    --text-color: #444444;
  }

  .card {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--card-shadow);
    padding: 1.5rem;
    margin: 1rem;
    max-width: 400px;
    min-width: 280px;
    box-sizing: border-box; /* Asegura que padding no aumente el tamaño total */
  }

  .card-title {
    color: var(--title-color);
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 0.8rem;
    font-weight: 600;
  }

  .card-subtitle {
    color: var(--subtitle-color);
    font-size: 1.1rem;
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-weight: 400;
  }

  .card-content {
    color: var(--text-color);
    line-height: 1.6;
  }
</style>