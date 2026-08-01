import { describe, it, expect } from 'vitest'
import { mapPokemonDetail, mapSpecies } from '@/services/pokemonMapper'
import type { PokemonDetailResponse, SpeciesResponse } from '@/types/pokemon'

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
  species: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon-species/6/' },
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

  it('guarda la url de especie', () => {
    const pokemon = mapPokemonDetail(raw)
    expect(pokemon.speciesUrl).toContain('/pokemon-species/6/')
  })
})

describe('mapSpecies', () => {
  const species: SpeciesResponse = {
    genera: [
      { genus: 'Seed Pokémon', language: { name: 'en', url: '' } },
      { genus: 'Pokémon Semilla', language: { name: 'es', url: '' } },
    ],
    flavor_text_entries: [
      { flavor_text: 'A strange seed\nwas planted.', language: { name: 'en', url: '' } },
      { flavor_text: 'Nace con una\fsemilla.', language: { name: 'es', url: '' } },
    ],
    gender_rate: 1, // 1/8 = 12.5% hembra
  }

  it('prefiere el texto en español para categoría y descripción', () => {
    const info = mapSpecies(species)
    expect(info.category).toBe('Semilla')
    expect(info.description).toBe('Nace con una semilla.') // sin saltos de línea/página
  })

  it('calcula la distribución de género desde gender_rate', () => {
    const info = mapSpecies(species)
    expect(info.gender).toEqual({ female: 12.5, male: 87.5 })
  })

  it('devuelve género null cuando es asexuado (gender_rate -1)', () => {
    const info = mapSpecies({ ...species, gender_rate: -1 })
    expect(info.gender).toBeNull()
  })
})
