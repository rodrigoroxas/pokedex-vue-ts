/**
 * Cliente HTTP mínimo sobre fetch.
 * Centraliza base URL y manejo de errores para no repetirlo en cada servicio
 * (DRY) y para poder sustituir la implementación sin tocar los consumidores
 * (SOLID: dependen de esta abstracción, no de fetch directamente).
 */

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function httpGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (cause) {
    // Falla de red / CORS / abort → error de dominio homogéneo.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new HttpError('No se pudo conectar con el servidor.', 0)
  }

  if (!response.ok) {
    throw new HttpError(`La petición falló (${response.status}).`, response.status)
  }

  return response.json() as Promise<T>
}
