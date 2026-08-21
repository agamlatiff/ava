import type { Metadata } from 'next'
import Link from 'next/link'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { getHangoutRoute } from '@/lib/routes'
import type { Hangout } from '@/db/schema'

export const metadata: Metadata = {
  title: "Let's Go — Plans",
  description: "View all your upcoming and past hangout plans.",
}

export default async function Page() {
  let hangoutsList: Hangout[] = []
  try {
    hangoutsList = await hangoutsRepository.getRecentHangouts(10)
  } catch (err) {
    console.warn('DB queries in Hangouts Page failed, using fallback empty state:', err)
  }

  return (
    <div style={{ maxWidth: '640px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)' }}>
      <h1 className="text-h2" style={{ marginBottom: 'var(--space-6)' }}>
        Your Plans 📋
      </h1>

      {hangoutsList.length === 0 ? (
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '2.5rem' }}>🌊</span>
          <h2 className="text-h3">No plans yet</h2>
          <p className="text-body-sm text-secondary">Start by creating your first hangout together!</p>
          <Link href="/hangouts/new" className="btn-primary">
            + Plan Something
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {hangoutsList.map((h) => (
            <Link key={h.id} href={getHangoutRoute(h)} className="glass-card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
              <div>
                <h3 className="text-body" style={{ fontWeight: 600 }}>{h.area}</h3>
                <p className="text-caption text-muted">{h.date} · {h.startTime} – {h.endTime}</p>
              </div>
              <span className="text-caption" style={{ padding: '4px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-subtle)', color: 'var(--accent-cyan)' }}>
                {h.status.replace('_', ' ').toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
