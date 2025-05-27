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
</style>