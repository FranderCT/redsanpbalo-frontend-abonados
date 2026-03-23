import { toast } from "sonner";
import { getApiErrorMessages } from "./getApiErrorMessages";

const DEFAULT_DURATION_MS = 6000;

/**
 * Muestra en un toast de error los mensajes de una respuesta API.
 * Si hay varios mensajes, el primero va como título y el resto como descripción.
 */
export function showApiErrorToast(
  error: unknown,
  options?: { duration?: number }
): void {
  const messages = getApiErrorMessages(error);
  const duration = options?.duration ?? DEFAULT_DURATION_MS;

  if (messages.length === 1) {
    toast.error(messages[0], { duration });
  } else {
    const [first, ...rest] = messages;
    toast.error(first, {
      duration,
      description: rest.join(" • "),
    });
  }
}
