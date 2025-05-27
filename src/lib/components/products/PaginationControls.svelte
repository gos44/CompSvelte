<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let currentPage: number;
  export let totalPages: number;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function goToPage(page: number) {
    dispatch('changePage', page);
  }
</script>

{#if totalPages > 1}
  <div class="pagination">
    <button
      class="pagination-button"
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1 || loading}
    >
      ‹ Anterior
    </button>

    <div class="pagination-info">
      Página {currentPage} de {totalPages}
    </div>

    <button
      class="pagination-button"
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages || loading}
    >
      Siguiente ›
    </button>
  </div>
{/if}

<style>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0;
    margin-top: 1.5rem;
    border-top: 1px solid #eee;
  }

  .pagination-button {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
    padding: 0.75rem 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .pagination-button:hover:not(:disabled) {
    background-color: var(--color-complementary-medium-teal);
  }

  .pagination-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 1rem;
    color: #555;
    font-weight: 500;
  }
</style>