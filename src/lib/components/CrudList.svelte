<script lang="ts">
  import type { CrudItem } from '$lib/types/CrudItem';
  import { createEventDispatcher } from 'svelte';
 // Asegúrate de que esta ruta sea correcta

  // PROPS DEL COMPONENTE
  // items: Array de elementos a mostrar en la lista
  export let items: CrudItem[] = [];
  // itemLabelKey: La clave del objeto que se usará como etiqueta principal para mostrar cada item
  export let itemLabelKey: string = 'name'; // Por defecto, asume que hay una propiedad 'name'
  // title: Título del componente CRUD
  export let title: string = 'Gestión de Elementos';
  // newButtonText: Texto para el botón de "Nuevo"
  export let newButtonText: string = 'Agregar Nuevo';

  // ESTADO INTERNO
  let editingItem: CrudItem | null = null; // El elemento que se está editando actualmente (o null si ninguno)
  let newItem: CrudItem = {}; // Objeto para almacenar los datos del nuevo elemento a crear
  let showNewForm: boolean = false; // Bandera para mostrar/ocultar el formulario de creación

  // DESPACHADOR DE EVENTOS
  // Permite que el componente padre reaccione a las acciones CRUD
  const dispatch = createEventDispatcher<{
    create: CrudItem;
    update: CrudItem;
    delete: string; // ID del elemento a borrar
    select: CrudItem; // Cuando se selecciona un elemento (ej. para ver detalles)
  }>();

  // FUNCIONES DE MANEJO DE EVENTOS

  // Inicia la edición de un elemento existente
  function startEdit(item: CrudItem) {
    editingItem = { ...item }; // Creamos una copia para no modificar el original directamente
  }

  // Cancela la edición y el formulario de nuevo elemento
  function cancelEdit() {
    editingItem = null;
    showNewForm = false;
    newItem = {}; // Limpiar el formulario de nuevo elemento
  }

  // Maneja el guardado de un elemento (creación o actualización)
  function handleSave() {
    if (editingItem && editingItem.id) {
      // Si tiene un ID, es una actualización
      dispatch('update', editingItem);
    } else {
      // Si no tiene ID, es una creación
      dispatch('create', newItem);
    }
    cancelEdit(); // Limpiar y cerrar el formulario/modo edición
  }

  // Maneja la eliminación de un elemento
  function handleDelete(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      dispatch('delete', id);
    }
  }

  // Maneja la selección de un elemento (ej. para ver detalles en un padre)
  function handleSelect(item: CrudItem) {
    dispatch('select', item);
  }

  // Alterna la visibilidad del formulario de nuevo elemento
  function toggleNewForm() {
    showNewForm = !showNewForm;
    newItem = {}; // Asegurarse de que el formulario esté limpio
    editingItem = null; // Asegurarse de no estar en modo edición
  }

  // Reactive statement: Cuando editingItem cambia, si hay un item para editar,
  // se muestra el formulario de edición.
  // Esto es una simplificación; en un formulario real, usarías un bind:value
  // o un componente de formulario dedicado.
  $: if (editingItem) {
    showNewForm = false; // Si se empieza a editar, ocultar el formulario de nuevo
  }
</script>

<div class="crud-container">
  <h2 class="crud-title">{title}</h2>

  <div class="crud-actions">
    <button class="btn btn-primary" on:click={toggleNewForm}>
      {#if showNewForm}
      Cancelar
      {:else}
      {newButtonText}
      {/if}
    </button>
  </div>

  {#if showNewForm || editingItem}
    <div class="crud-form-panel">
      <h3>{editingItem ? 'Editar Elemento' : 'Crear Nuevo Elemento'}</h3>
      <div class="form-group">
        <label for="input-label">
            {itemLabelKey.charAt(0).toUpperCase() + itemLabelKey.slice(1)}:
        </label>
        {#if editingItem}
          <input
            type="text"
            id="input-label"
            bind:value={editingItem[itemLabelKey]}
            placeholder="Escribe aquí..."
            class="form-input"
          />
        {:else}
          <input
            type="text"
            id="input-label"
            bind:value={newItem[itemLabelKey]}
            placeholder="Escribe aquí..."
            class="form-input"
          />
        {/if}
      </div>
      <div class="form-actions">
        <button class="btn btn-success" on:click={handleSave}>Guardar</button>
        <button class="btn btn-secondary" on:click={cancelEdit}>Cancelar</button>
      </div>
    </div>
  {/if}

  <ul class="crud-list">
    {#each items as item (item.id)}
      <li class="crud-list-item">
        <span class="item-label" on:click={() => handleSelect(item)}>
          {item[itemLabelKey]}
        </span>
        <div class="item-actions">
          <button class="btn btn-icon btn-edit" on:click={() => startEdit(item)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-4 1a.5.5 0 0 1-.65-.65l1-4a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.293zm7.07-8.175a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-4 1a.5.5 0 0 1-.65-.65l1-4a.5.5 0 0 1 .11-.168z"/>
            </svg>
          </button>
          <button class="btn btn-icon btn-delete" on:click={() => handleDelete(item.id || '')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13V9a1 1 0 0 1 1-1h1zm-2-2A1.5 1.5 0 0 0 10.5 0h-5A1.5 1.5 0 0 0 4 1.5V2H.5a.5.5 0 0 0 0 1H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3h.5a.5.5 0 0 0 0-1H15zM4 1.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V2h-6zM3 14V3h10v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1"/>
            </svg>
          </button>
        </div>
      </li>
    {:else}
      <li class="no-items">No hay elementos para mostrar.</li>
    {/each}
  </ul>
</div>

<style lang="scss">
  :root {
    /* Colores base */
    --primary-color: #4CAF50; /* Verde */
    --primary-color-hover: #45a049; /* Verde más oscuro para hover */
    --secondary-color: #f44336; /* Rojo */
    --accent-color: #2196F3; /* Azul */
    --text-dark: #333;
    --text-light: #fff;
    --border-light: #ddd;
    --bg-light: #f9f9f9;
  }

  .crud-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background-color: var(--text-light);
  }

  .crud-title {
    text-align: center;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-size: 2em;
    font-weight: 600;
  }

  .crud-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.3s ease, transform 0.1s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &.btn-primary {
      background-color: var(--primary-color);
      color: var(--text-light);
      &:hover {
        background-color: var(--primary-color-hover); /* define esta variable en :root */
      }
    }

    &.btn-secondary {
      background-color: #ccc;
      color: var(--text-dark);
      &:hover { background-color: #bbb; }
    }

    &.btn-success {
      background-color: var(--accent-color);
      color: var(--text-light);
      &:hover { background-color: (var(--accent-color), 10%); }
    }

    &.btn-icon {
      padding: 0.5rem;
      background: none;
      border: 1px solid var(--border-light);
      color: var(--text-dark);

      &:hover {
        background-color: var(--bg-light);
        border-color: #ccc;
      }

      &.btn-edit {
        color: var(--primary-color);
        border-color: var(--primary-color);
        &:hover {
          background-color: (var(--primary-color), 45%);
          color: (var(--primary-color), 10%);
        }
      }

      &.btn-delete {
        color: var(--secondary-color);
        border-color: var(--secondary-color);
        &:hover {
          background-color: (var(--secondary-color), 40%);
          color: (var(--secondary-color), 10%);
        }
      }

      svg {
        width: 1.2em;
        height: 1.2em;
      }
    }
  }

  .crud-form-panel {
    background-color: var(--bg-light);
    border: 1px solid var(--border-light);
    border-radius: 5px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    h3 {
      margin-top: 0;
      color: var(--text-dark);
      font-size: 1.5em;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-dark);
      }
      .form-input {
        width: calc(100% - 1rem); /* Ajuste para el padding */
        padding: 0.75rem;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        font-size: 1em;
        &:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
  }

  .crud-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .crud-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-light);

    &:last-child {
      border-bottom: none;
    }

    .item-label {
      font-size: 1.1em;
      color: var(--text-dark);
      flex-grow: 1;
      cursor: pointer;
      &:hover {
        color: var(--accent-color);
      }
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .no-items {
    text-align: center;
    padding: 1rem;
    color: #666;
  }
</style>