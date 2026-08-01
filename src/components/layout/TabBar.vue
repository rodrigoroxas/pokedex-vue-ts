<script setup lang="ts">
import AppIcon, { type IconName } from '@/components/ui/AppIcon.vue'
import { useFavoritesStore } from '@/stores/favorites'

/** Ítems de la barra. Regiones y Perfil apuntan a la pantalla "muy pronto". */
const items: { to: string; label: string; icon: IconName }[] = [
  { to: '/pokedex', label: 'Pokedex', icon: 'home' },
  { to: '/regiones', label: 'Regiones', icon: 'globe' },
  { to: '/favoritos', label: 'favoritos', icon: 'heart' },
  { to: '/perfil', label: 'Perfil', icon: 'user' },
]

const favorites = useFavoritesStore()
</script>

<template>
  <nav class="tabbar" aria-label="Navegación principal">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="tabbar__item"
      active-class="tabbar__item--active"
    >
      <span class="tabbar__icon">
        <AppIcon :name="item.icon" :size="24" />
        <span v-if="item.to === '/favoritos' && favorites.count" class="tabbar__badge">
          {{ favorites.count }}
        </span>
      </span>
      <span class="tabbar__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  display: flex;
  height: var(--tabbar-height);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-top: 4px;
  color: var(--color-text-secondary);
  transition: color 0.15s ease;
}

.tabbar__item--active {
  color: var(--color-primary-dark);
}

.tabbar__icon {
  position: relative;
  display: grid;
  place-items: center;
}

.tabbar__badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-pill);
}

.tabbar__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
