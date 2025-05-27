<script>
  import ProductsComponent from '$lib/components/CompProducts.svelte';
  
  let products = [
    {
      id: 1,
      name: "Camiseta Premium",
      description: "Camiseta de algodón 100% orgánico",
      price: 24.99,
      originalPrice: 34.99,
      category: "Ropa",
      image: "https://picsum.photos/200/300",
      rating: 4.8,
      isFavorite: false
    },
    {
      id: 2,
      name: "Zapatillas Deportivas",
      description: "Zapatillas ligeras y cómodas para correr",
      price: 59.99,
      originalPrice: 79.99,
      category: "Calzado",
      image: "https://picsum.photos/200/301",
      rating: 4.7,
      isFavorite: true
    },
    {
      id: 3,
      name: "Reloj Inteligente",
      description: "Reloj con monitor de actividad y notificaciones",
      price: 199.99,
      originalPrice: 249.99,
      category: "Tecnología",
      image: "https://picsum.photos/200/302",
      rating: 4.5,
      isFavorite: false
    },
    {
      id: 4,
      name: "Auriculares Inalámbricos",
      description: "Auriculares con cancelación de ruido",
      price: 89.99,
      originalPrice: 129.99,
      category: "Tecnología",
      image: "https://picsum.photos/200/303",
      rating: 4.6,
      isFavorite: true
    },
    {
      id: 5,
      name: "Chaqueta Impermeable",
      description: "Chaqueta ligera y resistente al agua",
      price: 79.99,
      originalPrice: 99.99,
      category: "Ropa",
      image: "https://picsum.photos/200/304",
      rating: 4.4,
      isFavorite: false
    }

   
  ];
  
  let loading = false;
</script>

<ProductsComponent 
  {products}
  {loading}
  on:productClick={(e) => console.log('Ver producto:', e.detail)}
  on:addToCart={(e) => console.log('Añadir al carrito:', e.detail)}
  on:toggleFavorite={(e) => console.log('Toggle favorito:', e.detail)}
/>