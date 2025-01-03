import React, { PropsWithChildren } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

const SignInButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} className="w-full mt-2">
      {pending ? 'Submiting...' : children}
    </Button>
  )
}

export default SignInButton
