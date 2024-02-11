import { useNavigate } from '@tanstack/react-router';

const Home = () => {
  const navigate = useNavigate({ from: '/' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const room = formData.get('room') as string;
    navigate({ to: '/$roomName', params: { roomName: room } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' name='room' />
        <button type='submit'>Join</button>
      </form>
    </div>
  );
};

export default Home;
