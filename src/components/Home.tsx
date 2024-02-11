import { Field, Form } from 'houseform';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Home = () => {
  const navigate = useNavigate({ from: '/' });

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='py-10 text-center'>
        <div className='container'>
          <h1 className='text-5xl font-bold tracking-tighter sm:text-6xl'>
            Pictionary
          </h1>
        </div>
      </header>
      <main className='flex-1'>
        <div className='container flex items-center justify-center gap-4 px-4 text-center md:px-6'>
          <div className='w-full max-w-[400px]'>
            <Form
              onSubmit={(values) => {
                navigate({
                  to: '/$roomName',
                  params: { roomName: values.room },
                });
              }}
            >
              {({ isValid, submit }) => (
                <form
                  className='flex flex-col gap-4 mx-auto'
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <Field<string>
                    name='room'
                    onChangeValidate={z
                      .string()
                      .min(1, 'Must be at least 1 characters long')}
                  >
                    {({ value, setValue, onBlur }) => {
                      return (
                        <div className='flex flex-col gap-1.5'>
                          <Input
                            name='room'
                            placeholder='Room name'
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={onBlur}
                          />
                        </div>
                      );
                    }}
                  </Field>
                  <Button disabled={!isValid} type='submit'>
                    Join
                  </Button>
                </form>
              )}
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
