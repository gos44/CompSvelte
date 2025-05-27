<script lang="ts">
  import { onMount } from 'svelte';
  import type { Product } from '$lib/types/Product'; // Asegúrate de importar la interfaz

  // Componentes modularizados
  import ProductFilters from '$lib/components/products/ProductFilters.svelte';
  import ProductCard from '$lib/components/products/ProductCard.svelte';
  import ProductListItem from '$lib/components/products/ProductListItem.svelte';
  import PaginationControls from '$lib/components/products/PaginationControls.svelte';

  // Props del componente principal (pueden venir de un +layout.ts o directamente aquí)
  export let products: Product[] = []; // Inicia vacío o con datos de ejemplo
  export let loading = false;
  export let title = 'Nuestros Productos';
  export let subtitle = 'Descubre nuestra selección de productos';
  export let showFilters = true;
  export let showSearch = true;
  export let viewMode: 'grid' | 'list' = 'grid';
  export let itemsPerPage = 12;

  // Estados locales para filtros y paginación
  let searchTerm = '';
  let selectedCategory = 'all';
  let sortBy = 'name';
  let currentPage = 1;
  let showFiltersPanel = false;

  // Lógica reactiva (calculadas a partir de los estados)
  $: categories = [...new Set(products.map(p => p.category).filter(Boolean))];

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

  $: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  $: paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funciones de manejo de eventos (disparadas desde los subcomponentes)
  function handleUpdateSearch(e: CustomEvent<string>) {
    searchTerm = e.detail;
    currentPage = 1; // Resetear paginación al buscar
  }

  function handleUpdateCategory(e: CustomEvent<string>) {
    selectedCategory = e.detail;
    currentPage = 1; // Resetear paginación al cambiar categoría
  }

  function handleUpdateSort(e: CustomEvent<string>) {
    sortBy = e.detail;
    currentPage = 1; // Resetear paginación al ordenar
  }

  function handleResetFilters() {
    searchTerm = '';
    selectedCategory = 'all';
    sortBy = 'name';
    currentPage = 1;
  }

  function handleChangePage(e: CustomEvent<number>) {
    currentPage = e.detail;
  }

  function handleUpdateViewMode(e: CustomEvent<'grid' | 'list'>) {
    viewMode = e.detail;
  }

  // Eventos de interacción con productos (delegados a un nivel superior si es necesario)
  function handleProductClick(e: CustomEvent<number>) {
    const productId = e.detail;
    console.log('Producto clicado:', productId);
    // Aquí podrías navegar a una página de detalle: goto(`/products/${productId}`);
  }

  function handleAddToCart(e: CustomEvent<number>) {
    const productId = e.detail;
    console.log('Añadir al carrito:', productId);
    // Lógica para añadir al carrito (ej. actualizar un store global)
  }

  function handleToggleFavorite(e: CustomEvent<number>) {
    const productId = e.detail;
    console.log('Alternar favorito:', productId);
    // Lógica para alternar favorito (ej. actualizar el array de productos)
    products = products.map(p =>
      p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
    );
  }

  // Ejemplo de carga de datos (simulación)
  onMount(() => {
    loading = true;
    setTimeout(() => {
      products = [
        { id: 1, name: 'Laptop Pro X1', price: 1200, category: 'Electrónica', description: 'Potente laptop para profesionales.', rating: 4.5, image: 'https://picsum.photos/id/2/200/200', isFavorite: false },
        { id: 2, name: 'Auriculares Inalámbricos', price: 85, category: 'Electrónica', description: 'Excelente calidad de sonido y comodidad.', rating: 4.0, image: 'https://picsum.photos/id/25/200/200', isFavorite: true },
        { id: 3, name: 'Teclado Mecánico RGB', price: 110, category: 'Accesorios', description: 'Experiencia de tecleado premium con retroiluminación.', rating: 4.8, image: 'https://picsum.photos/id/29/200/200', isFavorite: false, originalPrice: 130 },
        { id: 4, name: 'Monitor UltraWide', price: 350, category: 'Electrónica', description: 'Inmersión total para gaming y trabajo.', rating: 4.2, image: 'https://picsum.photos/id/34/200/200', isFavorite: false },
        { id: 5, name: 'Mouse Ergonómico', price: 45, category: 'Accesorios', description: 'Diseño cómodo para largas horas de uso.', rating: 3.9, image: 'https://picsum.photos/id/40/200/200', isFavorite: false },
        { id: 6, name: 'Smartphone Z10', price: 800, category: 'Electrónica', description: 'Cámara avanzada y rendimiento rápido.', rating: 4.7, image: 'https://picsum.photos/id/42/200/200', isFavorite: false },
        { id: 7, name: 'Webcam HD Pro', price: 60, category: 'Accesorios', description: 'Videollamadas nítidas y fluidas.', rating: 4.1, image: 'https://picsum.photos/id/43/200/200', isFavorite: true },
        { id: 8, name: 'Silla de Oficina Ergonómica', price: 250, category: 'Muebles', description: 'Soporte y confort para tu jornada laboral.', rating: 4.6, image: 'https://picsum.photos/id/50/200/200', isFavorite: false },
        { id: 9, name: 'Disco Duro Externo 2TB', price: 90, category: 'Almacenamiento', description: 'Almacena todos tus archivos de forma segura.', rating: 4.3, image: 'https://picsum.photos/id/53/200/200', isFavorite: false, originalPrice: 100 },
        { id: 10, name: 'Router WiFi 6', price: 150, category: 'Redes', description: 'Conexión ultrarrápida para todo tu hogar.', rating: 4.4, image: 'https://picsum.photos/id/54/200/200', isFavorite: false },
        { id: 11, name: 'Impresora Multifuncional', price: 180, category: 'Oficina', description: 'Imprime, escanea y copia con facilidad.', rating: 3.8, image: 'https://picsum.photos/id/56/200/200', isFavorite: false },
        { id: 12, name: 'Tableta Gráfica', price: 220, category: 'Diseño', description: 'Para artistas digitales y diseñadores.', rating: 4.9, image: 'https://picsum.photos/id/58/200/200', isFavorite: false },
        { id: 13, name: 'Funda para Laptop', price: 25, category: 'Accesorios', description: 'Protege tu laptop con estilo.', rating: 3.5, image: 'https://picsum.photos/id/60/200/200', isFavorite: false },
        { id: 14, name: 'Soporte de Monitor', price: 35, category: 'Accesorios', description: 'Mejora tu ergonomía y espacio de trabajo.', rating: 4.0, image: 'https://picsum.photos/id/61/200/200', isFavorite: false },
      ];
      loading = false;
    }, 1500); // Simula una llamada a API
  });
</script>

<div class="products-container">
  <div class="products-header">
    <div class="header-content">
      <h1 class="products-title">{title}</h1>
      <p class="products-subtitle">{subtitle}</p>
    </div>

    {#if showSearch || showFilters}
      <ProductFilters
        bind:searchTerm
        bind:selectedCategory
        bind:sortBy
        bind:showFiltersPanel
        bind:viewMode
        {categories}
        {loading}
        {showSearch}
        {showFilters}
        on:updateSearch={handleUpdateSearch}
        on:updateCategory={handleUpdateCategory}
        on:updateSort={handleUpdateSort}
        on:resetFilters={handleResetFilters}
        on:updateViewMode={handleUpdateViewMode}
      />
    {/if}
  </div>

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
        <button class="reset-button" on:click={handleResetFilters}>
          Mostrar todos los productos
        </button>
      </div>
    {:else}
      <div class="products-grid" class:list-view={viewMode === 'list'}>
        {#each paginatedProducts as product (product.id)}
          {#if viewMode === 'grid'}
            <ProductCard
              {product}
              {loading}
              on:click={handleProductClick}
              on:addToCart={handleAddToCart}
              on:toggleFavorite={handleToggleFavorite}
            />
          {:else}
            <ProductListItem
              {product}
              {loading}
              on:click={handleProductClick}
              on:addToCart={handleAddToCart}
              on:toggleFavorite={handleToggleFavorite}
            />
          {/if}
        {/each}
      </div>

      <PaginationControls
        {currentPage}
        {totalPages}
        {loading}
        on:changePage={handleChangePage}
      />
    {/if}
  </div>
</div>

<style>
  .products-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    background-color: var(--color-complementary-white);
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .products-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  .header-content {
    margin-bottom: 1.5rem;
  }

  .products-title {
    font-size: 2.5rem;
    color: var(--color-primary-teal);
    margin-bottom: 0.5rem;
  }

  .products-subtitle {
    font-size: 1.1rem;
    color: #666;
  }

  /* Contenido principal */
  .products-content {
    padding: 1rem 0;
  }

  .loading-container, .empty-state {
    text-align: center;
    padding: 3rem 0;
    color: #888;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--color-primary-teal);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    color: #555;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: #777;
    margin-bottom: 1.5rem;
  }

  .reset-button {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .reset-button:hover {
    background-color: var(--color-complementary-medium-teal);
  }

  /* Grid/List View */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .products-grid.list-view {
    grid-template-columns: 1fr; /* Una columna para la vista de lista */
  }
</style>