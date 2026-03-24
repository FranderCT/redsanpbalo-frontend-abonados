/**
 * Extrae los mensajes de error de una respuesta API (axios u otro cliente HTTP).
 * Soporta respuestas donde `message` es string o string[] (ej. validación 400).
 */
function translateApiMessage(message: string): string {
  const normalized = message.trim();

  const exactMatches: Record<string, string> = {
    "Name should not be empty": "El nombre del seguimiento es requerido",
    "Observation should not be empty": "La observación del seguimiento es requerida",
    "ProjectId should not be empty": "El proyecto es requerido",
    "ProjectId must be an integer number": "El proyecto debe ser un ID numérico válido",
    "Name must be a string": "El nombre del seguimiento debe ser un texto",
    "Observation must be a string": "La observación del seguimiento debe ser un texto",
    "ProjectId must be an integer number conforming to the specified constraints":
      "El proyecto debe ser un ID numérico válido",
  };

  if (exactMatches[normalized]) {
    return exactMatches[normalized];
  }

  if (normalized.endsWith("should not be empty")) {
    return "Este campo es requerido";
  }

  if (normalized.endsWith("must be a string")) {
    return "Este campo debe ser un texto";
  }

  if (normalized.endsWith("must be a boolean value")) {
    return "Este campo debe ser true o false";
  }

  if (normalized.includes("must be an integer number")) {
    return "Este campo debe ser un número entero válido";
  }

  return normalized;
}

export function getApiErrorMessages(error: unknown): string[] {
  const data =
    error &&
    typeof error === "object" &&
    "response" in error
      ? (error as { response?: { data?: { message?: string | string[] } } })
          .response?.data
      : undefined;
  const msg = data?.message;
  if (Array.isArray(msg) && msg.length > 0) return msg.map(translateApiMessage);
  if (typeof msg === "string") return [translateApiMessage(msg)];
  return [translateApiMessage((error as Error)?.message ?? "Error al procesar la solicitud")];
}
