'use client'

import { ArrowRightIcon } from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepNavigationProps {
  currentStep: number
  isNextDisabled?: boolean
  nextLabel?: string
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function StepNavigation({
  currentStep,
  isNextDisabled = false,
  nextLabel = 'Continue',
  onNext,
  onBack,
  isSubmitting = false,
}: StepNavigationProps) {
  return (
    <div className={styles.navBar}>
      <button
        type="button"
        className={styles.backButton}
        onClick={onBack}
        disabled={isSubmitting}
        aria-label="Go back to previous step"
      >
        ← {currentStep === 1 ? 'Cancel' : 'Back'}
      </button>

      <button
        type="button"
        className={styles.primaryActionButton}
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
      >
        {isSubmitting ? (
          'Starting adventure...'
        ) : (
          <>
            {nextLabel} <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </div>
  )
}
