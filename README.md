# Pokédex — Prueba técnica Front End (Global66)

Aplicación de **lista de Pokémon y favoritos** construida con **Vue 3 + TypeScript**, consumiendo la [PokéAPI](https://pokeapi.co/). El diseño mobile de Figma se adaptó a un layout **responsive desktop/web**.

> Splash → Onboarding → Pokédex (búsqueda, filtro y scroll infinito) → Detalle (favorito ❤️ + compartir 📋) → Favoritos persistidos (con eliminar).

**🔗 Demo en vivo:** [pokedex-global66-rojas.vercel.app](https://pokedex-global66-rojas.vercel.app/)

---

## 🚀 Puesta en marcha

**Requisitos:** [Node.js](https://nodejs.org/) **22+** y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/rodrigoroxas/pokedex-vue-ts.git
cd pokedex-vue-ts

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo → http://localhost:5173
npm run dev
```

No requiere variables de entorno ni configuración adicional: la app consume la PokéAPI pública directamente.

### Otros scripts

```bash
npm run build       # build de producción (genera /dist)
npm run preview     # previsualiza el build de producción
npm run type-check  # chequeo de tipos (vue-tsc)
npm run lint        # oxlint + eslint
npx vitest run      # tests unitarios (una corrida)
npm run test:unit   # tests en modo watch
```

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
├── services/      http (fetch tipado) · pokemonApi (índice, detalle, tipo, especie, habilidad) · pokemonMapper
├── utils/         format (nº, compartir) · pokemonType (colores, íconos, tabla de debilidades) · search · storage
├── stores/        favorites (persistido) · pokemon (índice + cachés) · confirm (diálogo global)
├── composables/   usePokedexList · useInfiniteScroll · useClipboard · useFavoriteToggle
├── components/
│   ├── ui/        PokeballLoader · TypeBadge · BaseButton · AppIcon · EmptyState · SwipeToDelete · ConfirmDialog
│   ├── layout/    TopNav · TabBar · AppSearchBar · FilterSheet · SplashScreen
│   └── pokemon/   PokemonCard · PokemonDetail · FavoriteButton · StatBox · StatBars · GenderBar
├── assets/        images/types/*.svg (íconos de tipo del diseño) · styles (design tokens)
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

### 4. Detalle completo (categoría, descripción, género, habilidad en español)
El detalle del diseño incluye datos que **no vienen** en `/pokemon/{name}`: *descripción*, *categoría* y *género* están en **`/pokemon-species/{name}`**, y el nombre de la habilidad **en español** en **`/ability/{name}`** (la API la entrega en inglés en el detalle). Para lograr un detalle **fiel al diseño** se añaden esas llamadas, pero de forma eficiente: se piden **solo al abrir el detalle** (no por cada card) y se **cachean**. Así la lista sigue siendo liviana y el detalle queda completo (tipos, peso, altura, categoría, habilidad, descripción, género, debilidades y estadísticas base).

> **Endpoints usados:** `/pokemon` (índice) y `/pokemon/{name}` (detalle) forman el núcleo pedido. Para respetar el **diseño** se añadieron, de forma perezosa y cacheada, `/type/{tipo}` (filtro), `/pokemon-species/{name}` (categoría/descripción/género) y `/ability/{name}` (habilidad en español). Es una decisión consciente: el core cumple con dos llamados; los extra son por fidelidad, no por el flujo base.

### 5. Búsqueda por nombre/número y filtro por tipo
El buscador filtra en cliente por **nombre** y por **número de entrada** (id), ambos disponibles en el índice sin peticiones adicionales, con relleno de ceros opcional (`1`, `01`, `001`).

El **filtro por tipo** (bottom sheet *"Filtra por tus preferencias"* del diseño) sí requiere un endpoint extra: `GET /type/{tipo}` devuelve todos los Pokémon de un tipo en **una** llamada (cacheada por tipo). Como el índice base no incluye el tipo de cada Pokémon, esta es la forma correcta de ofrecer un filtro **completo** sin descargar los ~1300 detalles. Se añadió **por fidelidad al diseño**, es una llamada de tipo "listado" análoga a `/pokemon`, y se combina con la búsqueda de texto. Búsqueda y filtro comparten la misma tubería de filtrado/paginación en cliente.

### 6. Adaptación mobile → desktop/web
El diseño original es mobile (360px). Se adaptó con un enfoque **responsive** real: en móvil, columna única con **tab bar inferior**; en desktop, una **barra de navegación superior tipo web**, layout ancho (1120px) con las cards en **grilla de varias columnas**, onboarding en **dos columnas (landscape)** y el detalle como **modal ancho de dos columnas**. Breakpoint en 768px.

### 7. Fidelidad al diseño
Se trató el Figma como un **sistema de diseño a adaptar**, no un mockup a calcar:
- **Design tokens** (colores, tipografía, spacing, radios) medidos del diseño en un único lugar.
- **Íconos de tipo**: se usan los 18 **SVG oficiales** exportados del Figma; el glifo blanco se tiñe con el color del tipo sobre un círculo blanco, como el diseño de las pastillas.
- Cards con el color y el recuadro redondeado del diseño; ícono del tipo como marca de agua tras el sprite.
- Splash inicial con la pokebola animada (CSS), estados vacío/error/"muy pronto" con sus ilustraciones.

### 8. UX: confirmación al quitar favoritos
Quitar un favorito es una acción con intención de borrado, así que pide **confirmación** (diálogo global reutilizable). Aplica tanto al **corazón** (al quitar) como al **eliminar** de la vista de favoritos (adaptación web del *swipe-to-delete* del diseño: se revela con hover en desktop y con deslizamiento en táctil). Añadir un favorito es instantáneo (no es destructivo).

### 9. Principios de código
- **DRY**: design tokens, `AppIcon`, `EmptyState`, composables y stores centralizan lo repetido.
- **KISS**: solo se modela de la API lo que la app usa; sin abstracciones prematuras.
- **SOLID**: cada capa tiene una responsabilidad; los componentes dependen de abstracciones (`services`, `stores`), no de `fetch` ni de `localStorage` directamente.

---

## ✅ Testing

Tests unitarios con Vitest sobre lo de mayor valor (**39 tests**, 7 archivos):
- **Lógica de dominio**: cálculo de debilidades (tabla de tipos), etiquetas de tipo.
- **Búsqueda/filtro**: coincidencia por nombre y número, filtro por tipo (`filterPokemonList`).
- **Formato**: número de Pokédex, id desde URL y **texto de compartir** (con categoría/habilidad).
- **Mapper**: conversión de unidades (dm→m, hg→kg), orden de tipos y `mapSpecies` (categoría/género).
- **Servicio**: endpoint `/type` (con mock de `fetch`).
- **Store de favoritos**: alternar, no duplicar, persistir e hidratar desde `localStorage`.
- **Componente**: `TypeBadge` (etiqueta, color y tamaño).

```bash
npx vitest run   # 39 tests
```

---

## 📁 Funcionalidades

- [x] **Splash** inicial con pokebola animada en CSS + onboarding de bienvenida (2 pasos)
- [x] Lista de Pokémon con **búsqueda (nombre o número)**, **filtro por tipo** y **scroll infinito**
- [x] Detalle con descripción, tipos, peso, altura, categoría, habilidad (ES), género, stats y debilidades
- [x] **Favorito** (❤️) con persistencia y **confirmación al quitar**
- [x] Botón **Compartir**: copia nombre + atributos separados por coma al portapapeles
- [x] Vista de **Favoritos** con búsqueda/filtro, **eliminar** (swipe/hover) y estado vacío
- [x] Estados de **error** (con reintento) y **"muy pronto"**
- [x] Responsive **mobile → desktop** (tab bar / nav superior)
- [x] Íconos de tipo con los **SVG del diseño**
- [x] Accesibilidad: roles ARIA, foco visible, `prefers-reduced-motion`

---

Desarrollado como prueba técnica para **Global66**.
