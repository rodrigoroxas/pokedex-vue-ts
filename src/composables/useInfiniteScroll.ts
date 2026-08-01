import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Infinite scroll basado en IntersectionObserver.
 * Observa un elemento "centinela"; cuando entra en viewport, dispara
 * `onLoadMore`. Es la pieza que permite cargar los detalles de forma
 * progresiva y no de golpe (rendimiento con grandes volúmenes de data).
 *
 * Devuelve `sentinel`, una ref que el componente enlaza al nodo a observar.
 */
export function useInfiniteScroll(onLoadMore: () => void, rootMargin = '200px') {
  const sentinel = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  function observe(el: HTMLElement) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin },
    )
    observer.observe(el)
  }

  onMounted(() => {
    if (sentinel.value) observe(sentinel.value)
    // Si el centinela se monta más tarde (v-if), reengancha el observer.
    watch(sentinel, (el) => {
      observer?.disconnect()
      if (el) observe(el)
    })
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { sentinel }
}
