<script>
  export let product;
  export let onView;
  export let onEdit;
  export let onDelete;
</script>

<div class="product-card">
  <h3>{product.name}</h3>
  <p>Precio: ${product.price}</p>
  <button on:click={() => onView(product)}>Ver</button>
  <button on:click={() => onEdit(product)}>Editar</button>
  <button on:click={() => onDelete(product.id)}>Eliminar</button>
</div>

<style>
  .product-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  button {
    margin-right: 0.5rem;
  }
</style>
