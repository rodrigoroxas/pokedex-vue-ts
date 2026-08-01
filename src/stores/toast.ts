import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Toast global: un aviso breve y autodescartable (p.ej. "Copiado al
 * portapapeles"). Se renderiza una sola vez en App y cualquier parte de la
 * app lo dispara con `show()`.
 */
export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  let timer: number | undefined

  function show(text: string, duration = 2200): void {
    message.value = text
    visible.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => (visible.value = false), duration)
  }

  return { message, visible, show }
})
