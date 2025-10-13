'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function GoogleAnalytics(): React.ReactElement | null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    if (typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('config', measurementId, { page_path: url })
    }
  }, [pathname, searchParams])

  if (!measurementId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
gtag('js', new Date());
gtag('config', '${measurementId}', { page_path: window.location.pathname });`}
      </Script>
    </>
  )
}
