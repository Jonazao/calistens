'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/buttons/SubmitButton';
import { signUp } from '@/lib/auth';
import React, { useActionState, useEffect } from 'react';
import { useDrawer } from '@/components/providers/DrawerContext';

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  const { setContent, toggleDrawer } = useDrawer();

  useEffect(() => {
    setContent(
      <div>
        <h2 className="text-xl font-bold">Example Drawer Content</h2>
        <p>This content was set from the page.</p>
      </div>
    );
  }, [setContent]);
  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" />
        </div>
        {state?.error?.name && (
          <p className="text-sm text-red-500">{state.error.name}</p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="john@example.com" />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        {state?.error?.password && (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <SubmitButton>Sign up</SubmitButton>
        <button
          onClick={toggleDrawer}
          className="mt-4 p-2 bg-blue-500 text-white"
        >
          Toggle Drawer
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
