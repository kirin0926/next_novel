// src/store/subscriptionStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'// 持久化存储

interface SubscriptionState {// 订阅状态
  isSubscribed: boolean// 是否订阅
  plan: string | null// 订阅计划
  subscriptionId: string | null// 订阅ID
  expiresAt: string | null// 过期时间
  setSubscription: (data: {
    plan: string// 订阅计划
    subscriptionId: string// 订阅ID
    expiresAt: string// 过期时间
  }) => void// 设置订阅
  clearSubscription: () => void// 清除订阅
}

export const useStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isSubscribed: false,// 是否订阅
      plan: null,// 订阅计划
      subscriptionId: null,// 订阅ID
      expiresAt: null,// 过期时间
      setSubscription: (data) =>
        set({
          isSubscribed: true,
          ...data,
        }),
      clearSubscription: () =>
        set({
          isSubscribed: false,// 是否订阅
          plan: null,// 订阅计划
          subscriptionId: null,// 订阅ID
          expiresAt: null,// 过期时间
        }),
    }),
    {
      name: 'app-storage',
    }
  )
)