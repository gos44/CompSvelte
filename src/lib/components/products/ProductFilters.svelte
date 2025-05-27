<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let searchTerm: string;
  export let selectedCategory: string;
  export let sortBy: string;
  export let categories: string[];
  export let loading: boolean = false;
  export let showSearch: boolean = true;
  export let showFilters: boolean = true;
  export let showFiltersPanel: boolean; // Para el estado del panel, bidireccional
  export let viewMode: 'grid' | 'list'; // Para el control de vista

  const dispatch = createEventDispatcher();

  function handleSearchInput(event: Event) {
    dispatch('updateSearch', (event.target as HTMLInputElement).value);
  }

  function handleCategoryChange(event: Event) {
    dispatch('updateCategory', (event.target as HTMLSelectElement).value);
  }

  function handleSortChange(event: Event) {
    dispatch('updateSort', (event.target as HTMLSelectElement).value);
  }

  function handleResetFilters() {
    dispatch('resetFilters');
  }

  function toggleViewMode(mode: 'grid' | 'list') {
    dispatch('updateViewMode', mode);
  }

  function toggleFiltersPanel() {
    showFiltersPanel = !showFiltersPanel; // Modifica directamente la prop bind:
  }
</script>

<div class="controls-section">
  {#if showSearch}
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar productos..."
        value={searchTerm}
        on:input={handleSearchInput}
        disabled={loading}
      />
      <span class="search-icon">🔍</span>
    </div>
  {/if}

  <div class="view-controls">
    <div class="view-toggle">
      <button
        class="view-button"
        class:active={viewMode === 'grid'}
        on:click={() => toggleViewMode('grid')}
        disabled={loading}
      >
        ⋮⋮
      </button>
      <button
        class="view-button"
        class:active={viewMode === 'list'}
        on:click={() => toggleViewMode('list')}
        disabled={loading}
      >
        ☰
      </button>
    </div>

    {#if showFilters}
      <button
        class="filters-toggle"
        on:click={toggleFiltersPanel}
        disabled={loading}
      >
        Filtros {showFiltersPanel ? '△' : '▽'}
      </button>
    {/if}
  </div>
</div>

{#if showFilters && showFiltersPanel}
  <div class="filters-panel">
    <div class="filter-group">
      <label class="filter-label" for="category-select">Categoría:</label>
      <select
        id="category-select"
        class="filter-select"
        value={selectedCategory}
        on:change={handleCategoryChange}
        disabled={loading}
      >
        <option value="all">Todas las categorías</option>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Ordenar por:</label>
      <select
        class="filter-select"
        value={sortBy}
        on:change={handleSortChange}
        disabled={loading}
      >
        <option value="name">Nombre</option>
        <option value="price-low">Precio: Menor a Mayor</option>
        <option value="price-high">Precio: Mayor a Menor</option>
        <option value="rating">Mejor Valorados</option>
      </select>
    </div>

    <button class="reset-filters" on:click={handleResetFilters} disabled={loading}>
      Limpiar Filtros
    </button>
  </div>
{/if}

<style>
  .controls-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    background-color: var(--color-complementary-light-blue); /* Color de fondo para esta sección */
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .search-container {
    position: relative;
    flex-grow: 1; /* Permite que la barra de búsqueda ocupe más espacio */
    max-width: 400px; /* Limita el ancho en pantallas grandes */
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem; /* Espacio para el icono */
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }

  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }

  .view-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .view-toggle {
    display: flex;
    border: 1px solid var(--color-primary-teal);
    border-radius: 8px;
    overflow: hidden;
  }

  .view-button {
    background-color: var(--color-complementary-white);
    color: var(--color-primary-teal);
    padding: 0.5rem 0.8rem;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.2s, color 0.2s;
  }

  .view-button + .view-button {
    border-left: 1px solid var(--color-primary-teal);
  }

  .view-button.active {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
  }

  .view-button:hover:not(:disabled):not(.active) {
    background-color: var(--color-complementary-light-blue);
  }

  .filters-toggle {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .filters-toggle:hover:not(:disabled) {
    background-color: var(--color-complementary-medium-teal);
  }

  .filters-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1.5rem;
    background-color: var(--color-complementary-white);
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    font-weight: 600;
    color: #555;
  }

  .filter-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background-color: #f9f9f9;
  }

  .reset-filters {
    background-color: var(--color-primary-red);
    color: var(--color-complementary-white);
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
    align-self: flex-start; /* Alinea con los selects */
  }

  .reset-filters:hover:not(:disabled) {
    background-color: var(--color-error);
  }

  /* Deshabilitado */
  .search-input:disabled,
  .view-button:disabled,
  .filters-toggle:disabled,
  .filter-select:disabled,
  .reset-filters:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>