<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Product } from '../../types/Product';
  import { formatPrice, renderStars } from '$lib/utils/productUtils';

  export let product: Product;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function handleProductClick() {
    dispatch('click', product.id);
  }

  function handleAddToCart(e: MouseEvent) {
    e.stopPropagation();
    dispatch('addToCart', product.id);
  }

  function handleToggleFavorite(e: MouseEvent) {
    e.stopPropagation();
    dispatch('toggleFavorite', product.id);
  }
</script>

<div class="product-list-item" on:click={handleProductClick}>
  <div class="item-image-container">
    {#if product.image}
      <img src={product.image} alt={product.name} class="item-image" />
    {:else}
      <div class="item-placeholder">📷</div>
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

  <div class="item-info">
    <h3 class="item-name">{product.name}</h3>
    {#if product.category}
      <span class="item-category">{product.category}</span>
    {/if}
    {#if product.description}
      <p class="item-description">{product.description}</p>
    {/if}
    <div class="item-rating">
      {#if product.rating}
        <span class="stars">{renderStars(product.rating)}</span>
        <span class="rating-value">({product.rating})</span>
      {/if}
    </div>
  </div>

  <div class="item-actions-price">
    <div class="item-price">
      {#if product.originalPrice && product.originalPrice > product.price}
        <span class="original-price">{formatPrice(product.originalPrice)}</span>
      {/if}
      <span class="current-price">{formatPrice(product.price)}</span>
    </div>
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
  .product-list-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center; /* Alinea verticalmente los elementos */
    gap: 1.5rem; /* Espacio entre imagen, info y acciones */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    background-color: var(--color-complementary-white);
    position: relative;
    text-align: left; /* Asegura que el texto dentro esté alineado a la izquierda */
  }

  .product-list-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .item-image-container {
    flex-shrink: 0; /* Evita que la imagen se encoja */
    width: 100px; /* Tamaño fijo para la imagen en lista */
    height: 100px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-complementary-light-blue);
    border-radius: 4px;
  }

  .item-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .item-placeholder {
    font-size: 2rem;
    color: #ccc;
  }

  .favorite-button {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .favorite-button.favorited {
    color: var(--color-primary-red);
  }

  .item-info {
    flex-grow: 1; /* Permite que la info ocupe la mayor parte del espacio */
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .item-name {
    font-size: 1.1rem;
    margin: 0;
    color: var(--color-primary-teal);
  }

  .item-category {
    font-size: 0.8rem;
    color: #888;
    background-color: var(--color-complementary-light-blue);
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    align-self: flex-start;
  }

  .item-description {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limita a 2 líneas */
    -webkit-box-orient: vertical;
  }

  .item-rating {
    font-size: 0.9rem;
    color: #ffc107;
  }

  .item-actions-price {
    flex-shrink: 0; /* Evita que este bloque se encoja */
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Alinea los elementos a la derecha */
    gap: 0.5rem;
    text-align: right;
  }

  .item-price {
    display: flex;
    flex-direction: column; /* Apila los precios */
    align-items: flex-end;
    gap: 0.2rem;
  }

  .original-price {
    text-decoration: line-through;
    color: #888;
    font-size: 0.8rem;
  }

  .current-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--color-primary-red);
  }

  .add-to-cart-button {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
    padding: 0.6rem 0.8rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
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