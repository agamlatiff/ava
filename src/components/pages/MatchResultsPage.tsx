'use client'

import Link from 'next/link'
import type { MatchResult } from '@/services/matchingService'

interface MatchResultsPageProps {
  hangoutId: string
  matches: MatchResult
}

export function MatchResultsPage({ hangoutId, matches }: MatchResultsPageProps) {
  const hasMatches = matches.matchedActivities.length > 0

  return (
    <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <h1 className="text-display" style={{ fontSize: '2.5rem' }}>
          {hasMatches ? 'Match Found! 🎉' : 'No Direct Matches 🌊'}
        </h1>
        <p className="text-body-sm text-secondary">
          {hasMatches
            ? 'Both of you said YES to these activities!'
            : 'You picked different things — pick one together or try again!'}
        </p>
      </div>

      {/* ── Matched Activities ── */}
      {hasMatches && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
            {matches.matchedActivities.map((m) => (
              <div
                key={m.activityId}
                className="glass-card glow-pulse"
                style={{
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '2px solid var(--accent-cyan)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ fontSize: '2.5rem' }} aria-hidden="true">
                    {m.icon}
                  </span>
                  <div>
                    <h2 className="text-h3">{m.name}</h2>
                    <p className="text-caption text-secondary">
                      {m.responderChoice === 'love' ? '❤️ Loved by Partner' : '👍 Liked by Partner'}
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '1.5rem' }}>✨</span>
              </div>
            ))}
          </div>

          <Link
            href={`/hangouts/${hangoutId}/places`}
            className="btn-primary w-full"
            style={{ marginTop: 'var(--space-4)' }}
          >
            Build the Plan →
          </Link>
        </section>
      )}

      {/* ── Unmatched Section ── */}
      {matches.unmatchedActivities.length > 0 && (
        <section style={{ opacity: 0.6, marginTop: 'var(--space-2)' }}>
          <hr style={{ border: 'none', borderTop: 'var(--border-glass)', marginBottom: 'var(--space-4)' }} />
          <h3 className="text-caption text-muted" style={{ marginBottom: 'var(--space-2)' }}>
            OTHER PROPOSALS (NO MATCH)
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {matches.unmatchedActivities.map((u) => (
              <div
                key={u.activityId}
                className="glass-card"
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{u.icon}</span>
                <span className="text-caption">{u.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasMatches && (
        <Link
          href={`/hangouts/${hangoutId}/activities`}
          className="btn-secondary w-full"
        >
          ← Adjust Activities
        </Link>
      )}
    </div>
  )
}
