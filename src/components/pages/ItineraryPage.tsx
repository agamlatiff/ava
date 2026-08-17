'use client'

import Link from 'next/link'
import { Timeline, type TimelineStop } from '@/components/ui/Timeline'
import type { Hangout } from '@/db/schema'

interface ItineraryPageProps {
  hangout: Hangout
  stops: TimelineStop[]
  estimatedCost: number
}

export function ItineraryPage({
  hangout,
  stops,
  estimatedCost,
}: ItineraryPageProps) {
  const formattedCost = new Intl.NumberFormat('id-ID').format(estimatedCost)

  return (
    <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-h2">Your Plan 🌊</h1>
          <p className="text-body-sm text-secondary">
            {hangout.date} · {hangout.area}
          </p>
        </div>

        <span
          className="text-caption"
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-subtle)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(77, 208, 225, 0.3)',
            fontWeight: 600,
          }}
        >
          {hangout.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {stops.length === 0 ? (
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '2.5rem' }}>📋</span>
          <h2 className="text-h3">No itinerary generated yet</h2>
          <p className="text-body-sm text-secondary">
            Select places for your matched activities first.
          </p>
          <Link href={`/hangouts/${hangout.id}/places`} className="btn-primary">
            Pick Places →
          </Link>
        </div>
      ) : (
        <>
          <Timeline stops={stops} />

          {/* ── Bottom Sticky Bar ── */}
          <div
            className="glass-card"
            style={{
              padding: 'var(--space-4) var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--space-4)',
            }}
          >
            <div>
              <p className="text-caption text-muted">Estimated Cost</p>
              <p className="text-h3" style={{ color: 'var(--accent-cyan)' }}>
                Rp {formattedCost}
              </p>
            </div>

            <Link href={`/hangouts/${hangout.id}/confirm`} className="btn-primary">
              Confirm Plan ✓
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
