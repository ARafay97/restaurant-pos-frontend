import { io } from "socket.io-client";

const socketBase =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== "undefined"
    ? window.location.origin.replace(/^http/, "ws")
    : "http://localhost:4000");

export const socket = io(socketBase, {
  transports: ["websocket"],
});
