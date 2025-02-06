'use client'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full  flex flex-col items-center justify-center">
            <SignUp 
                path="/auth/sign-up"// 指定路由路径
                signInUrl="/auth/sign-in"// 指定登录页面路径
                routing="path" // 指定路由方式
            />
        </div>
    </div>
  )
}