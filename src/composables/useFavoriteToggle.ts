import type { Pokemon } from '@/types/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { useConfirmStore } from '@/stores/confirm'
import { capitalize } from '@/utils/format'

/**
 * Alternar favorito con confirmación al quitar. Añadir es instantáneo (no es
 * destructivo); quitar pide confirmación, igual que el botón de eliminar.
 * Centraliza esta regla para reutilizarla en cards y detalle (DRY).
 */
export function useFavoriteToggle() {
  const favorites = useFavoritesStore()
  const confirm = useConfirmStore()

  async function toggleFavorite(pokemon: Pokemon): Promise<void> {
    if (!favorites.isFavorite(pokemon.id)) {
      favorites.add(pokemon)
      return
    }
    const confirmed = await confirm.ask({
      title: `¿Eliminar a ${capitalize(pokemon.name)}?`,
      message: 'Se quitará de tu lista de favoritos.',
    })
    if (confirmed) favorites.remove(pokemon.id)
  }

  return { toggleFavorite }
}
