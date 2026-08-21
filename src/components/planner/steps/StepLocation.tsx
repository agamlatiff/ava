'use client'

import { useState } from 'react'
import type { LocationPreset } from '@/hooks/useAdventurePlanner'
import { MapPinIcon, SparklesIcon } from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepLocationProps {
  locationPreset: LocationPreset
  customLocation: string
  budgetDisplay: string
  notes: string
  onSelectPreset: (preset: LocationPreset) => void
  onChangeCustomLocation: (val: string) => void
  onChangeBudget: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeNotes: (val: string) => void
}

const PRESETS: { id: LocationPreset; title: string; sub: string }[] = [
  { id: 'not_decided', title: 'Not decided yet', sub: 'Pick spots together in the next step' },
  { id: 'campus', title: 'Somewhere near campus', sub: 'Cozy cafes and nearby hangout spots' },
  { id: 'downtown', title: 'Downtown & Central', sub: 'Vibrant streets, dining & entertainment' },
  { id: 'beach', title: 'Beachside & Coastline', sub: 'Scenic coastal breeze & ocean views' },
]

export function StepLocation({
  locationPreset,
  customLocation,
  budgetDisplay,
  notes,
  onSelectPreset,
  onChangeCustomLocation,
  onChangeBudget,
  onChangeNotes,
}: StepLocationProps) {
  const [showCustom, setShowCustom] = useState(locationPreset === 'custom')
  const [showOptionalExtras, setShowOptionalExtras] = useState(false)

  const handleCustomToggle = () => {
    setShowCustom(true)
    onSelectPreset('custom')
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 5 · Location &amp; Extras</span>
        <h2 className={styles.stepTitle}>Where should our adventure take us?</h2>
        <p className={styles.stepDescription}>
          Location is flexible. You can leave it open to decide together.
        </p>
      </div>

      <div className={styles.locationPresetsGrid} role="radiogroup" aria-label="Location choices">
        {PRESETS.map((p) => {
          const isSelected = locationPreset === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.presetOptionCard} ${
                isSelected ? styles.presetOptionCardSelected : ''
              }`}
              onClick={() => {
                setShowCustom(false)
                onSelectPreset(p.id)
              }}
              role="radio"
              aria-checked={isSelected}
            >
              <div className={styles.presetRadioIndicator}>
                {isSelected && <div className={styles.radioInnerGlow} />}
              </div>
              <div className={styles.presetTextGroup}>
                <span className={styles.presetTitle}>{p.title}</span>
                <span className={styles.presetSub}>{p.sub}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Custom Location Input ── */}
      <div className={styles.customDateDisclosure}>
        {!showCustom ? (
          <button
            type="button"
            className={styles.textDisclosureBtn}
            onClick={handleCustomToggle}
          >
            <MapPinIcon size={16} color="var(--accent-cyan)" /> Have a specific neighborhood in mind?
          </button>
        ) : (
          <div className={styles.customDateInputBox}>
            <label htmlFor="custom-area-input" className={styles.fieldSubLabel}>
              Enter area / district name:
            </label>
            <input
              id="custom-area-input"
              type="text"
              className="input-field"
              placeholder="e.g. Central Mall, Westlake, Old Town..."
              value={customLocation}
              onChange={(e) => onChangeCustomLocation(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ── Optional Budget & Notes Drawer ── */}
      <div className={styles.optionalExtrasWrapper}>
        <button
          type="button"
          className={styles.extrasToggleBtn}
          onClick={() => setShowOptionalExtras((prev) => !prev)}
        >
          <SparklesIcon size={15} color="var(--accent-cyan)" />
          {showOptionalExtras ? 'Hide budget & private note' : '+ Add budget & private note (optional)'}
        </button>

        {showOptionalExtras && (
          <div className={styles.extrasContentBox}>
            <div className={styles.extraFieldGroup}>
              <label htmlFor="budget-field" className={styles.fieldSubLabel}>
                Estimated Budget (optional):
              </label>
              <div className={styles.budgetInputWrapper}>
                <span className={styles.budgetPrefix}>Rp</span>
                <input
                  id="budget-field"
                  type="text"
                  className={`input-field ${styles.budgetInputField}`}
                  placeholder="100.000"
                  value={budgetDisplay}
                  onChange={onChangeBudget}
                />
              </div>
            </div>

            <div className={styles.extraFieldGroup}>
              <label htmlFor="notes-field" className={styles.fieldSubLabel}>
                Private note for the date (optional):
              </label>
              <textarea
                id="notes-field"
                className={`input-field ${styles.notesTextarea}`}
                placeholder="Any special thoughts, vibes, or things to remember..."
                value={notes}
                onChange={(e) => onChangeNotes(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
