<!-- Navbar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { NavbarConfig, NavItem, NavbarAction } from '$lib/types/navbar.types';
  import { goto } from '$app/navigation'; // solo si usas SvelteKit

  export let config: NavbarConfig;
  export let currentPath: string = '';

  let isMobileMenuOpen = false;
  let openSubmenu: string | null = null;

  const dispatch = createEventDispatcher<{
    navigate: { item: NavItem; href?: string };
    action: { action: NavbarAction };
    brandClick: void;
  }>();

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function toggleSubmenu(itemId: string) {
    openSubmenu = openSubmenu === itemId ? null : itemId;
  }

  function handleNavClick(item: NavItem, event: MouseEvent) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }

    if (item.children && item.children.length > 0) {
      event.preventDefault();
      toggleSubmenu(item.id);
    }

    dispatch('navigate', { item, href: item.href });
    
    if (isMobileMenuOpen) {
      isMobileMenuOpen = false;
    }
  }

  function handleActionClick(action: NavbarAction, event: MouseEvent) {
  if (action.onClick) {
    event.preventDefault();
    action.onClick();
  }

  // Redirigir si tiene href
  if (action.href) {
    event.preventDefault();
    // Elige una de las siguientes líneas:
    // window.location.href = action.href; // navegación estándar
    goto(action.href); // navegación SPA (recomendada con SvelteKit)
  }

  dispatch('action', { action });
}

  function handleBrandClick() {
    dispatch('brandClick');
  }

  function isActiveItem(item: NavItem): boolean {
    if (item.href && currentPath === item.href) return true;
    if (item.children) {
      return item.children.some(child => child.href === currentPath);
    }
    return false;
  }

  // Cerrar menú móvil al hacer click fuera
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar') && isMobileMenuOpen) {
      isMobileMenuOpen = false;
    }
  }
</script>

<svelte:window onclick={handleOutsideClick} />

<nav class="navbar navbar--{config.style || 'default'} navbar--{config.position || 'static'}">
  <div class="navbar__container">
    <!-- Brand/Logo -->
    {#if config.brand}
      <div class="navbar__brand">
        {#if config.brand.href}
          <a 
            href={config.brand.href} 
            class="navbar__brand-link"
            onclick={handleBrandClick}
          >
            {#if config.brand.logo}
              <img src={config.brand.logo} alt={config.brand.text || 'Logo'} class="navbar__logo" />
            {/if}
            {#if config.brand.text}
              <span class="navbar__brand-text">{config.brand.text}</span>
            {/if}
          </a>
        {:else}
          <div class="navbar__brand-content" onclick={handleBrandClick} role="button" tabindex="0">
            {#if config.brand.logo}
              <img src={config.brand.logo} alt={config.brand.text || 'Logo'} class="navbar__logo" />
            {/if}
            
            {#if config.brand.text}
              <span class="navbar__brand-text">{config.brand.text}</span>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Desktop Navigation -->
    <div class="navbar__nav">
      <ul class="navbar__nav-list">
        {#each config.items as item}
          <li class="navbar__nav-item" class:navbar__nav-item--active={isActiveItem(item)}>
            {#if item.href && !item.children}
              <a 
                href={item.href} 
                class="navbar__nav-link"
                class:navbar__nav-link--disabled={item.disabled}
                onclick={(e) => handleNavClick(item, e)}
              >
                {#if item.icon}
                  <i class="navbar__nav-icon {item.icon}"></i>
                {/if}
                {item.label}
                {#if item.badge}
                  <span class="navbar__nav-badge">{item.badge}</span>
                {/if}
              </a>
            {:else}
              <button 
                class="navbar__nav-link navbar__nav-link--button"
                class:navbar__nav-link--disabled={item.disabled}
                class:navbar__nav-link--open={openSubmenu === item.id}
                onclick={(e) => handleNavClick(item, e)}
              >
                {#if item.icon}
                  <i class="navbar__nav-icon {item.icon}"></i>
                {/if}
                {item.label}
                {#if item.badge}
                  <span class="navbar__nav-badge">{item.badge}</span>
                {/if}
                {#if item.children && item.children.length > 0}
                  <i class="navbar__nav-arrow">▼</i>
                {/if}
              </button>

              {#if item.children && item.children.length > 0}
                <ul class="navbar__submenu" class:navbar__submenu--open={openSubmenu === item.id}>
                  {#each item.children as subItem}
                    <li class="navbar__submenu-item">
                      {#if subItem.href}
                        <a 
                          href={subItem.href} 
                          class="navbar__submenu-link"
                          class:navbar__submenu-link--active={currentPath === subItem.href}
                          class:navbar__submenu-link--disabled={subItem.disabled}
                          onclick={(e) => handleNavClick(subItem, e)}
                        >
                          {#if subItem.icon}
                            <i class="navbar__submenu-icon {subItem.icon}"></i>
                          {/if}
                          {subItem.label}
                          {#if subItem.badge}
                            <span class="navbar__submenu-badge">{subItem.badge}</span>
                          {/if}
                        </a>
                      {:else}
                        <button 
                          class="navbar__submenu-link navbar__submenu-link--button"
                          class:navbar__submenu-link--disabled={subItem.disabled}
                          onclick={(e) => handleNavClick(subItem, e)}
                        >
                          {#if subItem.icon}
                            <i class="navbar__submenu-icon {subItem.icon}"></i>
                          {/if}
                          {subItem.label}
                          {#if subItem.badge}
                            <span class="navbar__submenu-badge">{subItem.badge}</span>
                          {/if}
                        </button>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Actions -->
    {#if config.actions && config.actions.length > 0}
      <div class="navbar__actions">
        {#each config.actions as action}
          {#if action.type === 'link' && action.href}
            <a 
              href={action.href} 
              class="navbar__action navbar__action--{action.variant || 'primary'}"
              onclick={(e) => handleActionClick(action, e)}
            >
              {#if action.icon}
                <i class="navbar__action-icon {action.icon}"></i>
              {/if}
              {action.label}
            </a>
          {:else}
            <button 
              class="navbar__action navbar__action--{action.variant || 'primary'}"
              onclick={(e) => handleActionClick(action, e)}
            >
              {#if action.icon}
                <i class="navbar__action-icon {action.icon}"></i>
              {/if}
              {action.label}
            </button>
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Mobile Menu Toggle -->
    {#if config.showMobileMenu !== false}
      <button 
        class="navbar__mobile-toggle"
        class:navbar__mobile-toggle--open={isMobileMenuOpen}
        onclick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    {/if}
  </div>

  <!-- Mobile Menu -->
  {#if config.showMobileMenu !== false}
    <div class="navbar__mobile-menu" class:navbar__mobile-menu--open={isMobileMenuOpen}>
      <ul class="navbar__mobile-nav">
        {#each config.items as item}
          <li class="navbar__mobile-item">
            {#if item.href && !item.children}
              <a 
                href={item.href} 
                class="navbar__mobile-link"
                class:navbar__mobile-link--active={isActiveItem(item)}
                class:navbar__mobile-link--disabled={item.disabled}
                onclick={(e) => handleNavClick(item, e)}
              >
                {#if item.icon}
                  <i class="navbar__mobile-icon {item.icon}"></i>
                {/if}
                {item.label}
                {#if item.badge}
                  <span class="navbar__mobile-badge">{item.badge}</span>
                {/if}
              </a>
            {:else}
              <button 
                class="navbar__mobile-link navbar__mobile-link--button"
                class:navbar__mobile-link--disabled={item.disabled}
                onclick={(e) => handleNavClick(item, e)}
              >
                {#if item.icon}
                  <i class="navbar__mobile-icon {item.icon}"></i>
                {/if}
                {item.label}
                {#if item.badge}
                  <span class="navbar__mobile-badge">{item.badge}</span>
                {/if}
                {#if item.children && item.children.length > 0}
                  <i class="navbar__mobile-arrow">▼</i>
                {/if}
              </button>

              {#if item.children && item.children.length > 0 && openSubmenu === item.id}
                <ul class="navbar__mobile-submenu">
                  {#each item.children as subItem}
                    <li class="navbar__mobile-submenu-item">
                      {#if subItem.href}
                        <a 
                          href={subItem.href} 
                          class="navbar__mobile-submenu-link"
                          class:navbar__mobile-submenu-link--active={currentPath === subItem.href}
                          class:navbar__mobile-submenu-link--disabled={subItem.disabled}
                          onclick={(e) => handleNavClick(subItem, e)}
                        >
                          {#if subItem.icon}
                            <i class="navbar__mobile-submenu-icon {subItem.icon}"></i>
                          {/if}
                          {subItem.label}
                          {#if subItem.badge}
                            <span class="navbar__mobile-submenu-badge">{subItem.badge}</span>
                          {/if}
                        </a>
                      {:else}
                        <button 
                          class="navbar__mobile-submenu-link navbar__mobile-submenu-link--button"
                          class:navbar__mobile-submenu-link--disabled={subItem.disabled}
                          onclick={(e) => handleNavClick(subItem, e)}
                        >
                          {#if subItem.icon}
                            <i class="navbar__mobile-submenu-icon {subItem.icon}"></i>
                          {/if}
                          {subItem.label}
                          {#if subItem.badge}
                            <span class="navbar__mobile-submenu-badge">{subItem.badge}</span>
                          {/if}
                        </button>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            {/if}
          </li>
        {/each}

        {#if config.actions && config.actions.length > 0}
          <li class="navbar__mobile-actions">
            {#each config.actions as action}
              {#if action.type === 'link' && action.href}
                <a 
                  href={action.href} 
                  class="navbar__mobile-action navbar__mobile-action--{action.variant || 'primary'}"
                  onclick={(e) => handleActionClick(action, e)}
                >
                  {#if action.icon}
                    <i class="navbar__mobile-action-icon {action.icon}"></i>
                  {/if}
                  {action.label}
                </a>
              {:else}
                <button 
                  class="navbar__mobile-action navbar__mobile-action--{action.variant || 'primary'}"
                  onclick={(e) => handleActionClick(action, e)}
                >
                  {#if action.icon}
                    <i class="navbar__mobile-action-icon {action.icon}"></i>
                  {/if}
                  {action.label}
                </button>
              {/if}
            {/each}
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</nav>

<style lang="scss">
  :root {
    --color-primary-teal: #2E9C9D;
    --color-primary-red: #D92127;
    --color-complementary-white: #FFFFFF;
    --color-complementary-light-blue: #CDEEEE;
    --color-complementary-medium-teal: #66BBBA;
    --color-complementary-light-red: #ED8380;
    --color-error: var(--color-primary-red);
  }

  .navbar {
    width: 100%;
    background-color: var(--color-complementary-white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    &--fixed {
      position: fixed;
      top: 0;
      left: 0;
    }

    &--sticky {
      position: sticky;
      top: 0;
    }

    &--transparent {
      background-color: transparent;
      box-shadow: none;
    }

    &--colored {
      background-color: var(--color-primary-teal);
      
      .navbar__brand-text,
      .navbar__nav-link,
      .navbar__action {
        color: var(--color-complementary-white);
      }
    }

    &__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    &__brand {
      display: flex;
      align-items: center;

      &-link,
      &-content {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }

      &-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary-teal);
        margin-left: 0.5rem;
      }
    }

    &__logo {
      height: 50px;
      width: auto;
    }

    &__nav {
      display: none;
      
      @media (min-width: 768px) {
        display: block;
        flex: 1;
        margin-left: 2rem;
      }

      &-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.5rem;
      }

      &-item {
        position: relative;

        &--active > .navbar__nav-link {
          color: var(--color-primary-teal);
          background-color: var(--color-complementary-light-blue);
        }

        &:hover .navbar__submenu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      }

      &-link {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: #333;
        border-radius: 4px;
        transition: all 0.2s ease;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;

        &--button {
          background: none;
          border: none;
        }

        &--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        &--open {
          color: var(--color-primary-teal);
          background-color: var(--color-complementary-light-blue);
        }

        &:hover:not(&--disabled) {
          color: var(--color-primary-teal);
          background-color: var(--color-complementary-light-blue);
        }
      }

      &-icon {
        margin-right: 0.5rem;
        font-size: 1rem;
      }

      &-badge {
        background-color: var(--color-primary-red);
        color: var(--color-complementary-white);
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border-radius: 12px;
        margin-left: 0.5rem;
        min-width: 18px;
        text-align: center;
      }

      &-arrow {
        margin-left: 0.5rem;
        font-size: 0.75rem;
        transition: transform 0.2s ease;
      }
    }

    &__submenu {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: var(--color-complementary-white);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;

      &--open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      &-item {
        margin: 0;
      }

      &-link {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: #333;
        transition: all 0.2s ease;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.9rem;
        width: 100%;
        text-align: left;

        &--active,
        &:hover:not(&--disabled) {
          color: var(--color-primary-teal);
          background-color: var(--color-complementary-light-blue);
        }

        &--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      }

      &-icon {
        margin-right: 0.5rem;
        font-size: 0.875rem;
      }

      &-badge {
        background-color: var(--color-primary-red);
        color: var(--color-complementary-white);
        font-size: 0.625rem;
        padding: 0.125rem 0.25rem;
        border-radius: 8px;
        margin-left: auto;
      }
    }

    &__actions {
      display: none;
      gap: 0.5rem;
      
      @media (min-width: 768px) {
        display: flex;
      }
    }

    &__action {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;

      &--primary {
        background-color: var(--color-primary-teal);
        color: var(--color-complementary-white);

        &:hover {
          background-color: var(--color-complementary-medium-teal);
        }
      }

      &--secondary {
        background-color: var(--color-primary-red);
        color: var(--color-complementary-white);

        &:hover {
          background-color: var(--color-complementary-light-red);
        }
      }

      &--outline {
        background-color: transparent;
        color: var(--color-primary-teal);
        border: 2px solid var(--color-primary-teal);

        &:hover {
          background-color: var(--color-primary-teal);
          color: var(--color-complementary-white);
        }
      }

      &-icon {
        margin-right: 0.5rem;
        font-size: 1rem;
      }
    }

    &__mobile-toggle {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 24px;
      height: 24px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      
      @media (min-width: 768px) {
        display: none;
      }

      span {
        width: 100%;
        height: 2px;
        background-color: var(--color-primary-teal);
        transition: all 0.3s ease;
        transform-origin: center;
      }

      &--open {
        span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        span:nth-child(2) {
          opacity: 0;
        }
        
        span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }
      }
    }

    &__mobile-menu {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: var(--color-complementary-white);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      
      @media (min-width: 768px) {
        display: none;
      }

      &--open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    &__mobile-nav {
      list-style: none;
      margin: 0;
      padding: 1rem 0;
    }

    &__mobile-item {
      margin: 0;
    }

    &__mobile-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
      width: 100%;
      text-align: left;

      &--active,
      &:hover:not(&--disabled) {
        color: var(--color-primary-teal);
        background-color: var(--color-complementary-light-blue);
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    &__mobile-icon {
      margin-right: 0.75rem;
      font-size: 1.125rem;
    }

    &__mobile-badge {
      background-color: var(--color-primary-red);
      color: var(--color-complementary-white);
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      border-radius: 12px;
      margin-left: 0.5rem;
    }

    &__mobile-arrow {
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    &__mobile-submenu {
      list-style: none;
      margin: 0;
      padding: 0;
      background-color: var(--color-complementary-light-blue);

      &-item {
        margin: 0;
      }

      &-link {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem 0.5rem 2rem;
        text-decoration: none;
        color: #333;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.9rem;
        width: 100%;
        text-align: left;

        &--active,
        &:hover:not(&--disabled) {
          color: var(--color-primary-teal);
          background-color: var(--color-complementary-white);
        }

        &--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      }

      &-icon {
        margin-right: 0.5rem;
        font-size: 1rem;
      }

      &-badge {
        background-color: var(--color-primary-red);
        color: var(--color-complementary-white);
        font-size: 0.625rem;
        padding: 0.125rem 0.25rem;
        border-radius: 8px;
        margin-left: auto;
      }
    }

    &__mobile-actions {
      border-top: 1px solid #eee;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &__mobile-action {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;

      &--primary {
        background-color: var(--color-primary-teal);
        color: var(--color-complementary-white);

        &:hover {
          background-color: var(--color-complementary-medium-teal);
        }
      }

      &--secondary {
        background-color: var(--color-primary-red);
        color: var(--color-complementary-white);

        &:hover {
          background-color: var(--color-complementary-light-red);
        }
      }

      &--outline {
        background-color: transparent;
        color: var(--color-primary-teal);
        border: 2px solid var(--color-primary-teal);

        &:hover {
          background-color: var(--color-primary-teal);
          color: var(--color-complementary-white);
        }
      }

      &-icon {
        margin-right: 0.5rem;
        font-size: 1rem;
      }
    }
  }
</style>