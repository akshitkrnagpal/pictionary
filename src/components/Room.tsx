import { useEffect, useRef } from 'react';
import Canvas, { CanvasHandle, Change } from './Canvas';
import { roomRoute } from '../routes';
import { useSocket } from '@/hooks/useSocket';

const Room = () => {
  const canvas = useRef<CanvasHandle>(null);
  const { isConnected, socket } = useSocket();
  const { roomName } = roomRoute.useParams();

  useEffect(() => {
    if (!isConnected) return;
    socket.emit('join', { roomName });
  }, [isConnected, roomName, socket]);

  const handleDraw = (lX: number, lY: number, cX: number, cY: number) => {
    socket.emit('draw', { roomName, change: { lX, lY, cX, cY } });
  };

  const onDraw = (event: Change) => {
    if (!canvas.current) return;
    const { lX, lY, cX, cY } = event;
    canvas.current.draw(lX, lY, cX, cY);
  };

  useEffect(() => {
    const onRequestState = () => {
      if (!canvas.current) return;
      const state = canvas.current.get();
      socket.emit('state', { roomName, state });
    };

    const onReceiveState = (state: Change[]) => {
      if (!canvas.current) return;
      canvas.current.put(state);
    };

    socket.on('request-state', onRequestState);
    socket.on('receive-state', onReceiveState);
    socket.on('draw', onDraw);

    return () => {
      socket.off('request-state', onRequestState);
      socket.off('receive-state', onReceiveState);
      socket.off('draw', onDraw);
    };
  }, [isConnected, roomName, socket]);

  return (
    <div className='grid grid-cols-2 bg-gray-400 h-full w-full'>
      <div className='flex-1 px-8 py-8 flex justify-center items-center flex-col'>
        <div>{isConnected ? 'Connected' : 'Not Connected'}</div>
        <Canvas
          key={isConnected.toString()}
          ref={canvas}
          className='bg-white rounded border'
          onDraw={handleDraw}
          color='#000'
          width={4}
        />
      </div>
    </div>
  );
};

export default Room;
