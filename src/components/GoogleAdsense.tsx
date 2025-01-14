'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

declare global {
  interface Window {
    adsbygoogle: any[],
    plausible: {
      q: any[]
    }
  }
}

function GoogleAdsense() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
      }
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-7897104007345492"
      data-ad-slot="YOUR_AD_SLOT_ID"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

// 使用 dynamic 导入来确保组件只在客户端渲染
export default dynamic(() => Promise.resolve(GoogleAdsense), {
  ssr: false
}) 