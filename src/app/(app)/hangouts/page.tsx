import type { Metadata } from 'next'
import Link from 'next/link'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { getHangoutRoute } from '@/lib/routes'
import { CalendarIcon, PlusIcon, SparklesIcon, ArrowRightIcon } from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'

export const metadata: Metadata = {
  title: "AVA — Plans",
  description: "View all your upcoming and past hangout plans.",
}

export default async function Page() {
  let hangoutsList: Hangout[] = []
  try {
    hangoutsList = await hangoutsRepository.getRecentHangouts(15)
  } catch (err) {
    console.warn('DB queries in Hangouts Page failed, using fallback empty state:', err)
  }

  return (
    <div style={{ maxWidth: '860px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-h1">Plans</h1>
          <p className="text-body-sm text-secondary">All your upcoming and past adventures together</p>
        </div>
        <Link href="/hangouts/new" className="btn-primary">
          <PlusIcon size={18} /> New Plan
        </Link>
      </header>

      {hangoutsList.length === 0 ? (
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', borderRadius: 'var(--radius-xl)' }}>
          <SparklesIcon size={36} color="var(--accent-cyan)" />
          <h2 className="text-h3">No plans yet</h2>
          <p className="text-body-sm text-secondary">Start by creating your first hangout together!</p>
          <Link href="/hangouts/new" className="btn-primary">
            <PlusIcon size={18} /> Plan Something
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {hangoutsList.map((h) => (
            <Link
              key={h.id}
              href={getHangoutRoute(h)}
              className="glass-card"
              style={{
                padding: 'var(--space-5) var(--space-6)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textDecoration: 'none',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div>
                <h3 className="text-body" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.area}</h3>
                <p className="text-caption text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <CalendarIcon size={14} color="var(--accent-cyan)" />
                  {h.date} · {h.startTime} – {h.endTime}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  className="text-caption"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(0, 188, 212, 0.14)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(77, 208, 225, 0.25)',
                    fontWeight: 600,
                  }}
                >
                  {h.status.replace('_', ' ').toUpperCase()}
                </span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
