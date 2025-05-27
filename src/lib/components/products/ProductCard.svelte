<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Product } from '../../types/Product';
  import { formatPrice, renderStars } from '$lib/utils/productUtils'; // Importar utilidades

  export let product: Product;
  export let loading: boolean = false; // Para deshabilitar botones si hay una operación global

  const dispatch = createEventDispatcher();

  function handleProductClick() {
    dispatch('click', product.id); // Emite el ID para más modularidad
  }

  function handleAddToCart(e: MouseEvent) {
    e.stopPropagation(); // Evita que se dispare el click del card
    dispatch('addToCart', product.id);
  }

  function handleToggleFavorite(e: MouseEvent) {
    e.stopPropagation(); // Evita que se dispare el click del card
    dispatch('toggleFavorite', product.id);
  }
</script>

<div class="product-card" on:click={handleProductClick}>
  <div class="product-image-container">
    {#if product.image}
      <img src={product.image} alt={product.name} class="product-image" />
    {:else}
      <div class="product-placeholder">📷</div>
    {/if}

    <button
      class="favorite-button"
      class:favorited={product.isFavorite}
      on:click={handleToggleFavorite}
      disabled={loading}
    >
      {product.isFavorite ? '❤️' : '🤍'}
    </button>
  </div>

  <div class="product-info">
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

  <div class="product-actions">
    <button
      class="add-to-cart-button"
      on:click={handleAddToCart}
      disabled={loading}
    >
      🛒 Añadir al carrito
    </button>
  </div>
</div>

<style>
  .product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    background-color: var(--color-complementary-white); /* Usa la variable CSS */
    position: relative; /* Para el botón de favorito */
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  .product-image-container {
    width: 100%;
    max-width: 150px; /* Ajusta según sea necesario */
    height: 150px;
    margin-bottom: 1rem;
    overflow: hidden;
    position: relative; /* Para el botón de favorito */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-complementary-light-blue);
    border-radius: 4px;
  }

  .product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Asegura que la imagen se ajuste sin cortarse */
  }

  .product-placeholder {
    font-size: 3rem;
    color: #ccc;
  }

  .favorite-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
  }

  .favorite-button:hover {
    background-color: rgba(255, 255, 255, 1);
  }

  .favorite-button.favorited {
    color: var(--color-primary-red); /* Usa tu color rojo para favorito */
  }

  .product-info {
    flex-grow: 1; /* Permite que la info ocupe espacio disponible */
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .product-name {
    font-size: 1.2rem;
    margin: 0;
    color: var(--color-primary-teal);
  }

  .product-category {
    font-size: 0.85rem;
    color: #888;
    background-color: var(--color-complementary-light-blue);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    align-self: flex-start; /* Alinea la categoría a la izquierda si flex-direction: column */
  }

  .product-description {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
    text-align: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Limita a 3 líneas */
    -webkit-box-orient: vertical;
  }

  .product-rating {
    font-size: 1rem;
    color: #ffc107; /* Color para las estrellas */
  }

  .product-price {
    display: flex;
    justify-content: center; /* Centra los precios si solo hay uno */
    align-items: baseline;
    gap: 0.5rem;
    margin-top: auto; /* Empuja el precio hacia abajo si hay espacio */
  }

  .original-price {
    text-decoration: line-through;
    color: #888;
    font-size: 0.9rem;
  }

  .current-price {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--color-primary-red);
  }

  .product-actions {
    width: 100%;
  }

  .add-to-cart-button {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.2s ease;
  }

  .add-to-cart-button:hover:not(:disabled) {
    background-color: var(--color-complementary-medium-teal);
  }

  .add-to-cart-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>