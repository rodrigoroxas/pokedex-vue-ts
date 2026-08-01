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
    <button class="onboarding__skip" type="button" @click="skip">Saltar</button>

    <div class="onboarding__art">
      <img :src="current.image" :alt="current.title" />
    </div>

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

    <BaseButton block @click="next">
      {{ isLast ? 'Comenzar' : 'Continuar' }}
    </BaseButton>
  </div>
</template>

<style scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: var(--space-lg) var(--space-md) calc(var(--space-lg) + env(safe-area-inset-bottom));
  background: var(--color-surface);
}

.onboarding__skip {
  align-self: flex-end;
  padding: var(--space-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
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
</style>
