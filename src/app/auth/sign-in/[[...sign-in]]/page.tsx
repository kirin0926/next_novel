'use client'

import { SignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
// import { dark } from '@clerk/themes'

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full flex flex-col items-center justify-center">
        <SignIn
          path="/auth/sign-in"
          routing="path"
          signUpUrl="/auth/sign-up"
        />
      </div>
    </div>
  )
} 