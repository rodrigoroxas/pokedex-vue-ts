import type { Pokemon } from '@/types/pokemon'
import { getTypeLabel } from './pokemonType'

/** Formatea el id como en el diseño: 1 -> "Nº001". */
export function formatPokedexNumber(id: number): string {
  return `Nº${String(id).padStart(3, '0')}`
}

/** Capitaliza el nombre (la API entrega "bulbasaur"). */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Extrae el id numérico desde la url de un recurso de la lista.
 * Ej: ".../pokemon/25/" -> 25. Permite conocer el id sin pedir el detalle.
 */
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

/**
 * Construye el texto que copia el botón "Compartir": el nombre del Pokémon
 * seguido de sus atributos, todo separado por comas (requisito de la prueba).
 */
export function formatShareText(pokemon: Pokemon): string {
  const parts: string[] = [
    capitalize(pokemon.name),
    formatPokedexNumber(pokemon.id),
    ...pokemon.types.map(getTypeLabel),
    `Peso: ${pokemon.weightKg} kg`,
    `Altura: ${pokemon.heightMeters} m`,
    ...pokemon.stats.map((stat) => `${stat.name}: ${stat.value}`),
  ]
  return parts.join(', ')
}
