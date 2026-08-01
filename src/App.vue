<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/layout/TabBar.vue'

const route = useRoute()

/** La barra inferior se muestra salvo en rutas que la desactivan (onboarding). */
const showChrome = computed(() => route.meta.chrome !== false)
</script>

<template>
  <div class="app-shell">
    <main class="app-viewport">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TabBar v-if="showChrome" class="app-tabbar" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--app-max-width);
  min-height: 100dvh;
  margin: 0 auto;
  background: var(--color-surface);
  position: relative;
}

.app-viewport {
  flex: 1;
  overflow-x: hidden;
}

.app-tabbar {
  position: sticky;
  bottom: 0;
  z-index: var(--z-tabbar);
}

/* Transición entre vistas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- Adaptación a desktop/web ---- */
@media (min-width: 720px) {
  .app-shell {
    max-width: 960px;
    min-height: 100dvh;
    box-shadow: 0 0 60px rgba(18, 18, 18, 0.08);
  }
}
</style>
