'use client';

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
// 引入 store
import { useStore } from '@/store' 
interface SubscriptionDetails {
  customer_email?: string;
  subscription?: string;
  amount_total?: number;
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [details, setDetails] = useState<SubscriptionDetails | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取 store 更新方法
  const setSubscription = useStore(state => state.setSubscription)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/subscription-status?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          console.log('data', data);
          setDetails(data)
          // 更新订阅状态
          setSubscription({
            plan: data.subscription,
            subscriptionId: data.subscription,
            expiresAt: data.expires_at
          })
          setLoading(false)
        })
        .catch(error => {
          console.error('Error:', error)
          setLoading(false)
        })
    }
  }, [sessionId, setSubscription])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Subscription Successful!</h1>
      {details && (
        <div className="mt-8 space-y-4">
          {/* <p className="text-lg text-gray-600">Email: {details.customer_email}</p> */}
          <p className="text-lg text-gray-600">Subscription ID: {details.subscription}</p>
          <p className="text-lg text-gray-600">
            Amount: ${(details.amount_total || 0) / 100}
          </p>
          <Link className="text-blue-500 hover:text-blue-700" href="/">go back to Home</Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16 text-center">
        <SuccessContent />
      </div>
    </div>
  )
} 