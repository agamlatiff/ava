import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Let's Go — Memories",
  description: "Cherished moments from our past hangouts.",
}

export default async function Page() {
  return (
    <div style={{ maxWidth: '640px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)' }}>
      <h1 className="text-h2" style={{ marginBottom: 'var(--space-6)' }}>
        Our Adventures 🐚
      </h1>

      <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span style={{ fontSize: '2.5rem' }}>🐠</span>
        <h2 className="text-h3">No memories saved yet</h2>
        <p className="text-body-sm text-secondary">
          Completed hangouts will appear here as beautiful memories.
        </p>
      </div>
    </div>
  )
}
