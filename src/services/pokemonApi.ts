import type {
  NamedApiResource,
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
  TypeResponse,
} from '@/types/pokemon'
import { httpGet } from './http'
import { mapPokemonDetail } from './pokemonMapper'

/**
 * Servicio de acceso a la PokéAPI. Expone únicamente los dos llamados que
 * la prueba autoriza:
 *   1. Lista de Pokémon  → GET /pokemon
 *   2. Detalle por nombre → GET /pokemon/{name}
 */

/**
 * Trae el índice completo de nombres en una sola petición.
 *
 * Decisión de "gran cantidad de data": la lista base (~1300 registros) es
 * ligera (solo name + url), así que se pide una vez y se pagina/filtra en
 * cliente. El detalle —que sí es pesado— se carga bajo demanda (lazy) a
 * medida que las cards entran en viewport, evitando ~1300 requests iniciales.
 */
export async function fetchPokemonIndex(signal?: AbortSignal): Promise<NamedApiResource[]> {
  const data = await httpGet<PokemonListResponse>('/pokemon?limit=100000&offset=0', signal)
  return data.results
}

/** Trae y normaliza el detalle de un Pokémon por nombre. */
export async function fetchPokemonByName(name: string, signal?: AbortSignal): Promise<Pokemon> {
  const raw = await httpGet<PokemonDetailResponse>(`/pokemon/${name}`, signal)
  return mapPokemonDetail(raw)
}

/**
 * Trae los nombres de todos los Pokémon de un tipo: GET /type/{tipo}.
 *
 * Nota de alcance: el diseño incluye un filtro por tipo. Como el índice base
 * no trae el tipo de cada Pokémon, un filtro completo requiere este endpoint
 * adicional (una única llamada por tipo, luego cacheada). Se añade por
 * fidelidad al diseño, sin afectar el flujo principal de dos llamados.
 */
export async function fetchPokemonNamesByType(type: string, signal?: AbortSignal): Promise<string[]> {
  const data = await httpGet<TypeResponse>(`/type/${type}`, signal)
  return data.pokemon.map((slot) => slot.pokemon.name)
}
