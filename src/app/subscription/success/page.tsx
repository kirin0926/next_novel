'use client';

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/subscription-status?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setDetails(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error:', error)
          setLoading(false)
        })
    }
  }, [sessionId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Subscription Successful!</h1>
      {details && (
        <div className="mt-8 space-y-4">
          <p className="text-lg text-gray-600">Email: {details.customer_email}</p>
          <p className="text-lg text-gray-600">Subscription ID: {details.subscription}</p>
          <p className="text-lg text-gray-600">
            Amount: ${(details.amount_total || 0) / 100}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16 text-center">
        <Suspense fallback={
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
} 