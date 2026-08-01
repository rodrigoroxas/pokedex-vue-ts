import type { PokemonTypeName } from '@/types/pokemon'

/**
 * Predicado de búsqueda de la Pokédex: permite filtrar por **nombre** o por
 * **número de entrada** (id). El número se obtiene del índice sin peticiones
 * extra, respetando la restricción de dos endpoints.
 *
 * - Texto → coincidencia por substring en el nombre.
 * - Dígitos → coincidencia por id, tanto exacto/parcial como con relleno de
 *   ceros (p.ej. "1", "01" y "001" encuentran al Pokémon Nº001).
 */
export function pokemonMatchesQuery(name: string, id: number, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (name.toLowerCase().includes(q)) return true

  if (/^\d+$/.test(q)) {
    const idStr = String(id)
    return idStr.includes(q) || idStr.padStart(3, '0').includes(q)
  }

  return false
}

/**
 * Filtra una lista de Pokémon (que ya tienen sus datos completos, p.ej. los
 * favoritos) por texto (nombre/número) y por tipo. El filtro por tipo es
 * unión: incluye a los que tengan al menos uno de los tipos seleccionados.
 * No requiere peticiones porque opera sobre datos ya disponibles en memoria.
 */
export function filterPokemonList<
  T extends { name: string; id: number; types: PokemonTypeName[] },
>(list: T[], query: string, types: PokemonTypeName[]): T[] {
  const typeSet = new Set(types)
  return list.filter((pokemon) => {
    if (typeSet.size > 0 && !pokemon.types.some((type) => typeSet.has(type))) return false
    return pokemonMatchesQuery(pokemon.name, pokemon.id, query)
  })
}
