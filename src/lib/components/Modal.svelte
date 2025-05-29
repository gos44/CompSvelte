<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  // Propiedad para controlar la visibilidad del modal
  let { isOpen = $bindable(false) } = $props();

  // Despachador de eventos para comunicar con el padre
  const dispatch = createEventDispatcher();

  // Función para cerrar el modal
  function closeModal() {
    isOpen = false;
    dispatch('close'); // Emite un evento 'close' al componente padre
  }

  // Cierra el modal si se hace clic fuera del contenido
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('simple-modal-overlay')) {
      closeModal();
    }
  }

  // Cierra el modal al presionar la tecla Escape
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

{#if isOpen}
  <div
    class="simple-modal-overlay"
    on:click={handleClickOutside}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="simple-modal-content"
      transition:fade={{ duration: 150 }}
    >
      {#if $$slots.header}
        <div class="simple-modal-header">
          <slot name="header" />
          <button class="simple-modal-close-button" on:click={closeModal} aria-label="Cerrar">
            &times;
          </button>
        </div>
      {:else}
        <button class="simple-modal-close-button" on:click={closeModal} aria-label="Cerrar">
          &times;
        </button>
      {/if}

      <div class="simple-modal-body">
        <slot />
      </div>

      {#if $$slots.footer}
        <div class="simple-modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Estilos mínimos para que funcione */
  .simple-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Asegura que esté por encima de otros elementos */
  }

  .simple-modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px; /* Ancho máximo para el contenido */
    width: 90%; /* Ancho responsivo */
    position: relative; /* Para posicionar el botón de cerrar */
  }

  .simple-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .simple-modal-close-button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    line-height: 1; /* Alineación vertical */
    padding: 0; /* Elimina padding por defecto */
    position: absolute; /* Posiciona el botón de cerrar */
    top: 10px;
    right: 10px;
  }

  .simple-modal-body {
    /* Puedes añadir estilos para el cuerpo si lo necesitas */
  }

  .simple-modal-footer {
    margin-top: 20px;
    border-top: 1px solid #eee;
    padding-top: 15px;
    display: flex;
    justify-content: flex-end; /* Alinea los botones a la derecha */
    gap: 10px; /* Espacio entre los botones */
  }
</style>