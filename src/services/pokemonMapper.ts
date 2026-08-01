import type { Pokemon, PokemonDetailResponse, PokemonTypeName } from '@/types/pokemon'
import { computeWeaknesses } from '@/utils/pokemonType'

/** Etiquetas legibles en español para las stats base. */
const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

/**
 * Traduce la respuesta cruda de /pokemon/{name} al modelo de dominio.
 * Aquí ocurren las conversiones de unidades y el cálculo de debilidades,
 * de modo que la UI reciba datos ya listos para mostrar (separación de
 * responsabilidades: los componentes no conocen la forma de la API).
 */
export function mapPokemonDetail(raw: PokemonDetailResponse): Pokemon {
  const types = raw.types
    .sort((a, b) => a.slot - b.slot)
    .map((slot) => slot.type.name as PokemonTypeName)

  const artwork = raw.sprites.other?.['official-artwork']?.front_default
  const sprite = raw.sprites.front_default

  return {
    id: raw.id,
    name: raw.name,
    types,
    // Decímetros → metros, hectogramos → kilogramos.
    heightMeters: raw.height / 10,
    weightKg: raw.weight / 10,
    abilities: raw.abilities.map((slot) => slot.ability.name),
    stats: raw.stats.map((slot) => ({
      name: STAT_LABELS[slot.stat.name] ?? slot.stat.name,
      value: slot.base_stat,
    })),
    spriteUrl: sprite ?? artwork ?? '',
    artworkUrl: artwork ?? sprite ?? '',
    weaknesses: computeWeaknesses(types),
  }
}
