import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonTypeName,
  SpeciesInfo,
  SpeciesResponse,
} from '@/types/pokemon'
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
    speciesUrl: raw.species.url,
  }
}

/** Prefiere el texto en español; si no existe, cae a inglés o al primero. */
function pickLocalized<T extends { language: { name: string } }>(entries: T[]): T | undefined {
  return (
    entries.find((entry) => entry.language.name === 'es') ??
    entries.find((entry) => entry.language.name === 'en') ??
    entries[0]
  )
}

/**
 * Traduce la respuesta de /pokemon-species al subconjunto que usa el detalle:
 * categoría (genus), descripción (flavor text) y distribución de género.
 */
export function mapSpecies(raw: SpeciesResponse): SpeciesInfo {
  // El genus en español viene como "Pokémon Semilla"; se limpia a "Semilla".
  const category = (pickLocalized(raw.genera)?.genus ?? '')
    .replace(/pok[eé]mon/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  // El flavor text trae saltos de línea y de página; se normalizan a espacios.
  const description = (pickLocalized(raw.flavor_text_entries)?.flavor_text ?? '')
    .replace(/\s+/g, ' ')
    .trim()

  // gender_rate: -1 = sin género; si no, la fracción hembra es rate/8.
  const gender =
    raw.gender_rate < 0
      ? null
      : {
          female: Math.round((raw.gender_rate / 8) * 1000) / 10,
          male: Math.round((1 - raw.gender_rate / 8) * 1000) / 10,
        }

  return { category, description, gender }
}
