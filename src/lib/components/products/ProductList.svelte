<script lang="ts">
  import Product from './Product.svelte';

    type ProductType = {
    id: number | null;
    name: string;
    price: number;
    description: string;
  };

  let products :ProductType[] = [];
  let selectedProduct:ProductType | null = null;
  let editingProduct:ProductType | null = null;

  const fetchProducts = () => {
    // Simulación de llamada a una API
    products = [
      { id: 1, name: "Laptop", price: 1200, description: "Laptop potente" },
      { id: 2, name: "Mouse", price: 25, description: "Mouse ergonómico" },
      { id: 3, name: "Mouse", price: 25, description: "Mouse ergonómico" }
    ];
  };

  const viewProduct = (product: ProductType) => selectedProduct = product;
  const closeModal = () => selectedProduct = null;

  const openEdit = (product: ProductType) => editingProduct = product;
  const openNew = () => editingProduct = { id: 0, name: '', price: 0, description: '' };
  const closeEdit = () => editingProduct = null;

  const handleSave = (event: CustomEvent<ProductType>) => {
    const data = event.detail;

    if (data.id) {
      // Editar
      products = products.map(p => (p.id === data.id ? data : p));
    } else {
      // Crear
    data.id = Math.max(0, ...products.map(p => p.id).filter((id): id is number => id !== null)) + 1;
      products = [...products, data];
    }

    closeEdit();
  };

  const deleteProduct = (id: number) => {
    if (confirm("¿Eliminar producto?")) {
      products = products.filter(p => p.id !== id);
    }
  };

  // Cargar al iniciar
  fetchProducts();
</script>

<h2>Productos</h2>
<button on:click={openNew}>Nuevo Producto</button>

{#each products as product (product.id)}
  <Product
    {product}
    onView={viewProduct}
    onEdit={openEdit}
    onDelete={deleteProduct}
  />
{/each}

