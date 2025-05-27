<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

  interface Product {
    id: number;
    name: string;
    price: number;
    category: string; 
    description?: string;
    rating?: number;
    image?: string;
    isFavorite?: boolean;
    originalPrice ?: number; 
  }

  export let products: Product[] = [];
  export let loading = false;
  export let title = 'Nuestros Productos';
  export let subtitle = 'Descubre nuestra selección de productos';
  export let showFilters = true;
  export let showSearch = true;
  export let viewMode: 'grid' | 'list' = 'grid';
  export let itemsPerPage = 12;

  let searchTerm = '';
  let selectedCategory = 'all';
  let sortBy = 'name';
  let currentPage = 1;
  let showFiltersPanel = false;

  // Categorías únicas
  $: categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtrar y ordenar productos
  $: filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Paginación
  $: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  $: paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funciones
  function handleProductClick(product: Product) {
    dispatch('productClick', product);
  }

  function handleAddToCart(product: Product) {
    dispatch('addToCart', product);
  }

  function handleProductFavorite(product: Product) {
    dispatch('toggleFavorite', product);
  }

  function resetFilters() {
    searchTerm = '';
    selectedCategory = 'all';
    sortBy = 'name';
    currentPage = 1;
  }

  function changePage(page : number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function formatPrice(price : number) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  function renderStars(rating : number | undefined) {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('☆');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  }

  function goToPage(page: number) {
    currentPage = page;
  }
</script>

<div class="products-container">
  <!-- Header -->
  <div class="products-header">
    <div class="header-content">
      <h1 class="products-title">{title}</h1>
      <p class="products-subtitle">{subtitle}</p>
    </div>
    
    {#if showSearch || showFilters}
      <div class="controls-section">
        <!-- Barra de búsqueda -->
        {#if showSearch}
          <div class="search-container">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar productos..."
              bind:value={searchTerm}
              disabled={loading}
            />
            <span class="search-icon">🔍</span>
          </div>
        {/if}

        <!-- Controles de vista y filtros -->
        <div class="view-controls">
          <div class="view-toggle">
            <button
              class="view-button"
              class:active={viewMode === 'grid'}
              onclick={() => viewMode = 'grid'}
              disabled={loading}
            >
              ⋮⋮
            </button>
            <button
              class="view-button"
              class:active={viewMode === 'list'}
              onclick={() => viewMode = 'list'}
              disabled={loading}
            >
              ☰
            </button>
          </div>

          {#if showFilters}
            <button
              class="filters-toggle"
              onclick={() => showFiltersPanel = !showFiltersPanel}
              disabled={loading}
            >
              Filtros {showFiltersPanel ? '△' : '▽'}
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Panel de filtros -->
  {#if showFilters && showFiltersPanel}
    <div class="filters-panel">
      <div class="filter-group">
        <label class="filter-label" for="category-select">Categoría:</label>
<select
  id="category-select"
  class="filter-select"
  bind:value={selectedCategory}
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
        <select class="filter-select" bind:value={sortBy} disabled={loading}>
          <option value="name">Nombre</option>
          <option value="price-low">Precio: Menor a Mayor</option>
          <option value="price-high">Precio: Mayor a Menor</option>
          <option value="rating">Mejor Valorados</option>
        </select>
      </div>

      <button class="reset-filters" onclick={resetFilters} disabled={loading}>
        Limpiar Filtros
      </button>
    </div>
  {/if}

  <!-- Contenido principal -->
  <div class="products-content">
    {#if loading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    {:else if filteredProducts.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No se encontraron productos</h3>
        <p>Prueba ajustando los filtros de búsqueda</p>
        <button class="reset-button" onclick={resetFilters}>
          Mostrar todos los productos
        </button>
      </div>
    {:else}
      <!-- Grid/List de productos -->
      <div class="products-grid" class:list-view={viewMode === 'list'}>
        {#each paginatedProducts as product}
          <div class="product-card" class:list-card={viewMode === 'list'}>
            <!-- Imagen del producto -->
            <div class="product-image-container">
              {#if product.image }
                <img src={product.image} alt={product.name} class="product-image" />
              {:else}
                <div class="product-placeholder">📷</div>
              {/if}
              
              <button
                class="favorite-button"
                class:favorited={product.isFavorite}
                onclick={(e) => { e.stopPropagation(); handleProductFavorite(product); }}
              >
                {product.isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            <!-- Información del producto -->
            <div class="product-info" onclick={() => handleProductClick(product)}>
              <h3 class="product-name">{product.name}</h3>
              
              {#if product.category}
                <span class="product-category">{product.category}</span>
              {/if}

              {#if product.description}
                <p class="product-description">{product.description}</p>
              {/if}

              {#if product.rating}
                <div class="product-rating">
                  <span class="stars">{renderStars(product.rating)}</span>
                  <span class="rating-value">({product.rating})</span>
                </div>
              {/if}

              <div class="product-price">
                {#if product.originalPrice && product.originalPrice > product.price}
                  <span class="original-price">{formatPrice(product.originalPrice)}</span>
                {/if}
                <span class="current-price">{formatPrice(product.price)}</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="product-actions">
              <button
                class="add-to-cart-button"
                onclick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                disabled={loading}
              >
                🛒 Añadir al carrito
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Paginación -->
      {#if totalPages > 1}
        <div class="pagination">
          <button
            class="pagination-button"
            onclick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            ‹ Anterior
          </button>

          <div class="pagination-info">
            Página {currentPage} de {totalPages}
          </div>

          <button
            class="pagination-button"
            onclick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Siguiente ›
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  :global(:root) {
    --color-primary-teal: #2E9C9D;
    --color-primary-red: #D92127;
    --color-complementary-white: #FFFFFF;
    --color-complementary-light-blue: #CDEEEE;
    --color-complementary-medium-teal: #66BBBA;
    --color-complementary-light-red: #ED8380;
    --color-error: var(--color-primary-red);
  }

  .products-container {
    background: linear-gradient(135deg, var(--color-complementary-light-blue) 0%, rgba(205, 238, 238, 0.3) 100%);
    min-height: 100vh;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .products-header {
    background: var(--color-complementary-white);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(46, 156, 157, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .header-content {
    text-align: center;
    margin-bottom: 2rem;
  }

  .products-title {
    color: var(--color-primary-teal);
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .products-subtitle {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
    opacity: 0.8;
  }

  .controls-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .search-container {
    position: relative;
    max-width: 400px;
    width: 100%;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 3rem 0.875rem 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: var(--color-complementary-white);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary-teal);
    box-shadow: 0 0 0 3px rgba(46, 156, 157, 0.1);
  }

  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
  }

  .view-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .view-toggle {
    display: flex;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 0.25rem;
  }

  .view-button {
    background: none;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.1rem;
  }

  .view-button.active {
    background: var(--color-primary-teal);
    color: var(--color-complementary-white);
  }

  .filters-toggle {
    background: var(--color-complementary-medium-teal);
    color: var(--color-complementary-white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .filters-toggle:hover:not(:disabled) {
    background: var(--color-primary-teal);
  }

  .filters-panel {
    background: var(--color-complementary-white);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(46, 156, 157, 0.1);
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 150px;
  }

  .filter-label {
    font-weight: 600;
    color: var(--color-primary-teal);
    font-size: 0.9rem;
  }

  .filter-select {
    padding: 0.5rem;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.2s ease;
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--color-primary-teal);
  }

  .reset-filters {
    background: var(--color-complementary-light-red);
    color: var(--color-complementary-white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .reset-filters:hover:not(:disabled) {
    background: var(--color-primary-red);
  }

  .products-content {
    background: var(--color-complementary-white);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(46, 156, 157, 0.1);
  }

  .loading-container {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-primary-teal);
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid var(--color-complementary-light-blue);
    border-top: 4px solid var(--color-primary-teal);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    color: var(--color-primary-teal);
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: #666;
    margin-bottom: 2rem;
  }

  .reset-button {
    background: var(--color-primary-teal);
    color: var(--color-complementary-white);
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .reset-button:hover {
    background: #267879;
    transform: translateY(-1px);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .products-grid.list-view {
    grid-template-columns: 1fr;
  }

  .product-card {
    background: var(--color-complementary-white);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(46, 156, 157, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(46, 156, 157, 0.1);
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(46, 156, 157, 0.15);
  }

  .product-card.list-card {
    display: flex;
    align-items: center;
  }

  .product-card.list-card .product-image-container {
    width: 150px;
    height: 150px;
    flex-shrink: 0;
  }

  .product-image-container {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-placeholder {
    width: 100%;
    height: 100%;
    background: var(--color-complementary-light-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    opacity: 0.5;
  }

  .favorite-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  .favorite-button:hover {
    background: var(--color-complementary-white);
    transform: scale(1.1);
  }

  .product-info {
    padding: 1.5rem;
    cursor: pointer;
    flex-grow: 1;
  }

  .product-name {
    color: var(--color-primary-teal);
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .product-category {
    background: var(--color-complementary-light-blue);
    color: var(--color-primary-teal);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .product-description {
    color: #666;
    font-size: 0.9rem;
    margin: 0.75rem 0;
    line-height: 1.4;
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.75rem 0;
  }

  .stars {
    color: #ffd700;
    font-size: 1.1rem;
  }

  .rating-value {
    color: #666;
    font-size: 0.9rem;
  }

  .product-price {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 0.9rem;
  }

  .current-price {
    color: var(--color-primary-teal);
    font-size: 1.3rem;
    font-weight: 700;
  }

  .product-actions {
    padding: 0 1.5rem 1.5rem;
  }

  .add-to-cart-button {
    width: 100%;
    background: var(--color-primary-teal);
    color: var(--color-complementary-white);
    border: none;
    padding: 0.875rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .add-to-cart-button:hover:not(:disabled) {
    background: #267879;
  }

  .add-to-cart-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .pagination-button {
    background: var(--color-complementary-medium-teal);
    color: var(--color-complementary-white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .pagination-button:hover:not(:disabled) {
    background: var(--color-primary-teal);
  }

  .pagination-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  .pagination-info {
    color: var(--color-primary-teal);
    font-weight: 600;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .products-container {
      padding: 1rem;
    }

    .products-header {
      padding: 1.5rem;
    }

    .products-title {
      font-size: 2rem;
    }

    .controls-section {
      flex-direction: column;
    }

    .filters-panel {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-group {
      min-width: auto;
    }

    .products-grid {
      grid-template-columns: 1fr;
    }

    .product-card.list-card {
      flex-direction: column;
    }

    .product-card.list-card .product-image-container {
      width: 100%;
      height: 200px;
    }
  }
</style>