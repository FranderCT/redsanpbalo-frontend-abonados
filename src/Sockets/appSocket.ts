import apiAxios from "@/api/apiConfig";
import io from "socket.io-client";

const SOCKET_URL = apiAxios.defaults.baseURL ?? "https://api.redsanpbalo.cloud";

function getStoredToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return "";
  }

  return token;
}

export const appSocket = io(SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: "",
  },
});

function applySocketAuth() {
  const token = getStoredToken();
  appSocket.auth = { token };
  return token;
}

let lastToken = "";

export function syncAppSocketAuth() {
  const token = applySocketAuth();

  if (!token) {
    lastToken = "";
    if (appSocket.connected || appSocket.active) {
      appSocket.disconnect();
    }
    return;
  }

  const tokenChanged = token !== lastToken;
  lastToken = token;

  if (appSocket.connected) {
    if (tokenChanged) {
      appSocket.disconnect();
      appSocket.connect();
    }
    return;
  }

  if (!appSocket.active) {
    appSocket.connect();
  }
}

export function disconnectAppSocket() {
  lastToken = "";
  appSocket.auth = { token: "" };

  if (appSocket.connected || appSocket.active) {
    appSocket.disconnect();
  }
}

appSocket.io.on("reconnect_attempt", () => {
  const token = applySocketAuth();

  if (!token) {
    appSocket.disconnect();
  }
});

appSocket.on("connect_error", () => {
  const token = applySocketAuth();

  if (!token) {
    appSocket.disconnect();
  }
});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "token") {
      syncAppSocketAuth();
    }
  });
}
