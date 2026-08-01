<script setup lang="ts">
import AppIcon, { type IconName } from '@/components/ui/AppIcon.vue'
import { useFavoritesStore } from '@/stores/favorites'

/** Navegación web (desktop). En móvil se usa el TabBar inferior en su lugar. */
const links: { to: string; label: string; icon: IconName }[] = [
  { to: '/pokedex', label: 'Pokédex', icon: 'home' },
  { to: '/regiones', label: 'Regiones', icon: 'globe' },
  { to: '/favoritos', label: 'Favoritos', icon: 'heart' },
  { to: '/perfil', label: 'Perfil', icon: 'user' },
]

const favorites = useFavoritesStore()
</script>

<template>
  <header class="topnav">
    <div class="topnav__inner">
      <RouterLink to="/pokedex" class="topnav__brand" aria-label="Inicio">
        <span class="topnav__logo" aria-hidden="true">
          <span class="topnav__logo-top"></span>
          <span class="topnav__logo-dot"></span>
        </span>
        <span class="topnav__wordmark">Pokédex</span>
      </RouterLink>

      <nav class="topnav__links" aria-label="Navegación principal">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="topnav__link"
          active-class="topnav__link--active"
        >
          <AppIcon :name="link.icon" :size="18" />
          <span>{{ link.label }}</span>
          <span v-if="link.to === '/favoritos' && favorites.count" class="topnav__count">
            {{ favorites.count }}
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: var(--z-topnav);
  height: var(--topnav-height);
  background: var(--color-surface-raised);
  border-bottom: 1px solid var(--color-border);
}

.topnav__inner {
  height: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}

.topnav__brand {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* Logo pokebola minimal dibujado en CSS. */
.topnav__logo {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #212121;
  background: #fafafa;
  overflow: hidden;
}
.topnav__logo-top {
  position: absolute;
  inset: 0 0 50% 0;
  background: #ee1c25;
  border-bottom: 2px solid #212121;
}
.topnav__logo-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  height: 9px;
  transform: translate(-50%, -50%);
  background: #fafafa;
  border: 2px solid #212121;
  border-radius: 50%;
}

.topnav__wordmark {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
}

.topnav__links {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.topnav__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.topnav__link:hover {
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.topnav__link--active {
  color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.topnav__count {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--color-danger);
  color: #fff;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-pill);
}
</style>
