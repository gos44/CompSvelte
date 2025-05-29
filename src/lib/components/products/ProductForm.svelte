<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let product = { id: null, name: '', price: '', description: '' };
  const dispatch = createEventDispatcher();
  let formData = { ...product };

  onMount(() => {
    formData = { ...product }; // copiar datos si es edición
  });

  const handleSubmit = () => {
    dispatch('submit', { ...formData });
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label>
    Nombre:
    <input type="text" bind:value={formData.name} required />
  </label>
  <label>
    Precio:
    <input type="number" bind:value={formData.price} required />
  </label>
  <label>
    Descripción:
    <textarea bind:value={formData.description}></textarea>
  </label>
  <button type="submit">Guardar</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
