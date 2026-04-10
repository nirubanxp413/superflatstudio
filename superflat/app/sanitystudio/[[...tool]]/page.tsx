'use client'

import dynamicImport from 'next/dynamic'
import config from '@/sanity.config'

export const dynamic = 'force-dynamic'

const Studio = dynamicImport(() => import('sanity').then((m) => m.Studio), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        color: '#666',
      }}
    >
      Loading studio…
    </div>
  ),
})

export default function StudioPage() {
  return <Studio config={config} />
}
