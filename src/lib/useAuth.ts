// import { create } from 'zustand'

// interface AuthState {
//   user: any | null
//   setUser: (user: any | null) => void
// }

// export const useAuth = create<AuthState>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
// }))

import { useAuth as useClerkAuth } from "@clerk/nextjs";

// 获取当前用户
export function useUser() {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  
  return {
    userId: userId as string | null,
    isLoaded: isLoaded as boolean,
    isSignedIn: isSignedIn as boolean
  };
}

// 判断用户是否已登录
export function useAuthCheck() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  
  return {
    isAuthenticated: isSignedIn as boolean,
    isLoaded: isLoaded as boolean
  };
}


