import { createRouter, createWebHistory } from 'vue-router'
import OnboardingView from '@/views/OnboardingView.vue'

/**
 * Rutas de la app. `meta.chrome: false` oculta la barra de navegación
 * (p.ej. en el onboarding). Las vistas de contenido se cargan de forma
 * perezosa (code-splitting) salvo el onboarding, que es la pantalla inicial.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnboardingView,
      meta: { chrome: false },
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: () => import('@/views/PokedexView.vue'),
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('@/views/FavoritesView.vue'),
    },
    {
      path: '/regiones',
      name: 'regiones',
      component: () => import('@/views/ComingSoonView.vue'),
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/ComingSoonView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/pokedex' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
