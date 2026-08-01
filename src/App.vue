<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/layout/TopNav.vue'
import TabBar from '@/components/layout/TabBar.vue'
import SplashScreen from '@/components/layout/SplashScreen.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import AppToast from '@/components/ui/AppToast.vue'
import { useConfirmStore } from '@/stores/confirm'

const route = useRoute()
const confirm = useConfirmStore()

/** Las barras de navegación se ocultan en rutas sin "chrome" (onboarding). */
const showChrome = computed(() => route.meta.chrome !== false)

/** Pantalla de carga inicial (splash) con la pokebola animada al entrar. */
const booting = ref(true)
onMounted(() => {
  window.setTimeout(() => (booting.value = false), 1800)
})
</script>

<template>
  <div class="layout" :class="{ 'layout--bare': !showChrome }">
    <!-- Navegación web (desktop) -->
    <TopNav v-if="showChrome" class="layout__topnav" />

    <main class="layout__main">
      <div class="layout__container">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- Navegación móvil (bottom tab bar) -->
    <TabBar v-if="showChrome" class="layout__tabbar" />

    <!-- Diálogo de confirmación global -->
    <Transition name="fade">
      <ConfirmDialog
        v-if="confirm.isOpen"
        :title="confirm.title"
        :message="confirm.message"
        :confirm-label="confirm.confirmLabel"
        @confirm="confirm.respond(true)"
        @cancel="confirm.respond(false)"
      />
    </Transition>

    <!-- Pantalla de carga inicial (splash) -->
    <Transition name="fade">
      <SplashScreen v-if="booting" />
    </Transition>

    <!-- Aviso breve (toast) global -->
    <AppToast />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #eef1f5;
}

.layout__main {
  flex: 1;
  /* Espacio para el tab bar fijo en móvil. */
  padding-bottom: var(--tabbar-height);
}

.layout__container {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

/* Rutas sin navegación (onboarding): contenido a pantalla completa. */
.layout--bare .layout__main {
  padding-bottom: 0;
}

.layout--bare .layout__container {
  max-width: none;
}

/* ---- Navegación: móvil vs. web ---- */
.layout__topnav {
  display: none;
}

.layout__tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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

/* ---- Layout web/desktop ---- */
@media (min-width: 768px) {
  .layout__topnav {
    display: block;
  }
  .layout__tabbar {
    display: none;
  }
  .layout__main {
    padding-bottom: var(--space-xl);
  }
}
</style>
