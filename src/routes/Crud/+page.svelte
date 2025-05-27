<script lang="ts">
  import CrudList from '$lib/components/CrudList.svelte';
  import type { CrudItem } from '$lib/types/CrudItem';

  // Define el tipo específico de tus elementos (ej. Usuario)
  interface User extends CrudItem {
    name: string;
    email: string;
    age: number;
  }

  // Simulación de datos (normalmente vendrían de una API o store)
  let users: User[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', age: 30 },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', age: 35 },
  ];

  // Una variable para el próximo ID (simulación de backend)
  let nextId = 4;

  // Manejadores de eventos que recibirán los datos del CrudList
  function handleCreate(event: CustomEvent<CrudItem>) {
    const newUser = { ...event.detail, id: String(nextId++) } as User; // Asignar un ID simulado
    users = [...users, newUser]; // Añadir el nuevo usuario a la lista
    console.log('Crear usuario:', newUser);
    // Aquí es donde harías la llamada a tu API para crear el usuario real
  }

  function handleUpdate(event: CustomEvent<CrudItem>) {
    const updatedUser = event.detail as User;
    users = users.map(u => (u.id === updatedUser.id ? updatedUser : u)); // Actualizar en la lista
    console.log('Actualizar usuario:', updatedUser);
    // Aquí es donde harías la llamada a tu API para actualizar el usuario real
  }

  function handleDelete(event: CustomEvent<string>) {
    const idToDelete = event.detail;
    users = users.filter(u => u.id !== idToDelete); // Borrar de la lista
    console.log('Borrar usuario con ID:', idToDelete);
    // Aquí es donde harías la llamada a tu API para borrar el usuario real
  }

  function handleSelect(event: CustomEvent<CrudItem>) {
    const selectedUser = event.detail as User;
    alert(`Usuario seleccionado: ${selectedUser.name} (${selectedUser.email})`);
    console.log('Seleccionar usuario:', selectedUser);
    // Aquí podrías redirigir a una página de detalles o abrir un modal
  }
</script>

<main>
  <CrudList
    title="Gestión de Usuarios"
    items={users}
    itemLabelKey="name"
    newButtonText="Nuevo Usuario"
    on:create={handleCreate}
    on:update={handleUpdate}
    on:delete={handleDelete}
    on:select={handleSelect}
  />

  </main>

<style>
  /* Puedes añadir estilos globales si es necesario, o usar los estilos del componente */
  main {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
</style>