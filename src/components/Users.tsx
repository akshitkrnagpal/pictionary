import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const CurrentUser = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { isLoading, data: mediaStream } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['currentUserMediaStream'],
    queryFn: async () => {
      const constraints = {
        audio: true,
        video: { width: 240, height: 135, facingMode: 'user' },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      return mediaStream;
    },
  });

  useEffect(() => {
    if (isLoading || !mediaStream || !videoRef.current) return;
    videoRef.current.srcObject = mediaStream;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current?.play();
    };
  }, [isLoading, mediaStream]);

  return (
    <Card className='overflow-hidden w-[240px] h-[135px]'>
      <video ref={videoRef} className='w-full h-full' />
    </Card>
  );
};

const Users = () => {
  return (
    <div className='grid gap-4'>
      <CurrentUser />
    </div>
  );
};

export default Users;
