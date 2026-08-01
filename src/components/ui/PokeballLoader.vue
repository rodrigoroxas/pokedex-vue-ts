<script setup lang="ts">
/**
 * Loader de pokebola dibujada en CSS puro y animada (gira y rebota) para
 * indicar carga, tal como pide la prueba. El tamaño es configurable.
 */
withDefaults(defineProps<{ size?: number; label?: string }>(), {
  size: 96,
  label: 'Cargando...',
})
</script>

<template>
  <div class="loader" role="status" :aria-label="label">
    <div class="pokeball" :style="{ width: `${size}px`, height: `${size}px` }">
      <div class="pokeball__top"></div>
      <div class="pokeball__bottom"></div>
      <div class="pokeball__band"></div>
      <div class="pokeball__button"></div>
    </div>
    <span v-if="label" class="loader__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.pokeball {
  position: relative;
  border-radius: 50%;
  border: 4px solid #212121;
  overflow: hidden;
  animation: shake 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
}

.pokeball__top {
  position: absolute;
  inset: 0 0 50% 0;
  background: #ee1c25;
}

.pokeball__bottom {
  position: absolute;
  inset: 50% 0 0 0;
  background: #fafafa;
}

.pokeball__band {
  position: absolute;
  top: calc(50% - 3px);
  left: 0;
  right: 0;
  height: 6px;
  background: #212121;
}

.pokeball__button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26%;
  height: 26%;
  transform: translate(-50%, -50%);
  background: #fafafa;
  border: 4px solid #212121;
  border-radius: 50%;
  z-index: 1;
}

/* Balanceo tipo "captura" que sugiere actividad. */
@keyframes shake {
  0% {
    transform: rotate(0);
  }
  20% {
    transform: rotate(-16deg);
  }
  40% {
    transform: rotate(16deg);
  }
  60% {
    transform: rotate(-8deg) translateY(-2px);
  }
  80% {
    transform: rotate(8deg);
  }
  100% {
    transform: rotate(0);
  }
}

.loader__label {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}
</style>
