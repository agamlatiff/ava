'use client'

import { useAdventurePlanner } from '@/hooks/useAdventurePlanner'
import { StepProgressBar } from './common/StepProgressBar'
import { StepNavigation } from './common/StepNavigation'
import { StepActivity } from './steps/StepActivity'
import { StepWhen } from './steps/StepWhen'
import { StepLocation } from './steps/StepLocation'
import { StepPreview } from './steps/StepPreview'
import styles from './AdventurePlanner.module.css'

interface AdventurePlannerProps {
  initialActivity?: string
}

export function AdventurePlanner({ initialActivity }: AdventurePlannerProps) {
  const {
    step,
    setStep,
    activityIds,
    toggleActivity,
    datePreset,
    setDatePreset,
    customDate,
    setCustomDate,
    timePeriod,
    setTimePeriod,
    customStartTime,
    setCustomStartTime,
    duration,
    setDuration,
    locationPreset,
    setLocationPreset,
    customLocation,
    setCustomLocation,
    budgetDisplay,
    handleBudgetChange,
    notes,
    setNotes,
    derivedDateDisplay,
    derivedStartTime,
    derivedEndTime,
    derivedArea,
    durationLabel,
    timePeriodLabel,
    isSubmitting,
    errorMsg,
    goNext,
    goBack,
    handleCreateAdventure,
  } = useAdventurePlanner(initialActivity)

  return (
    <div className={styles.plannerContainer}>
      {/* ── Progress Indicator ── */}
      <StepProgressBar currentStep={step} onStepClick={(s) => setStep(s)} />

      {/* ── Active Step Body ── */}
      <div className={styles.plannerCard}>
        {step === 1 && (
          <StepActivity
            selectedActivityIds={activityIds}
            onToggleActivity={toggleActivity}
          />
        )}

        {step === 2 && (
          <StepWhen
            datePreset={datePreset}
            customDate={customDate}
            onSelectDatePreset={setDatePreset}
            onChangeCustomDate={setCustomDate}
            timePeriod={timePeriod}
            customStartTime={customStartTime}
            onSelectTimePeriod={setTimePeriod}
            onChangeCustomStartTime={setCustomStartTime}
            duration={duration}
            onSelectDuration={setDuration}
          />
        )}

        {step === 3 && (
          <StepLocation
            locationPreset={locationPreset}
            customLocation={customLocation}
            budgetDisplay={budgetDisplay}
            notes={notes}
            onSelectPreset={setLocationPreset}
            onChangeCustomLocation={setCustomLocation}
            onChangeBudget={handleBudgetChange}
            onChangeNotes={setNotes}
          />
        )}

        {step === 4 && (
          <StepPreview
            activityIds={activityIds}
            derivedDateDisplay={derivedDateDisplay}
            timePeriodLabel={timePeriodLabel}
            derivedStartTime={derivedStartTime}
            derivedEndTime={derivedEndTime}
            durationLabel={durationLabel}
            derivedArea={derivedArea}
            budgetDisplay={budgetDisplay}
            notes={notes}
            isSubmitting={isSubmitting}
            errorMsg={errorMsg}
            onConfirm={handleCreateAdventure}
            onEditStep={(s) => setStep(s)}
          />
        )}

        {/* ── Step Navigation Footer (Steps 1 - 3) ── */}
        {step < 4 && (
          <StepNavigation
            currentStep={step}
            isNextDisabled={step === 1 && activityIds.length === 0}
            nextLabel={step === 3 ? 'Review Plan' : 'Continue'}
            onNext={goNext}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
