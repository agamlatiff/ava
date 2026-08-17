'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AccessPage.module.css'

// Hard-coded secrets for Phase 1 UI testing — replaced by real API in Phase 2
const TEMP_SECRETS: Record<string, string> = {
  'agam-secret': 'agam',
  'diva-secret': 'diva',
}

type FormState = 'idle' | 'typing' | 'loading' | 'error' | 'success'

export function AccessPage() {
  const [secret, setSecret] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecret(e.target.value)
    setState(e.target.value.length > 0 ? 'typing' : 'idle')
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return

    setState('loading')

    // Phase 1: temporary client-side check
    await new Promise(r => setTimeout(r, 800)) // simulate network
    const user = TEMP_SECRETS[secret.trim()]

    if (user) {
      setState('success')
      setTimeout(() => router.push('/home'), 800)
    } else {
      setState('error')
      setErrorMsg('Invalid secret. Try again.')
      setTimeout(() => {
        setState('idle')
        inputRef.current?.focus()
      }, 1500)
    }
  }

  const inputClass = [
    'input-field',
    styles.secretInput,
    state === 'error' ? 'error' : '',
    state === 'error' ? 'shake' : '',
  ].filter(Boolean).join(' ')

  const cardClass = [
    'glass-card',
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
          {FEATURES.map((f) => (
            <li key={f.label} className={styles.bullet}>
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
              <span className={styles.inputIcon} aria-hidden="true">🐟</span>
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
                '🌊 Let\'s Go!'
              ) : (
                'Dive In'
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

const FEATURES = [
  { icon: '🗓️', label: 'Plan your hangout together' },
  { icon: '📍', label: 'Find the best place around you' },
  { icon: '⭐', label: 'Make every moment special' },
]
