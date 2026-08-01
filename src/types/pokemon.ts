/**
 * Contratos de tipos de la PokéAPI (https://pokeapi.co/).
 * Solo se modela lo que la app realmente consume, no la respuesta completa,
 * para mantener el dominio acotado y legible (KISS).
 */

/** Los 18 tipos elementales de Pokémon. */
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

/** Ítem de la lista paginada: GET /pokemon */
export interface NamedApiResource {
  name: string
  url: string
}

/** Sub-estructura de GET /type/{tipo}: relación tipo → Pokémon. */
export interface TypePokemonSlot {
  slot: number
  pokemon: NamedApiResource
}

/** Respuesta de GET /type/{tipo} (solo se consume la lista de Pokémon). */
export interface TypeResponse {
  pokemon: TypePokemonSlot[]
}

/** Respuesta de GET /pokemon?limit&offset */
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

/** ----- Sub-estructuras de GET /pokemon/{name} ----- */
export interface PokemonTypeSlot {
  slot: number
  type: NamedApiResource
}

export interface PokemonAbilitySlot {
  is_hidden: boolean
  slot: number
  ability: NamedApiResource
}

export interface PokemonStatSlot {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export interface PokemonSprites {
  front_default: string | null
  other?: {
    'official-artwork'?: { front_default: string | null }
    home?: { front_default: string | null }
    dream_world?: { front_default: string | null }
  }
}

/** Respuesta cruda de GET /pokemon/{name} */
export interface PokemonDetailResponse {
  id: number
  name: string
  height: number // decímetros
  weight: number // hectogramos
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  stats: PokemonStatSlot[]
  sprites: PokemonSprites
}

/**
 * Modelo de dominio normalizado que usa la UI.
 * Aísla los componentes de la forma cruda de la API (SOLID: inversión de
 * dependencias sobre el detalle del proveedor de datos).
 */
export interface Pokemon {
  id: number
  name: string
  types: PokemonTypeName[]
  /** Altura en metros (ya convertida desde decímetros). */
  heightMeters: number
  /** Peso en kilogramos (ya convertido desde hectogramos). */
  weightKg: number
  abilities: string[]
  stats: { name: string; value: number }[]
  /** Sprite pixelado (card / detalle). */
  spriteUrl: string
  /** Artwork oficial en alta, si existe. */
  artworkUrl: string
  /** Tipos a los que este Pokémon es débil (calculado con tabla estática). */
  weaknesses: PokemonTypeName[]
}

/** Estado de una petición asíncrona (evita banderas booleanas sueltas). */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
