'use client'

import Link from 'next/link'
import { Timeline, type TimelineStop } from '@/components/ui/Timeline'
import { CheckCircleIcon, ArrowRightIcon, CalendarIcon } from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'
import styles from './ItineraryPage.module.css'

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
    <div className={styles.root}>
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.title}>Your Plan</h1>
          <p className={`text-body-sm ${styles.subtitle}`}>
            {hangout.date} · {hangout.area}
          </p>
        </div>

        <span className={styles.statusBadge}>
          {hangout.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {stops.length === 0 ? (
        <div className={`glass-card-strong ${styles.emptyCard}`}>
          <CalendarIcon size={36} color="var(--accent-cyan)" />
          <h2 className="text-h3">No itinerary generated yet</h2>
          <p className="text-body-sm text-secondary">
            Select places for your matched activities first.
          </p>
          <Link href={`/hangouts/${hangout.id}/places`} className="btn-primary">
            Pick Places <ArrowRightIcon size={18} />
          </Link>
        </div>
      ) : (
        <>
          <Timeline stops={stops} />

          {/* ── Bottom Sticky Bar ── */}
          <div className={`glass-card-strong ${styles.costBar}`}>
            <div>
              <p className={styles.costLabel}>Estimated Cost</p>
              <p className={styles.costValue}>
                Rp {formattedCost}
              </p>
            </div>

            <Link href={`/hangouts/${hangout.id}/confirm`} className="btn-primary">
              <CheckCircleIcon size={18} /> Confirm Plan
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
