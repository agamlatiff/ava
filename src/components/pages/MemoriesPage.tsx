import { StarRating } from '@/components/ui/StarRating'
import { SparklesIcon } from '@/components/ui/OceanIcons'
import styles from './MemoriesPage.module.css'

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
    <div className={styles.root}>
      <h1 className={styles.title}>Our Adventures</h1>

      {memories.length === 0 ? (
        <div className={`glass-card-strong ${styles.emptyCard}`}>
          <SparklesIcon size={36} color="var(--accent-cyan)" />
          <h2 className="text-h3">No memories saved yet</h2>
          <p className="text-body-sm text-secondary">
            Completed hangouts will appear here as beautiful memories.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.memoriesList}>
            {memories.map((m, i) => (
              <div key={m.id} className={`glass-card ${styles.memoryCard}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.memoryNumber}>
                    #{String(memories.length - i).padStart(3, '0')}
                  </span>
                  <span className={styles.memoryDate}>
                    {m.hangoutDate || 'Unknown date'}
                  </span>
                </div>

                <div>
                  <p className={styles.memoryArea}>
                    {m.hangoutArea || 'Somewhere special'}
                  </p>
                </div>

                <StarRating rating={m.rating} />

                {m.note && (
                  <p className={styles.memoryNote}>
                    &ldquo;{m.note.length > 120 ? m.note.slice(0, 120) + '...' : m.note}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className={styles.footerSummary}>
            {memories.length} adventure{memories.length !== 1 ? 's' : ''} together
          </p>
        </>
      )}
    </div>
  )
}
