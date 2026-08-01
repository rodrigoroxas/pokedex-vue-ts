/**
 * Acceso tipado y a prueba de fallos a localStorage.
 * Envuelve el parseo/serialización JSON y captura errores (modo privado,
 * cuota llena, JSON corrupto) para que la app nunca rompa por persistencia.
 */

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Sin persistencia disponible: se degrada de forma silenciosa. */
  }
}
