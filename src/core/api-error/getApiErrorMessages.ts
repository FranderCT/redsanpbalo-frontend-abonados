/**
 * Extrae los mensajes de error de una respuesta API (axios u otro cliente HTTP).
 * Soporta respuestas donde `message` es string o string[] (ej. validación 400).
 */
export function getApiErrorMessages(error: unknown): string[] {
  const data =
    error &&
    typeof error === "object" &&
    "response" in error
      ? (error as { response?: { data?: { message?: string | string[] } } })
          .response?.data
      : undefined;
  const msg = data?.message;
  if (Array.isArray(msg) && msg.length > 0) return msg;
  if (typeof msg === "string") return [msg];
  return [(error as Error)?.message ?? "Error al procesar la solicitud"];
}
