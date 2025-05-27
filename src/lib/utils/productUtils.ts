// src/lib/utils/productUtils.ts

import type { Product } from '../types/Product'; // Importa la interfaz

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function renderStars(rating: number | undefined): string {
  const stars = [];
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('★');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('☆'); // Puedes usar '⭐' o '½' para media estrella si quieres
    } else {
      stars.push('☆');
    }
  }
  return stars.join('');
}

// Podrías agregar aquí funciones de filtrado o ordenamiento si fueran muy complejas
// y quisieras desacoplar la lógica de ProductList.svelte aún más.