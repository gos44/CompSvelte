<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  // Props
  export let title = 'Iniciar Sesión';
  export let subtitle = 'Accede a tu cuenta';
  export let loading = false;
  export let showForgotPassword = true;
  export let showRegisterLink = true;

  // Estado del formulario (usa let en vez de $state)
  let email = '';
  let password = '';
  let errors: { [key: string]: string | undefined } = {};
  let showPassword = false;

  // Validaciones
  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  // Manejar envío del formulario
  function handleSubmit() {
    if (validateForm() && !loading) {
      dispatch('login', {
        email: email.trim(),
        password
      });
    }
  }

  // Limpiar errores cuando el usuario escribe
   function clearError(field: string) {
    if (errors[field]) {
      errors = { ...errors, [field]: undefined };
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1 class="login-title">{title}</h1>
      <p class="login-subtitle">{subtitle}</p>
    </div>

    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-input"
          class:error={errors.email}
          bind:value={email}
          on:input={() => clearError('email')}
          placeholder="tu@email.com"
          disabled={loading}
        />
        {#if errors.email}
          <span class="error-message">{errors.email}</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Contraseña</label>
        <div class="password-input-container">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            class="form-input password-input"
            class:error={errors.password}
            bind:value={password}
            on:input={() => clearError('password')}
            placeholder="••••••••"
            disabled={loading}
          />
          <button
            type="button"
            class="password-toggle"
            on:click={() => showPassword = !showPassword}
            disabled={loading}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {#if errors.password}
          <span class="error-message">{errors.password}</span>
        {/if}
      </div>

      <button
        type="submit"
        class="submit-button"
        disabled={loading}
      >
        {#if loading}
          <span class="loading-spinner"></span>
          Iniciando sesión...
        {:else}
          Iniciar Sesión
        {/if}
      </button>
    </form>

    <div class="login-footer">
      {#if showForgotPassword}
        <button
          type="button"
          class="link-button"
          on:click={() => dispatch('forgotPassword')}
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      {/if}

      {#if showRegisterLink}
        <p class="register-text">
          ¿No tienes cuenta?
          <button
            type="button"
            class="link-button register-link"
            on:click={() => dispatch('register')}
            disabled={loading}
          >
            Regístrate aquí
          </button>
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(:root) {
    --color-primary-teal: #2E9C9D;
    --color-primary-red: #D92127;
    --color-complementary-white: #FFFFFF;
    --color-complementary-light-blue: #CDEEEE;
    --color-complementary-medium-teal: #66BBBA;
    --color-complementary-light-red: #ED8380;
    --color-error: var(--color-primary-red);
  }

  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--color-complementary-light-blue) 0%, var(--color-complementary-medium-teal) 100%);
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .login-card {
    background: var(--color-complementary-white);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(46, 156, 157, 0.15);
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(46, 156, 157, 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-title {
    color: var(--color-primary-teal);
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .login-subtitle {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
    opacity: 0.8;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    color: var(--color-primary-teal);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form-input {
    padding: 0.875rem 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: var(--color-complementary-white);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary-teal);
    box-shadow: 0 0 0 3px rgba(46, 156, 157, 0.1);
  }

  .form-input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .form-input.error {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(217, 33, 39, 0.1);
  }

  .password-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input {
    padding-right: 3rem;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.1rem;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .password-toggle:hover:not(:disabled) {
    opacity: 1;
  }

  .password-toggle:disabled {
    cursor: not-allowed;
  }

  .error-message {
    color: var(--color-error);
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  .submit-button {
    background: var(--color-primary-teal);
    color: var(--color-complementary-white);
    border: none;
    border-radius: 8px;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .submit-button:hover:not(:disabled) {
    background: #267879;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(46, 156, 157, 0.3);
  }

  .submit-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
  }

  .link-button {
    background: none;
    border: none;
    color: var(--color-primary-teal);
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
    padding: 0;
    transition: color 0.2s ease;
  }

  .link-button:hover:not(:disabled) {
    color: #267879;
  }

  .link-button:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }

  .register-text {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .register-link {
    color: var(--color-complementary-medium-teal);
    font-weight: 600;
  }

  .register-link:hover:not(:disabled) {
    color: var(--color-primary-teal);
  }

  /* Responsive */
  @media (max-width: 480px) {
    .login-card {
      padding: 2rem 1.5rem;
      margin: 1rem;
    }

    .login-title {
      font-size: 1.5rem;
    }
  }
</style>