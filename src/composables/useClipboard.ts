import { ref } from 'vue'

/**
 * Copia texto al portapapeles con una bandera reactiva `copied` que se
 * autolimpia. Encapsula el acceso a la API del navegador (SOLID: la UI no
 * conoce estos detalles) y expone `error` para reflejar fallos en la vista.
 */
export function useClipboard(resetDelay = 2000) {
  const copied = ref(false)
  const error = ref(false)

  async function copy(text: string): Promise<void> {
    error.value = false
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API no disponible')
      await navigator.clipboard.writeText(text)
      copied.value = true
      window.setTimeout(() => (copied.value = false), resetDelay)
    } catch {
      error.value = true
    }
  }

  return { copied, error, copy }
}
