<script lang="ts">



  import Card from '$lib/components/Card.svelte';


</script>



<h1>Ejemplos de Tarjetas Genéricas</h1>

<div class="card-container">
  <Card title="¡Card 1!">
    <p>Este es el contenido de la primera tarjeta. Puede ser cualquier HTML.</p>
    <ul>
      <li>Elemento 1</li>
      <li>Elemento 2</li>
    </ul>
  </Card>

  <Card title="Mi  Tarjeta Favorito " subtitle="Una pequeña descripción">
    <p>
      Aquí podemos escribir un párrafo más largo para demostrar cómo el contenido del slot
      se adapta dentro de la tarjeta.
    </p>
    <button>Haz clic</button>
  </Card>

  <Card title="Tarjeta Especial" subtitle="Con un estilo único" customClass="special-card">
    <p>Esta tarjeta tiene una clase CSS adicional para un diseño diferente.</p>
    <span>¡Mira qué bien se ve!</span>
  </Card>
</div>

<style>
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
  }

  /* Estilo adicional para la "Tarjeta Especial" */
  .special-card {
    background-color: #e0f2f1; /* Un color de fondo diferente */
    border-color: #4db6ac; /* Un borde diferente */
    box-shadow: 0 6px 16px rgba(0, 150, 136, 0.2); /* Una sombra más pronunciada */
  }

  .special-card .card-title {
    color: #00796b; /* Color de título más oscuro */
  }

  .special-card .card-subtitle {
    color: #26a69a;
  }
</style>
