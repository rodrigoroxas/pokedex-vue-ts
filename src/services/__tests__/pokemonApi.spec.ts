import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPokemonNamesByType } from '@/services/pokemonApi'

afterEach(() => vi.restoreAllMocks())

function mockFetch(data: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, status, json: () => Promise.resolve(data) }),
  )
}

describe('fetchPokemonNamesByType', () => {
  it('extrae los nombres de los Pokémon del tipo desde /type/{tipo}', async () => {
    mockFetch({
      pokemon: [
        { slot: 1, pokemon: { name: 'charmander', url: 'x' } },
        { slot: 1, pokemon: { name: 'charizard', url: 'x' } },
      ],
    })

    const names = await fetchPokemonNamesByType('fire')

    expect(names).toEqual(['charmander', 'charizard'])
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/type/fire'),
      expect.objectContaining({}),
    )
  })

  it('propaga un error cuando la respuesta no es ok', async () => {
    mockFetch({}, false, 404)
    await expect(fetchPokemonNamesByType('unknown')).rejects.toThrow('La petición falló')
  })
})
