import type { PokemonTypeName } from '@/types/pokemon'

/** Etiquetas en español para la UI (la API entrega los nombres en inglés). */
export const TYPE_LABELS_ES: Record<PokemonTypeName, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

/**
 * Devuelve el color CSS asociado a un tipo (referencia a los design tokens).
 * Centralizar aquí evita repartir literales de color por los componentes (DRY).
 */
export function getTypeColor(type: PokemonTypeName): string {
  return `var(--type-${type})`
}

/** Nombre legible en español, con fallback al nombre crudo por robustez. */
export function getTypeLabel(type: string): string {
  return TYPE_LABELS_ES[type as PokemonTypeName] ?? type
}

/**
 * Relaciones defensivas por tipo (chart estándar Gen VI+).
 * Para cada tipo defensor: a qué tipos es débil (x2), cuáles resiste (x0.5)
 * y ante cuáles es inmune (x0). Lo no listado es daño neutro (x1).
 *
 * Se modela como dato estático para calcular las debilidades en cliente,
 * sin golpear el endpoint /type de la API (respeta la regla de 2 llamados).
 */
interface TypeDefense {
  weakTo: PokemonTypeName[]
  resistTo: PokemonTypeName[]
  immuneTo: PokemonTypeName[]
}

const TYPE_DEFENSE_CHART: Record<PokemonTypeName, TypeDefense> = {
  normal: { weakTo: ['fighting'], resistTo: [], immuneTo: ['ghost'] },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo: [],
  },
  water: {
    weakTo: ['grass', 'electric'],
    resistTo: ['fire', 'water', 'ice', 'steel'],
    immuneTo: [],
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistTo: ['water', 'grass', 'electric', 'ground'],
    immuneTo: [],
  },
  electric: { weakTo: ['ground'], resistTo: ['electric', 'flying', 'steel'], immuneTo: [] },
  ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistTo: ['ice'], immuneTo: [] },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistTo: ['rock', 'bug', 'dark'],
    immuneTo: [],
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo: [],
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistTo: ['poison', 'rock'],
    immuneTo: ['electric'],
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground'],
  },
  psychic: { weakTo: ['bug', 'ghost', 'dark'], resistTo: ['fighting', 'psychic'], immuneTo: [] },
  bug: { weakTo: ['fire', 'flying', 'rock'], resistTo: ['grass', 'fighting', 'ground'], immuneTo: [] },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistTo: ['normal', 'fire', 'poison', 'flying'],
    immuneTo: [],
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistTo: ['fire', 'water', 'grass', 'electric'],
    immuneTo: [],
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistTo: [
      'normal',
      'grass',
      'ice',
      'flying',
      'psychic',
      'bug',
      'rock',
      'dragon',
      'steel',
      'fairy',
    ],
    immuneTo: ['poison'],
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
  },
}

const ALL_TYPES = Object.keys(TYPE_DEFENSE_CHART) as PokemonTypeName[]

/**
 * Calcula las debilidades de un Pokémon combinando sus (uno o dos) tipos.
 * El multiplicador final ante un tipo atacante es el producto de los
 * multiplicadores de cada tipo defensor; es debilidad si el producto > 1.
 */
export function computeWeaknesses(types: PokemonTypeName[]): PokemonTypeName[] {
  return ALL_TYPES.filter((attacking) => {
    const multiplier = types.reduce((acc, defending) => {
      const rel = TYPE_DEFENSE_CHART[defending]
      if (rel.immuneTo.includes(attacking)) return 0
      if (rel.weakTo.includes(attacking)) return acc * 2
      if (rel.resistTo.includes(attacking)) return acc * 0.5
      return acc
    }, 1)
    return multiplier > 1
  })
}
