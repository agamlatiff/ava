import { StarRating } from '@/components/ui/StarRating'

interface MemoryCardData {
  id: string
  hangoutDate: string | null
  hangoutArea: string | null
  rating: number
  note: string | null
}

interface MemoriesPageProps {
  memories: MemoryCardData[]
}

export function MemoriesPage({ memories }: MemoriesPageProps) {
  return (
    <div style={{ maxWidth: '640px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <h1 className="text-h2">Our Adventures 🐚</h1>

      {memories.length === 0 ? (
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '2.5rem' }}>🐠</span>
          <h2 className="text-h3">No memories saved yet</h2>
          <p className="text-body-sm text-secondary">
            Completed hangouts will appear here as beautiful memories.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {memories.map((m, i) => (
              <div
                key={m.id}
                className="glass-card"
                style={{
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-h3" style={{ color: 'var(--accent-cyan)' }}>
                    #{String(memories.length - i).padStart(3, '0')}
                  </span>
                  <span className="text-caption text-muted">
                    {m.hangoutDate || 'Unknown date'}
                  </span>
                </div>

                <div>
                  <p className="text-body" style={{ fontWeight: 600 }}>
                    {m.hangoutArea || 'Somewhere special'}
                  </p>
                </div>

                <StarRating rating={m.rating} />

                {m.note && (
                  <p className="text-body-sm text-secondary" style={{ fontStyle: 'italic' }}>
                    &ldquo;{m.note.length > 80 ? m.note.slice(0, 80) + '...' : m.note}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-caption text-muted" style={{ textAlign: 'center' }}>
            {memories.length} adventure{memories.length !== 1 ? 's' : ''} together 🐠
          </p>
        </>
      )}
    </div>
  )
}
