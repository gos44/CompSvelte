<script lang="ts">
  // Componente de Botones
  import BotonGenerico from '$lib/components/BotonGenerico.svelte';

  function handleClick() {
    alert('¡Botón presionado!');
  }
  // Componente de Tarjetas
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

  <Card title="Mi Tarjeta Favorita" subtitle="Una pequeña descripción">
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

<h1>Ejemplos de Botones</h1>

<div class="centered-item-container">
  <BotonGenerico label="Haz clic" variant="primary" onClick={handleClick} />
</div>

<div class="buttons-stacked-centered-container">
  <BotonGenerico label="Cancelar" variant="secondary" />
  <BotonGenerico label="Eliminar" variant="danger" disabled />
  <BotonGenerico label="Ver más" variant="outline" />
</div>

<style>
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
  }
  /* Estilo para centrar un elemento individual (como el primer botón) */
  .centered-item-container {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1rem 0;
  }
  /* Estilo para centrar un grupo de botones apilados verticalmente */
  .buttons-stacked-centered-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }
</style>