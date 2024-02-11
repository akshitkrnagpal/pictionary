import type { Server } from 'socket.io';

export const setupListeners = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
