'use client'

import {
  CoffeeIcon,
  FoodIcon,
  GamesIcon,
  WalkIcon,
  MovieIcon,
  StudyIcon,
  ExploreIcon,
  DessertIcon,
  CheckCircleIcon,
} from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepActivityProps {
  selectedActivityIds: string[]
  onToggleActivity: (id: string) => void
}

const ACTIVITIES = [
  { id: 'coffee', label: 'Coffee & Chill', icon: <CoffeeIcon size={28} color="#80DEEA" /> },
  { id: 'food', label: 'Food & Treats', icon: <FoodIcon size={28} color="#FF8A65" /> },
  { id: 'games', label: 'Games & Arcade', icon: <GamesIcon size={28} color="#BA68C8" /> },
  { id: 'walk', label: 'Walk & Talk', icon: <WalkIcon size={28} color="#4DD0E1" /> },
  { id: 'movie', label: 'Movie Night', icon: <MovieIcon size={28} color="#FFB74D" /> },
  { id: 'study', label: 'Study / Co-work', icon: <StudyIcon size={28} color="#81C784" /> },
  { id: 'explore', label: 'Somewhere New', icon: <ExploreIcon size={28} color="#4DD0E1" /> },
  { id: 'dessert', label: 'Sweet Dessert', icon: <DessertIcon size={28} color="#F48FB1" /> },
]

export function StepActivity({
  selectedActivityIds,
  onToggleActivity,
}: StepActivityProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 1 · Activities</span>
        <h2 className={styles.stepTitle}>What should we do?</h2>
        <p className={styles.stepDescription}>
          Pick one or more activities. Your partner will react and choose favorites!
        </p>
      </div>

      <div className={styles.activityChoicesGrid} role="group" aria-label="Activity choices">
        {ACTIVITIES.map((act) => {
          const isSelected = selectedActivityIds.includes(act.id)
          return (
            <button
              key={act.id}
              type="button"
              className={`${styles.activityChoiceCard} ${
                isSelected ? styles.activityChoiceCardSelected : ''
              }`}
              onClick={() => onToggleActivity(act.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.activityIconCircle}>{act.icon}</div>
              <span className={styles.activityChoiceLabel}>{act.label}</span>
              <div className={styles.checkIndicator}>
                {isSelected && <CheckCircleIcon size={16} color="var(--accent-cyan)" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
