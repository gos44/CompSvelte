<script lang="ts">
  import SimpleModal from '$lib/components/Modal.svelte';

  let showBasicModal = $state(false);
  let showModalWithSlots = $state(false);

  function handleBasicModalClose() {
    console.log('Modal Básico cerrado');
    showBasicModal = false;
  }

  function handleSlotModalClose() {
    console.log('Modal con Slots cerrado');
    showModalWithSlots = false;
  }
</script>

<h1 style="text-align: center; margin-bottom: 20px;">Ejemplos de SimpleModal</h1>

<div style="display: flex; justify-content: center; gap: 20px;">
  <button
    style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 5px;"
    on:click={() => showBasicModal = true}
  >
    Abrir Modal Básico
  </button>

  <button
    style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #28a745; color: white; border: none; border-radius: 5px;"
    on:click={() => showModalWithSlots = true}
  >
    Abrir Modal con Slots
  </button>
</div>


<SimpleModal bind:isOpen={showBasicModal} on:close={handleBasicModalClose}>
  <p>Este es un modal muy simple. Solo tiene el contenido del cuerpo.</p>
  <p>Puedes cerrarlo con la "X", haciendo clic fuera o presionando ESC.</p>
</SimpleModal>

<SimpleModal bind:isOpen={showModalWithSlots} on:close={handleSlotModalClose}>
  <svelte:fragment slot="header">
    <h2 style="margin: 0; font-size: 1.2em;">Título Personalizado</h2>
  </svelte:fragment>

  <p>Este modal utiliza los slots <code>header</code> y <code>footer</code>.</p>
  <p>Esto te da control total sobre cómo se ve la cabecera y el pie de página.</p>

  <svelte:fragment slot="footer">
    <button
      style="padding: 8px 15px; font-size: 14px; cursor: pointer; background-color: #6c757d; color: white; border: none; border-radius: 4px;"
      on:click={() => showModalWithSlots = false}
    >
      Cerrar
    </button>
    <button
      style="padding: 8px 15px; font-size: 14px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px;"
      on:click={() => alert('¡Acción realizada!')}
    >
      Aceptar
    </button>
  </svelte:fragment>
</SimpleModal>