import React from "react";
import { toast } from "react-toastify";
import { getApiErrorMessages } from "./getApiErrorMessages";

const DEFAULT_AUTO_CLOSE_MS = 6000;

/**
 * Muestra en un toast de error los mensajes de una respuesta API.
 * Si hay varios mensajes, los muestra en lista con viñetas.
 */
export function showApiErrorToast(
  error: unknown,
  options?: { autoClose?: number }
): void {
  const messages = getApiErrorMessages(error);
  const autoClose = options?.autoClose ?? DEFAULT_AUTO_CLOSE_MS;

  const content =
    messages.length === 1
      ? messages[0]
      : React.createElement(
          "ul",
          {
            className: "list-disc list-inside mt-1 space-y-0.5 text-left",
          },
          messages.map((m, i) => React.createElement("li", { key: i }, m))
        );

  toast.error(content, { autoClose });
}
