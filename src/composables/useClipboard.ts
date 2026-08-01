import { ref } from 'vue'

/**
 * Copia texto al portapapeles con una bandera reactiva `copied` que se
 * autolimpia. Encapsula el acceso a la API del navegador y un fallback para
 * contextos sin `navigator.clipboard` (SOLID: la UI no conoce estos detalles).
 */
export function useClipboard(resetDelay = 2000) {
  const copied = ref(false)
  const error = ref(false)

  async function copy(text: string): Promise<void> {
    error.value = false
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopy(text)
      }
      copied.value = true
      window.setTimeout(() => (copied.value = false), resetDelay)
    } catch {
      error.value = true
    }
  }

  return { copied, error, copy }
}

/** Copia vía textarea temporal para navegadores/contextos sin Clipboard API. */
function fallbackCopy(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
