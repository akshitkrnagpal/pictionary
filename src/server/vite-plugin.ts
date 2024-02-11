import { Server } from 'socket.io';
import { setupListeners } from './setup-listeners';
import { Plugin } from 'vite';

export const socketIO: () => Plugin = () => ({
  name: 'socket.io',
  configureServer(server) {
    if (!server.httpServer) return;

    const io = new Server(server.httpServer);
    setupListeners(io);
  },
});
