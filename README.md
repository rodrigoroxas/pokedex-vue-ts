# Pokédex — Prueba técnica Front End (Global66)

Aplicación de **lista de Pokémon y favoritos** construida con **Vue 3 + TypeScript**, consumiendo la [PokéAPI](https://pokeapi.co/). El diseño mobile de Figma se adaptó a un layout **responsive desktop/web**.

> Onboarding → Pokédex (búsqueda + scroll infinito) → Detalle (favorito ❤️ + compartir 📋) → Favoritos persistidos.

---

## 🚀 Puesta en marcha

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)

npm run build       # build de producción
npm run type-check  # chequeo de tipos (vue-tsc)
npm run lint        # oxlint + eslint
npx vitest run      # tests unitarios
```

Requiere **Node 22+**.

---

## 🧰 Stack y por qué

| Tecnología | Motivo |
|---|---|
| **Vue 3** (`<script setup>`, Composition API) | Framework requerido. La Composition API permite extraer lógica a *composables* reutilizables y testeables. |
| **TypeScript** | Contratos explícitos con la API y refactors seguros. Modela el dominio y evita errores en tiempo de compilación. |
| **Vite** | Dev server y build rápidos; base del scaffold oficial de Vue. |
| **Pinia** | Store oficial de Vue. Fuente de verdad de los favoritos (ver más abajo). |
| **Vue Router** | Navegación entre vistas con *code-splitting* (lazy loading por ruta). |
| **Vitest + Vue Test Utils** | Tests unitarios de lógica, store y componentes. |
| **oxlint + ESLint** | Calidad y consistencia de código. |
| **CSS con custom properties** | Design tokens (colores, tipografía, spacing) en un único lugar. Sin dependencias de UI: control total sobre la fidelidad al diseño. |

---

## 🏗️ Arquitectura

Separación por capas y responsabilidades (SOLID) para que la UI no conozca los detalles de la API ni de la persistencia:

```
src/
├── types/         Contratos TS de la PokéAPI + modelo de dominio (Pokemon)
├── services/      http (fetch tipado) · pokemonApi (2 endpoints) · pokemonMapper (API → dominio)
├── utils/         format (nº, compartir) · pokemonType (colores, etiquetas, tabla de debilidades) · storage
├── stores/        favorites (persistido) · pokemon (índice + caché de detalles)
├── composables/   usePokedexList · useInfiniteScroll · useClipboard
├── components/
│   ├── ui/        PokeballLoader · TypeBadge · BaseButton · AppIcon · EmptyState
│   ├── layout/    TabBar · AppSearchBar
│   └── pokemon/   PokemonCard · PokemonDetail · FavoriteButton · StatBox · StatBars
└── views/         Onboarding · Pokedex · Favorites · ComingSoon
```

**Flujo de datos:** `services` traen y normalizan → `stores` cachean → `composables` orquestan → `components` renderizan.

---

## 💡 Decisiones técnicas clave

### 1. Rendimiento con gran cantidad de data
La PokéAPI tiene **~1300 Pokémon**. Traer el detalle de todos de golpe serían ~1300 peticiones y varios MB.

Estrategia adoptada:
- **Un solo llamado** trae el índice completo de nombres (liviano: `name` + `url`).
- La **búsqueda y la paginación se hacen en cliente** sobre ese índice.
- El **detalle se carga de forma perezosa** (lazy): cada card pide su información solo cuando entra en pantalla, mediante **`IntersectionObserver`** (scroll infinito).
- Los detalles ya cargados se **cachean en el store** y las peticiones concurrentes idénticas se **deduplican**, evitando refetch.

### 2. Favoritos persistidos en el store (como pide la prueba)
El store de **Pinia es la fuente de verdad**. Además se sincroniza con `localStorage` mediante un `watch`, de modo que los favoritos **sobreviven a recargas** sin backend. Se guarda el Pokémon completo (no solo el id) para que la vista de favoritos se renderice al instante tras recargar, sin volver a pedir el detalle.

### 3. Debilidades sin llamadas extra
El detalle muestra las **debilidades** de cada Pokémon. Esa información normalmente requeriría el endpoint `/type`, pero la prueba acota el consumo a **dos llamados**. Se resolvió con una **tabla estática de efectividad de tipos** (chart Gen VI+) que calcula las debilidades en cliente combinando los uno o dos tipos del Pokémon. Cero peticiones adicionales.

### 4. Fidelidad al diseño y campos fuera de alcance
El diseño del detalle incluye *descripción*, *categoría* y *género*, que **no vienen** en `/pokemon/{name}` (requieren `/pokemon-species`, fuera de los dos endpoints permitidos). Para respetar esa restricción, el detalle se construye con lo que **sí** entrega el endpoint autorizado (tipos, peso, altura, habilidades y **estadísticas base**) más las debilidades calculadas. Es una decisión consciente: priorizar la regla de los dos llamados.

### 5. Búsqueda por nombre y número
El buscador filtra en cliente por **nombre** y por **número de entrada** (id), ambos disponibles en el índice sin peticiones adicionales. La coincidencia es instantánea y admite el número con o sin relleno de ceros (`1`, `01`, `001`).

### 6. Adaptación mobile → desktop/web
El diseño original es mobile (360px). Se adaptó con un enfoque **responsive** real: en móvil, columna única con **tab bar inferior**; en desktop, una **barra de navegación superior tipo web**, layout ancho (1120px) con las cards en **grilla de varias columnas**, onboarding en **dos columnas (landscape)** y el detalle como **modal ancho de dos columnas**. Breakpoint en 768px.

### 7. Principios de código
- **DRY**: design tokens, `AppIcon`, `EmptyState` y composables centralizan lo repetido.
- **KISS**: solo se modela de la API lo que la app usa; sin abstracciones prematuras.
- **SOLID**: cada capa tiene una responsabilidad; los componentes dependen de abstracciones (`services`, `stores`), no de `fetch` ni de `localStorage` directamente.

---

## ✅ Testing

Tests unitarios con Vitest sobre lo de mayor valor:
- **Lógica de dominio**: cálculo de debilidades (tabla de tipos), formateo y **texto de compartir**.
- **Mapper**: conversión de unidades (dm→m, hg→kg) y normalización.
- **Store de favoritos**: alternar, no duplicar, persistir e hidratar desde `localStorage`.
- **Componente**: `TypeBadge` (etiqueta, color y tamaño).

```bash
npx vitest run   # 22 tests
```

---

## 📁 Funcionalidades

- [x] Onboarding de bienvenida (2 pasos)
- [x] Pantalla de carga con **pokebola animada en CSS**
- [x] Lista de Pokémon con **búsqueda (nombre o número)** y **scroll infinito**
- [x] Detalle con tipos, peso, altura, habilidades, stats y debilidades
- [x] **Favorito** (❤️) con persistencia
- [x] Botón **Compartir**: copia nombre + atributos separados por coma al portapapeles
- [x] Vista de **Favoritos** con estado vacío
- [x] Estado de **error** con reintento
- [x] Responsive **mobile → desktop**
- [x] Accesibilidad: roles ARIA, foco visible, `prefers-reduced-motion`

---

Desarrollado como prueba técnica para **Global66**.
