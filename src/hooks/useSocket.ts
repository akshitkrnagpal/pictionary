import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { useQuery } from '@tanstack/react-query';

export const useSocket = () => {
  const { data: socket } = useQuery({
    queryKey: ['socket.io'],
    queryFn: () => io(),
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return { isConnected, socket };
};
