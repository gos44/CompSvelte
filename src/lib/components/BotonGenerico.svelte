<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let label: string = 'Botón';
  export let onClick: (event: MouseEvent) => void = () => {};
  export let disabled: boolean = false;
  // Añade 'gradient' como una opción de variante
  export let variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient' = 'primary';
  export let className: string = '';
</script>

<button
  type={type}
  class={`btn btn-${variant} ${className}`}
  disabled={disabled}
  onclick={onClick}
>
  {label}
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s, background-image 0.2s, border-color 0.2s; /* Asegura la transición del degradado */
    white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* --- Variantes existentes --- */
  .btn-primary {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-complementary-medium-teal);
  }

  .btn-secondary {
    background-color: #6c757d;
    color: var(--color-complementary-white);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #5a6268;
  }

  .btn-danger {
    background-color: var(--color-primary-red);
    color: var(--color-complementary-white);
  }

  .btn-danger:hover:not(:disabled) {
    background-color: var(--color-error);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--color-primary-teal);
    border: 2px solid var(--color-primary-teal);
  }

  .btn-outline:hover:not(:disabled) {
    background-color: var(--color-primary-teal);
    color: var(--color-complementary-white);
  }

  /* --- Nueva variante: Degradado --- */
  .btn-gradient {
    /* Degradado de teal a un rojo claro, o puedes elegir otros dos de tu paleta */
    background-image: linear-gradient(to right, var(--color-primary-teal), var(--color-complementary-light-red));
    color: var(--color-complementary-white); /* Asegura que el texto sea visible */
    border: none; /* Sin borde si el degradado es el foco */
  }

  .btn-gradient:hover:not(:disabled) {
    /* Un ligero ajuste o un degradado diferente al pasar el ratón */
    background-image: linear-gradient(to right, var(--color-complementary-medium-teal), var(--color-primary-red));
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Opcional: sombra al pasar el ratón */
  }
</style>