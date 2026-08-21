import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { logoutAction } from '@/lib/actions/auth'
import { SettingsIcon, FishOutlineIcon } from '@/components/ui/OceanIcons'

export const metadata: Metadata = {
  title: 'Ava — Settings',
  description: 'Manage your preferences and connection.',
}

export default async function SettingsPage() {
  const session = await getSession()
  const userName = session.name || 'Friend'
  const partnerName = userName.toLowerCase() === 'diva' ? 'Agam' : 'Diva'

  return (
    <div style={{ maxWidth: '680px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <SettingsIcon size={26} color="var(--accent-cyan)" />
        <div>
          <h1 className="text-h1">Settings</h1>
          <p className="text-body-sm text-secondary">Your connection and app preferences</p>
        </div>
      </header>

      <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
        <h2 className="text-h3">Connected Couple</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #0288D1, #00BCD4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FishOutlineIcon size={20} color="#fff" />
            </div>
            <div>
              <p className="text-body" style={{ fontWeight: 600 }}>{userName} &amp; {partnerName}</p>
              <p className="text-caption text-muted">Private space · Connected</p>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-cyan)', background: 'rgba(0, 188, 212, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(77, 208, 225, 0.3)' }}>
            ACTIVE
          </span>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="text-body-sm" style={{ fontWeight: 600 }}>Sign Out</p>
            <p className="text-caption text-muted">Lock this session on this device</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn-secondary" style={{ padding: '8px 18px', fontSize: 'var(--text-caption)' }}>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
