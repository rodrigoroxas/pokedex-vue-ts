import { describe, it, expect } from 'vitest'
import { mapPokemonDetail } from '@/services/pokemonMapper'
import type { PokemonDetailResponse } from '@/types/pokemon'

const raw: PokemonDetailResponse = {
  id: 6,
  name: 'charizard',
  height: 17, // decímetros → 1.7 m
  weight: 905, // hectogramos → 90.5 kg
  types: [
    { slot: 2, type: { name: 'flying', url: '' } },
    { slot: 1, type: { name: 'fire', url: '' } },
  ],
  abilities: [{ is_hidden: false, slot: 1, ability: { name: 'blaze', url: '' } }],
  stats: [{ base_stat: 78, effort: 0, stat: { name: 'hp', url: '' } }],
  sprites: {
    front_default: 'sprite.png',
    other: { 'official-artwork': { front_default: 'artwork.png' } },
  },
}

describe('mapPokemonDetail', () => {
  it('convierte altura y peso a metros y kilogramos', () => {
    const pokemon = mapPokemonDetail(raw)
    expect(pokemon.heightMeters).toBe(1.7)
    expect(pokemon.weightKg).toBe(90.5)
  })

  it('ordena los tipos por slot', () => {
    const pokemon = mapPokemonDetail(raw)
    expect(pokemon.types).toEqual(['fire', 'flying'])
  })

  it('traduce el nombre de la stat y prefiere el artwork oficial', () => {
    const pokemon = mapPokemonDetail(raw)
    expect(pokemon.stats[0]).toEqual({ name: 'PS', value: 78 })
    expect(pokemon.artworkUrl).toBe('artwork.png')
  })

  it('calcula debilidades a partir de los tipos', () => {
    const pokemon = mapPokemonDetail(raw)
    // Fuego/Volador es débil a roca (x4), agua y eléctrico.
    expect(pokemon.weaknesses).toEqual(expect.arrayContaining(['rock', 'water', 'electric']))
  })
})
