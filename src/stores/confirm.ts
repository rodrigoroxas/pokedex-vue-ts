import { ref } from 'vue'
import { defineStore } from 'pinia'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
}

/**
 * Confirmación global: un único diálogo (renderizado en App) que cualquier
 * parte de la app puede abrir con `ask()`, que resuelve una Promise<boolean>
 * cuando el usuario confirma o cancela. Evita duplicar diálogos por vista.
 */
export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmLabel = ref('Eliminar')

  let resolver: ((value: boolean) => void) | null = null

  function ask(options: ConfirmOptions): Promise<boolean> {
    title.value = options.title
    message.value = options.message ?? ''
    confirmLabel.value = options.confirmLabel ?? 'Eliminar'
    isOpen.value = true
    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function respond(confirmed: boolean): void {
    isOpen.value = false
    resolver?.(confirmed)
    resolver = null
  }

  return { isOpen, title, message, confirmLabel, ask, respond }
})
