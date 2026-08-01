<script setup lang="ts">
import { ref } from 'vue'
import type { PokemonTypeName } from '@/types/pokemon'
import { TYPE_LABELS_ES } from '@/utils/pokemonType'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ applied: PokemonTypeName[] }>()
const emit = defineEmits<{ apply: [types: PokemonTypeName[]]; close: [] }>()

/** Lista de tipos ordenada por su etiqueta en español (como el diseño). */
const TYPE_OPTIONS = (Object.keys(TYPE_LABELS_ES) as PokemonTypeName[])
  .map((type) => ({ type, label: TYPE_LABELS_ES[type] }))
  .sort((a, b) => a.label.localeCompare(b.label))

// Selección local: se confirma solo al pulsar "Aplicar".
const selected = ref(new Set<PokemonTypeName>(props.applied))
const open = ref(true)

function toggle(type: PokemonTypeName) {
  if (selected.value.has(type)) selected.value.delete(type)
  else selected.value.add(type)
  // Reasigna para forzar reactividad del Set.
  selected.value = new Set(selected.value)
}

function apply() {
  emit('apply', [...selected.value])
}
</script>

<template>
  <div class="sheet-overlay" @click.self="emit('close')">
    <section class="sheet" role="dialog" aria-modal="true" aria-label="Filtrar por tipo">
      <header class="sheet__head">
        <button class="sheet__close" aria-label="Cerrar" @click="emit('close')">
          <AppIcon name="close" :size="22" />
        </button>
        <h2 class="sheet__title">Filtra por tus preferencias</h2>
      </header>

      <div class="sheet__body">
        <button class="section-toggle" :aria-expanded="open" @click="open = !open">
          <span>Tipo</span>
          <AppIcon
            name="chevron-down"
            :size="20"
            class="section-toggle__chevron"
            :class="{ 'section-toggle__chevron--open': open }"
          />
        </button>

        <ul v-show="open" class="options">
          <li v-for="option in TYPE_OPTIONS" :key="option.type">
            <label class="option">
              <span class="option__label">{{ option.label }}</span>
              <input
                type="checkbox"
                class="option__check"
                :checked="selected.has(option.type)"
                @change="toggle(option.type)"
              />
            </label>
          </li>
        </ul>
      </div>

      <footer class="sheet__foot">
        <BaseButton block @click="apply">Aplicar</BaseButton>
        <BaseButton block variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-sheet);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(18, 18, 18, 0.5);
}

.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--app-max-width);
  max-height: 88vh;
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.sheet__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-md) var(--space-xs);
}

.sheet__close {
  color: var(--color-text-primary);
}

.sheet__title {
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.sheet__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.section-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-sm) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  border-bottom: 1px solid var(--color-border);
}

.section-toggle__chevron {
  transition: transform 0.2s ease;
}
.section-toggle__chevron--open {
  transform: rotate(180deg);
}

.options {
  display: flex;
  flex-direction: column;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.option__label {
  color: var(--color-text-secondary);
}

.option__check {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.sheet__foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-md) calc(var(--space-md) + env(safe-area-inset-bottom));
  border-top: 1px solid var(--color-border);
}

/* En desktop, modal centrado. */
@media (min-width: 768px) {
  .sheet-overlay {
    align-items: center;
    padding: var(--space-lg);
  }
  .sheet {
    border-radius: var(--radius-lg);
    max-height: 80vh;
  }
}
</style>
