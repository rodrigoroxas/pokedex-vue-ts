<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: 'Buscar por nombre o número...',
})
</script>

<template>
  <div class="search">
    <AppIcon name="search" :size="20" class="search__icon" />
    <input
      v-model="model"
      type="search"
      class="search__input"
      :placeholder="placeholder"
      aria-label="Buscar Pokémon"
      autocomplete="off"
    />
    <button
      v-if="model"
      type="button"
      class="search__clear"
      aria-label="Borrar búsqueda"
      @click="model = ''"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  height: 48px;
  padding: 0 var(--space-md);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}

.search:focus-within {
  border-color: var(--color-primary);
}

.search__icon {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.search__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.search__input:focus {
  outline: none;
}

/* Oculta la "x" nativa del input search para usar la nuestra. */
.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  display: grid;
  place-items: center;
  color: var(--color-text-secondary);
  border-radius: 50%;
  padding: 2px;
}

.search__clear:hover {
  background: var(--color-border);
}
</style>
