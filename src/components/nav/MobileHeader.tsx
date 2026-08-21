'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FishOutlineIcon } from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

interface MobileHeaderProps {
  title?: string
  userName?: string
}

export function MobileHeader({ title, userName = 'A' }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isRootTab = pathname === '/home' || pathname === '/memories' || pathname === '/hangouts'
  const displayTitle = title || (pathname === '/home' ? "Let's Go" : 'Plan')

  return (
    <header className={styles.mobileHeader}>
      {!isRootTab ? (
        <button
          onClick={() => router.back()}
          className={styles.backBtn}
          aria-label="Go back"
        >
          ←
        </button>
      ) : (
        <Link href="/home" className={styles.logoLink} style={{ fontSize: '1.1rem' }}>
          <FishOutlineIcon size={20} color="var(--accent-cyan)" />
        </Link>
      )}

      <h1 className={styles.headerTitle}>{displayTitle}</h1>

      <div className={styles.userAvatar} aria-label={`Logged in as ${userName}`}>
        {userName.charAt(0).toUpperCase()}
      </div>
    </header>
  )
}
