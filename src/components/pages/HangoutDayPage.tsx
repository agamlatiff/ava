'use client'

import { useHangoutDay } from '@/hooks/useHangoutDay'
import { Timeline, type TimelineStop } from '@/components/ui/Timeline'
import type { Hangout } from '@/db/schema'
import Link from 'next/link'

interface HangoutDayPageProps {
  hangout: Hangout
  stops: TimelineStop[]
}

export function HangoutDayPage({ hangout, stops }: HangoutDayPageProps) {
  const {
    completedCount,
    totalCount,
    allComplete,
    handleMarkComplete,
  } = useHangoutDay(hangout.id, stops)

  return (
    <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-h2">
            {allComplete ? 'Adventure Complete! 🎉' : "Today's Adventure 🌊"}
          </h1>
          <p className="text-body-sm text-secondary">
            {hangout.date} · {hangout.area}
          </p>
        </div>

        <span
          className="text-caption"
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: allComplete ? 'rgba(76,175,80,0.2)' : 'var(--primary-subtle)',
            color: allComplete ? '#81C784' : 'var(--accent-cyan)',
            fontWeight: 600,
          }}
        >
          {completedCount}/{totalCount} Done
        </span>
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)' }}>
        <div
          style={{
            width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
            height: '100%',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* ── Interactive Timeline ── */}
      <Timeline
        stops={stops}
        interactive={!allComplete}
        onMarkComplete={handleMarkComplete}
      />

      {/* ── All Complete CTA ── */}
      {allComplete && (
        <Link
          href={`/hangouts/${hangout.id}/memory`}
          className="btn-primary w-full"
          style={{ textAlign: 'center' }}
        >
          Save This Memory 🐚
        </Link>
      )}
    </div>
  )
}
