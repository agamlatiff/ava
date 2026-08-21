'use client'

import { useAccessForm } from '@/hooks/useAccessForm'
import {
  CalendarIcon,
  MapPinIcon,
  SparklesIcon,
  FishOutlineIcon,
  ArrowRightIcon,
} from '@/components/ui/OceanIcons'
import styles from './AccessPage.module.css'

const FEATURES = [
  { icon: <CalendarIcon size={20} color="var(--accent-cyan)" />, label: 'Plan your hangout together' },
  { icon: <MapPinIcon size={20} color="var(--accent-cyan)" />, label: 'Find the best place around you' },
  { icon: <SparklesIcon size={20} color="var(--accent-cyan)" />, label: 'Make every moment special' },
]

export function AccessPage() {
  const {
    secret,
    state,
    errorMsg,
    inputRef,
    handleChange,
    handleSubmit,
  } = useAccessForm()

  const inputClass = [
    'input-field',
    styles.secretInput,
    state === 'error' ? 'error' : '',
    state === 'error' ? 'shake' : '',
  ].filter(Boolean).join(' ')

  const cardClass = [
    'glass-card-strong',
    styles.loginCard,
    state === 'success' ? 'glow-pulse' : '',
  ].filter(Boolean).join(' ')

  return (
    <main className={styles.root}>
      {/* ── Left side — Feature bullets (desktop only) ── */}
      <aside className={styles.aside}>
        <div className={styles.logoGroup}>
          <h1 className={`text-display ${styles.logo}`}>
            Let&apos;s<br />Go
          </h1>
          <p className={`text-body-sm text-secondary ${styles.logoSub}`}>
            Plan together, make memories
          </p>
        </div>

        <ul className={styles.bullets} aria-label="App features">
          {FEATURES.map((f, i) => (
            <li key={i} className={styles.bullet}>
              <span className={styles.bulletIcon} aria-hidden="true">{f.icon}</span>
              <span className="text-body text-secondary">{f.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Center — Login card ── */}
      <section className={styles.center}>
        {/* Mobile logo — only shown on small screens */}
        <div className={styles.mobileLogo} aria-hidden="true">
          <span className={`text-display ${styles.logo}`}>Let&apos;s Go</span>
          <p className="text-body-sm text-secondary">Plan together, make memories</p>
        </div>

        <div className={cardClass} role="region" aria-label="Access form">
          <h2 className={`text-h3 ${styles.cardTitle}`}>Enter your secret</h2>
          <p className={`text-body-sm text-muted ${styles.cardSub}`}>Only we know</p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                id="secret-input"
                type="password"
                className={inputClass}
                placeholder="Type your secret..."
                value={secret}
                onChange={handleChange}
                disabled={state === 'loading' || state === 'success'}
                autoComplete="current-password"
                aria-label="Your secret"
                aria-describedby={errorMsg ? 'error-msg' : undefined}
                aria-invalid={state === 'error'}
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <FishOutlineIcon size={20} color="var(--accent-cyan)" />
              </span>
            </div>

            {errorMsg && (
              <p
                id="error-msg"
                className={`text-body-sm ${styles.errorText}`}
                role="alert"
                aria-live="assertive"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              id="dive-in-btn"
              className={`btn-primary w-full ${styles.submitBtn} ${state === 'typing' ? styles.bright : ''}`}
              disabled={!secret.trim() || state === 'loading' || state === 'success'}
              aria-label="Dive in"
            >
              {state === 'loading' ? (
                <>
                  <span className={`spin ${styles.spinner}`} aria-hidden="true">⟳</span>
                  Diving in...
                </>
              ) : state === 'success' ? (
                <>Let&apos;s Go! <SparklesIcon size={18} /></>
              ) : (
                <>Dive In <ArrowRightIcon size={18} /></>
              )}
            </button>
          </form>
        </div>

        <p className={`text-body-sm text-muted ${styles.tagline}`}>
          Two people. One plan.
        </p>
      </section>
    </main>
  )
}
