<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import onboarding1 from '@/assets/images/onboarding-1.png'
import onboarding2 from '@/assets/images/onboarding-2.png'

const router = useRouter()

const slides = [
  {
    image: onboarding1,
    title: 'Todos los Pokémon en un solo lugar',
    description:
      'Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo',
  },
  {
    image: onboarding2,
    title: 'Mantén tu Pokédex actualizada',
    description:
      'Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación',
  },
]

const step = ref(0)
const isLast = computed(() => step.value === slides.length - 1)
const current = computed(() => slides[step.value] ?? slides[0]!)

function next() {
  if (isLast.value) router.push('/pokedex')
  else step.value++
}

function skip() {
  router.push('/pokedex')
}
</script>

<template>
  <div class="onboarding">
    <header class="onboarding__topbar">
      <div class="onboarding__brand">
        <span class="onboarding__logo" aria-hidden="true">
          <span class="onboarding__logo-top"></span>
          <span class="onboarding__logo-dot"></span>
        </span>
        <span class="onboarding__wordmark">Pokédex</span>
      </div>
      <button class="onboarding__skip" type="button" @click="skip">Saltar</button>
    </header>

    <div class="onboarding__content">
      <div class="onboarding__art">
        <img :src="current.image" :alt="current.title" />
      </div>

      <div class="onboarding__panel">
        <div class="onboarding__text">
          <h1 class="onboarding__title">{{ current.title }}</h1>
          <p class="onboarding__desc">{{ current.description }}</p>
        </div>

        <div class="onboarding__dots" role="tablist" aria-label="Progreso">
          <span
            v-for="(_, index) in slides"
            :key="index"
            class="dot"
            :class="{ 'dot--active': index === step }"
          ></span>
        </div>

        <BaseButton block class="onboarding__cta" @click="next">
          {{ isLast ? 'Comenzar' : 'Continuar' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--color-surface);
}

.onboarding__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
}

.onboarding__brand {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.onboarding__logo {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #212121;
  background: #fafafa;
  overflow: hidden;
}
.onboarding__logo-top {
  position: absolute;
  inset: 0 0 50% 0;
  background: #ee1c25;
  border-bottom: 2px solid #212121;
}
.onboarding__logo-dot {
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

.onboarding__wordmark {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.onboarding__skip {
  padding: var(--space-xs) var(--space-md);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-pill);
}

.onboarding__skip:hover {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  color: var(--color-text-primary);
}

.onboarding__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-md) calc(var(--space-lg) + env(safe-area-inset-bottom));
}

.onboarding__art {
  flex: 1;
  display: grid;
  place-items: center;
  width: 100%;
}

.onboarding__art img {
  max-height: 320px;
  object-fit: contain;
  image-rendering: pixelated;
}

.onboarding__panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.onboarding__text {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 0 var(--space-xs);
}

.onboarding__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.onboarding__desc {
  color: var(--color-text-secondary);
}

.onboarding__dots {
  display: flex;
  gap: var(--space-xs);
  margin: var(--space-lg) 0;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: var(--radius-pill);
  background: var(--color-border);
  transition:
    width 0.25s ease,
    background-color 0.25s ease;
}

.dot--active {
  width: 28px;
  background: var(--color-primary);
}

.onboarding__cta {
  width: 100%;
}

/* ---- Layout web/desktop: dos columnas landscape ---- */
@media (min-width: 768px) {
  .onboarding__topbar {
    padding: var(--space-lg) clamp(var(--space-xl), 5vw, 64px);
  }

  .onboarding__content {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: clamp(var(--space-xl), 8vw, 120px);
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 0;
  }

  .onboarding__art {
    flex: 1;
  }

  .onboarding__art img {
    max-height: 460px;
    width: 100%;
  }

  .onboarding__panel {
    flex: 1;
    align-items: flex-start;
    max-width: 460px;
  }

  .onboarding__text {
    text-align: left;
    gap: var(--space-md);
  }

  .onboarding__title {
    font-size: 2.75rem;
  }

  .onboarding__desc {
    font-size: var(--font-size-lg);
  }

  .onboarding__cta {
    width: auto;
    min-width: 220px;
  }
}
</style>
