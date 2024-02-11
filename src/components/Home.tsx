import { useSocket } from '@/hooks/useSocket';

const Home = () => {
  const { isConnected } = useSocket();

  return <div>{isConnected ? 'Connected' : 'Not connected'}</div>;
};

export default Home;
