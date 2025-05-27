<script lang="ts">
  import LoginComponent from '$lib/components/CompLogin.svelte';

  let loading: boolean = false;

  interface LoginEventDetail {
    email: string;
    password: string;
  }

  async function authenticateUser(email: string, password: string): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function handleLogin(event: CustomEvent<LoginEventDetail>) {
    loading = true;
    const { email, password } = event.detail;

    try {
      await authenticateUser(email, password);
      // Lógica después de autenticación exitosa
    } catch (error) {
      // Manejo de errores
    } finally {
      loading = false;
    }
  }
</script>

<LoginComponent 
  {loading}
  on:login={handleLogin}
  on:forgotPassword={() => console.log('Forgot password')}
  on:register={() => console.log('Register')}
/>