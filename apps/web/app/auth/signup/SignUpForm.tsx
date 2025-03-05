'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/buttons/SubmitButton';
import { signUp } from '@/lib/auth';
import React, { useActionState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'lucide-react';
import { cn } from '@/lib/utils';

const SignUpForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form action={action} className="grid gap-6">
              {state?.message && (
                <p className="text-sm text-red-500">{state.message}</p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <div>
                  <Input id="name" name="name" placeholder="m@example.com" />
                  {state?.error?.email && (
                    <p className="text-sm text-red-500">{state.error.email}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="m@example.com"
                    type="email"
                  />
                  {state?.error?.email && (
                    <p className="text-sm text-red-500">{state.error.email}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div>
                  <Input id="password" type="password" name="password" />
                  {state?.error?.password && (
                    <p className="text-sm text-red-500">
                      {state.error.password}
                    </p>
                  )}
                </div>
              </div>
              <SubmitButton>Sign In</SubmitButton>
            </form>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <a href="signin" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
