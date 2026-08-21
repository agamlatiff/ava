'use client'

import styles from '../AdventurePlanner.module.css'

interface StepProgressBarProps {
  currentStep: number
  totalSteps?: number
  onStepClick?: (step: number) => void
}

export function StepProgressBar({
  currentStep,
  totalSteps = 6,
  onStepClick,
}: StepProgressBarProps) {
  const stepLabels = ['Activity', 'Date', 'Time', 'Duration', 'Location', 'Preview']

  return (
    <div className={styles.progressWrapper} aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <button
              key={stepNum}
              type="button"
              className={`${styles.stepDot} ${isCurrent ? styles.stepDotActive : ''} ${
                isCompleted ? styles.stepDotCompleted : ''
              }`}
              onClick={() => isCompleted && onStepClick?.(stepNum)}
              disabled={!isCompleted}
              title={`Step ${stepNum}: ${stepLabels[i]}`}
              aria-label={`Step ${stepNum}: ${stepLabels[i]}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isCompleted ? '✓' : stepNum}
            </button>
          )
        })}
      </div>
      <span className={styles.progressText}>
        Step {currentStep} of {totalSteps} · {stepLabels[currentStep - 1]}
      </span>
    </div>
  )
}
