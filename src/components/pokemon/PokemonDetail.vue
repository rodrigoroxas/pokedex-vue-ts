<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Pokemon, SpeciesInfo } from '@/types/pokemon'
import { usePokemonStore } from '@/stores/pokemon'
import { useFavoritesStore } from '@/stores/favorites'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import { useClipboard } from '@/composables/useClipboard'
import { getTypeColor, getTypeIconUrl } from '@/utils/pokemonType'
import { capitalize, formatPokedexNumber, formatShareText } from '@/utils/format'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TypeBadge from '@/components/ui/TypeBadge.vue'
import FavoriteButton from '@/components/pokemon/FavoriteButton.vue'
import StatBox from '@/components/pokemon/StatBox.vue'
import StatBars from '@/components/pokemon/StatBars.vue'
import GenderBar from '@/components/pokemon/GenderBar.vue'

const props = defineProps<{ pokemon: Pokemon }>()
const emit = defineEmits<{ close: [] }>()

const store = usePokemonStore()
const favorites = useFavoritesStore()
const { toggleFavorite } = useFavoriteToggle()
const { copied, copy } = useClipboard()

// Datos de especie (categoría/descripción/género): se cargan al abrir el detalle.
const species = ref<SpeciesInfo | null>(props.pokemon.species ?? null)

// Nombre de la habilidad: inicia con el nombre en inglés capitalizado y se
// reemplaza por el traducido al español una vez cargado desde /ability.
const primaryAbilitySlug = computed(() => props.pokemon.abilities[0] ?? '')
const abilityLabel = ref(primaryAbilitySlug.value ? capitalize(primaryAbilitySlug.value) : '—')

const typeColor = computed(() => getTypeColor(props.pokemon.types[0] ?? 'normal'))
const typeIcon = computed(() => getTypeIconUrl(props.pokemon.types[0] ?? 'normal'))
const image = computed(() => props.pokemon.artworkUrl || props.pokemon.spriteUrl)
const category = computed(() => species.value?.category || '—')
const description = computed(() => species.value?.description ?? '')
const gender = computed(() => species.value?.gender ?? null)

onMounted(() => {
  // Especie (categoría/descripción/género) y habilidad en español, en paralelo.
  if (!species.value) {
    // Favoritos guardados antes de tener speciesUrl: se deriva del id.
    const speciesRef = props.pokemon.speciesUrl || `/pokemon-species/${props.pokemon.id}`
    store.loadSpecies(speciesRef).then(
      (info) => (species.value = info),
      () => {},
    )
  }
  if (primaryAbilitySlug.value) {
    store.loadAbilityName(primaryAbilitySlug.value).then(
      (name) => (abilityLabel.value = name),
      () => {},
    )
  }
})

/** Copia nombre + atributos separados por coma (requisito de la prueba). */
function share() {
  copy(
    formatShareText(props.pokemon, {
      category: species.value?.category,
      ability: abilityLabel.value !== '—' ? abilityLabel.value : undefined,
    }),
  )
}
</script>

<template>
  <div class="sheet-overlay" @click.self="emit('close')">
    <section
      class="sheet"
      :style="{ '--type-color': typeColor }"
      role="dialog"
      aria-modal="true"
      :aria-label="`Detalle de ${capitalize(pokemon.name)}`"
    >
      <!-- Cabecera con color del tipo, artwork y acciones -->
      <header class="sheet__header">
        <div class="sheet__actions">
          <button class="icon-btn" aria-label="Cerrar" @click="emit('close')">
            <AppIcon name="arrow-left" />
          </button>
          <div class="sheet__actions-right">
            <button class="icon-btn" aria-label="Compartir" @click="share">
              <AppIcon name="share" :size="22" />
            </button>
            <FavoriteButton
              variant="plain"
              :active="favorites.isFavorite(pokemon.id)"
              :size="26"
              @toggle="toggleFavorite(pokemon)"
            />
          </div>
        </div>
        <img class="sheet__watermark" :src="typeIcon" alt="" aria-hidden="true" />
        <img class="sheet__image" :src="image" :alt="capitalize(pokemon.name)" />
      </header>

      <!-- Cuerpo con la información -->
      <div class="sheet__body">
        <div class="sheet__title">
          <h2 class="sheet__name">{{ capitalize(pokemon.name) }}</h2>
          <span class="sheet__number">{{ formatPokedexNumber(pokemon.id) }}</span>
        </div>

        <div class="sheet__types">
          <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" />
        </div>

        <p v-if="description" class="sheet__description">{{ description }}</p>

        <hr class="sheet__divider" />

        <div class="sheet__grid">
          <StatBox icon="weight" label="Peso" :value="`${pokemon.weightKg} kg`" />
          <StatBox icon="ruler" label="Altura" :value="`${pokemon.heightMeters} m`" />
          <StatBox icon="category" label="Categoría" :value="category" />
          <StatBox icon="pokeball" label="Habilidad" :value="abilityLabel" />
        </div>

        <GenderBar v-if="gender" :gender="gender" />

        <div v-if="pokemon.weaknesses.length" class="sheet__section">
          <h3 class="sheet__section-title">Debilidades</h3>
          <div class="sheet__types">
            <TypeBadge
              v-for="weakness in pokemon.weaknesses"
              :key="weakness"
              :type="weakness"
              size="sm"
            />
          </div>
        </div>

        <div class="sheet__section">
          <h3 class="sheet__section-title">Estadísticas base</h3>
          <StatBars :stats="pokemon.stats" :color="typeColor" />
        </div>

        <BaseButton block class="sheet__share" @click="share">
          <AppIcon name="share" :size="20" />
          {{ copied ? '¡Copiado al portapapeles!' : 'Compartir' }}
        </BaseButton>
      </div>
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
  position: relative;
  width: 100%;
  max-width: var(--app-max-width);
  max-height: 92vh;
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow-y: auto;
}

.sheet__header {
  position: relative;
  height: 260px;
  display: grid;
  place-items: center;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--type-color) 65%, white),
    var(--type-color)
  );
  border-radius: var(--radius-lg) var(--radius-lg) 40% 40% / var(--radius-lg) var(--radius-lg) 12% 12%;
}

.sheet__actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  z-index: 2;
}

.sheet__actions-right {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #fff;
}

.sheet__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -52%);
  object-fit: contain;
  opacity: 0.22;
}

.sheet__image {
  position: relative;
  width: 180px;
  height: 180px;
  object-fit: contain;
  z-index: 1;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.25));
}

.sheet__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-md) calc(var(--space-lg) + env(safe-area-inset-bottom));
}

.sheet__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sheet__name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.sheet__number {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.sheet__types {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.sheet__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.sheet__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.sheet__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.sheet__description {
  color: var(--color-text-secondary);
}

.sheet__divider {
  border: none;
  border-top: 1px solid var(--color-border);
}

.sheet__share {
  margin-top: var(--space-xs);
}

/* En pantallas anchas el detalle es un modal ancho de dos columnas:
   la cabecera con el artwork a la izquierda y la información a la derecha. */
@media (min-width: 768px) {
  .sheet-overlay {
    align-items: center;
    padding: var(--space-lg);
  }

  .sheet {
    max-width: 860px;
    max-height: 86vh;
    border-radius: var(--radius-lg);
    display: grid;
    grid-template-columns: 44% 56%;
    overflow: hidden;
  }

  .sheet__header {
    height: 100%;
    min-height: 0;
    border-radius: 0;
  }

  .sheet__watermark {
    width: 280px;
    height: 280px;
  }

  .sheet__image {
    width: 240px;
    height: 240px;
  }

  .sheet__body {
    min-height: 0;
    overflow-y: auto;
  }
}
</style>
