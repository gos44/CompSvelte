<script>
  import ProductList from '$lib/components/products/ProductList.svelte';
</script>

<main>
  <h1>Gestión de Productos</h1>
  <ProductList />
</main>

<style>
  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  button {
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #005bb5;
  }
</style>
