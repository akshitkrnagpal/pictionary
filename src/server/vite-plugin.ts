import { Server } from 'socket.io';
import { setupListeners } from './setup-listeners';

export const socketIO = () => ({
  name: 'socket.io',
  configureServer(server) {
    if (!server.httpServer) return;

    const io = new Server(server.httpServer);
    setupListeners(io);
  },
});
