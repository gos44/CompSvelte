<script lang="ts">
import { page } from '$app/stores';
import Navbar from '$lib/components/GenericNavbar.svelte';
import type { NavbarConfig } from '$lib/types/navbar.types';
import '../../static/global.css';
import Footer from '$lib/components/Footer.svelte';

const navConfig: NavbarConfig = {
  brand: {
    text: '',
    logo: '/LOGOPNGASMET1.png',
    href: '/'
  },
  items: [
    { id: 'home', label: 'Inicio', href: '/' },
	  { id: 'profile', label: 'profile', href: '/profile' },
    { id: 'Modal', label: 'Modal', href: '/Modal' },
    { id: 'Componentes', label: 'Componentes', href: '/Componentes' },
    {
      id: 'products',
      label: 'Productos',
      children: [
        { id: 'all', label: 'Todos', href: '/Products' },
        { id: 'featured', label: 'Destacados', href: '/products/featured' }
      ]
    },
    { id: 'about', label: 'Acerca de', href: '/about' }
  ],
  actions: [
    {
      id: 'login',
      type: 'link',
      href: '/Login',
      label: 'Iniciar Sesión', 
      variant: 'outline' 
    },
    { 
      id: 'register', 
      type: 'link', 
      href: '/Registrarse', 
      label: 'Registrarse', 
      variant: 'primary' 
    }

  ],
  style: 'default',
  position: 'sticky'
};

function handleNavigate(event: CustomEvent<{ item: any; href?: string }>) {
  console.log('Navegando a:', event.detail);
}

function handleAction(event: CustomEvent<{ action: any }>) {
  console.log('Acción:', event.detail.action.id);
}

$: currentPath = $page.url.pathname;
</script>

<Navbar
  config={navConfig}
  {currentPath}
  on:navigate={handleNavigate}
  on:action={handleAction}
  on:brandClick={() => console.log('Brand clicked')}
/>

<slot />

<Footer />
